import { CID, IPFSHTTPClient } from "ipfs-http-client";
import { BehaviorSubject, defer, Observable } from "rxjs";

import {
  BlobDownloader,
  BlobUploader,
  DownloadStatus,
  UploadStatus,
} from "./types";

export class IPFSClient implements BlobUploader, BlobDownloader {
  constructor(private client: IPFSHTTPClient) {}

  /**uploads blob to IPFS and reports upload progress */
  upload(blob: Blob): Observable<UploadStatus> {
    const subject = new BehaviorSubject<UploadStatus>({
      source: null,
      progress: { loaded: 0, total: 0 },
    });

    this.client
      .add(blob, {
        progress: (loaded) => {
          const progress = loaded / blob.size;

          if (progress < 1)
            subject.next({
              source: null,
              progress: { loaded, total: blob.size },
            });
        },
      })
      .then(({ cid }) => {
        const source = `ipfs://${cid.toV1().toString()}`;

        subject.next({
          source,
          progress: { loaded: blob.size, total: blob.size },
        });
      })
      .catch((err) => subject.error(err));

    return subject;
  }

  download(
    source: string,
    size: number,
    mimeType: string
  ): Observable<DownloadStatus> {
    const ipfs = this.client;

    return defer(async function* () {
      const cidStr = new URL(source).host;
      const cid = CID.parse(cidStr);

      let chunks: Uint8Array[] = [];
      let loaded: number = 0;
      for await (const chunk of ipfs.get(cid)) {
        chunks.push(chunk);
        loaded += chunk.byteLength;

        // report document download progress
        yield { source, progress: { loaded, total: size }, blob: null };
      }

      // create blob from downloaded chunks
      const blob = new Blob(chunks, { type: mimeType });

      yield { source, progress: { loaded: size, total: size }, blob };
    });
  }
}
