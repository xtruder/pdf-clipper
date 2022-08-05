import debug from "debug";
import {
  from,
  Observable,
  of,
  mergeMap,
  filter,
  map,
  tap,
  distinct,
  forkJoin,
  first,
  firstValueFrom,
} from "rxjs";

import { sha256 } from "~/lib/crypto";
import { blobToDataURL } from "~/lib/dom";

import { BlobInfo, BlobType } from "~/types";
import { Database, BlobInfoDocument } from "./rxdb";

/**BlobCache defines interface for blob caching */
export interface BlobCache {
  /**saves blob to cache by key */
  save(key: string, blob: Blob): Promise<void>;

  /**loads blob by from cache */
  load(key: string, mimeType: string): Promise<Blob | null>;

  /**removes key from blob cache */
  remove(key: string): Promise<void>;

  /**checks whether blob is in cache */
  has(key: string): Promise<boolean>;
}

export interface LoadProgress {
  loaded: number;
  total: number;
}

export interface UploadStatus {
  /**source URI of uploaded resource, set when upload has finished */
  source: string | null;

  /**upload progress between 0 and 1 */
  progress: LoadProgress;
}

export interface DownloadStatus {
  /**blob to be downloaded */
  blob: Blob | null;

  /**blob download progress */
  progress: LoadProgress;
}

export interface BlobLoader {
  upload(blob: Blob): Observable<UploadStatus>;

  download(
    source: string,
    size: number,
    mimeType: string
  ): Observable<DownloadStatus>;
}

export interface BlobLoadStatus {
  /**blob that is set when download has completed */
  blob: Blob | null;

  /**information about blob that is being loaded */
  info: BlobInfo;

  /** download progress between 0 and 1 */
  progress?: LoadProgress;
}

export interface BlobUploadTask {
  /**hash of the blob that is being uploaded */
  hash: string;

  /**name of the uploader user */
  uploader: string;

  /**status of upload */
  status: Observable<UploadStatus>;
}

export interface StoreOptions {
  /**whether to sync Blob */
  sync?: boolean;
}

export class BlobStore {
  private log = debug("blobstore");

  private loaders: Record<string, BlobLoader> = {};

  private uploads: Observable<{
    blobInfo: BlobInfoDocument;
    progress: LoadProgress;
  }>;

  private finishedUploads: Observable<BlobInfoDocument>;

  //  private subscription: Subscription | undefined;

  constructor(private db: Database, private blobCache: BlobCache) {
    this.uploads = this.createUploader();
    this.finishedUploads = this.uploads.pipe(
      filter(({ blobInfo }) => !!blobInfo.source),
      map(({ blobInfo }) => blobInfo)
    );
  }

  /**stores Blob to Blobstore */
  async store(
    type: BlobType,
    blob: Blob,
    { sync = true }: StoreOptions = {}
  ): Promise<BlobInfo> {
    const hash = await sha256(await blob.arrayBuffer());

    await this.blobCache.save(hash, blob);

    return await this.db.blobinfos.atomicUpsert({
      hash: hash,
      type,
      mimeType: blob.type,
      size: blob.size,
      sync,
    });
  }

  /**loads Blob form Blobstore. If blob is avalible in cache it will load it
   * from there, in other case it will download it and cache it.
   */
  load$(hash: string): Observable<BlobLoadStatus> {
    return this.getBlobInfo(hash).pipe(
      mergeMap((blobInfo) =>
        from(this.blobCache.load(hash, blobInfo.mimeType)).pipe(
          map((blob) =>
            blob ? blob.slice(0, blob.size, blobInfo.mimeType) : null
          ),
          tap(
            (blob) =>
              blob &&
              this.log("blob loaded from cache: %s/%s", blobInfo.type, hash)
          ),
          mergeMap((blob) =>
            blob ? of({ blob, info: blobInfo }) : this.downloadBlob(blobInfo)
          )
        )
      )
    );
  }

  async load(hash: string): Promise<Blob> {
    return firstValueFrom(
      this.load$(hash).pipe(
        filter(({ blob }) => !!blob),
        map(({ blob }) => blob!)
      )
    );
  }

  async loadAsDataURL(hash: string): Promise<string> {
    return firstValueFrom(
      this.load$(hash).pipe(
        filter(({ blob }) => !!blob),
        map(({ blob }) => blobToDataURL(blob!))
      )
    );
  }

  getUpload(hash: string) {
    return this.uploads.pipe(first(({ blobInfo }) => blobInfo.hash === hash));
  }

  getFinishedUpload(hash: string) {
    return this.finishedUploads.pipe(
      first((blobInfo) => blobInfo.hash === hash)
    );
  }

  addLoader(type: BlobType, loader: BlobLoader) {
    this.loaders[type] = loader;
  }

  startUploader() {
    this.uploads.subscribe();
  }

  private downloadBlob(blobInfo: BlobInfo): Observable<BlobLoadStatus> {
    if (!blobInfo.source) {
      return of({
        blob: null,
        info: blobInfo,
      });
    }

    this.log("downloading blob %s of type %s", blobInfo.hash, blobInfo.type);

    const loader = this.loaders[blobInfo.type];
    if (!loader) throw new Error("invalid loader type: " + blobInfo.type);

    return loader
      .download(blobInfo.source, blobInfo.size, blobInfo.mimeType)
      .pipe(
        map(({ blob, progress }) => ({
          blob,
          info: blobInfo,
          progress,
        })),

        tap(({ blob, progress: { loaded, total } }) =>
          blob
            ? this.log("blob downloaded %s", blobInfo.hash)
            : this.log("downloading blog %s: %d", blobInfo.hash, loaded / total)
        ),

        // save blob to cache, when it has finished loading
        tap(({ blob }) => blob && this.blobCache.save(blobInfo.hash, blob))
      );
  }

  private getBlobInfo(hash: string): Observable<BlobInfoDocument> {
    return this.db.blobinfos
      .findOne({
        selector: {
          hash,
        },
      })
      .$.pipe(
        filter((v) => !!v),
        map((v) => v!)
      );
  }

  private createUploader(): Observable<{
    blobInfo: BlobInfoDocument;
    progress: LoadProgress;
  }> {
    // find all blobs that don't have source
    const docs$ = this.db.blobinfos
      .find({
        selector: {
          source: { $exists: false },
        },
      })
      .$.pipe(mergeMap((b) => b));

    return docs$.pipe(
      // only upload each blob once
      distinct((blob) => blob.hash),

      // load blob from cache
      mergeMap((blobInfo) =>
        forkJoin({
          blobInfo: of(blobInfo),
          blob: this.blobCache.load(blobInfo.hash, blobInfo.mimeType),
        })
      ),

      // only blobs that are cached locally
      filter(({ blob }) => !!blob),

      // do the actual upload
      mergeMap(({ blob, blobInfo }) =>
        this.loaders[blobInfo.type].upload(blob!).pipe(
          tap(({ source, progress: { loaded, total } }) =>
            source
              ? this.log("blob %s uploaded to %s", blobInfo.hash, source)
              : this.log("uploading blob %s: %d", blobInfo.hash, loaded / total)
          ),

          mergeMap(async ({ source, progress }) => {
            if (source) {
              blobInfo = await blobInfo.atomicPatch({ source });
            }

            return { blobInfo, progress };
          })
        )
      )
    );
  }
}
