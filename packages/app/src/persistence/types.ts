import { Observable } from "rxjs";

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
  /**source of resource being downloaded */
  source: string;

  /**blob that is set when download has completed */
  blob: Blob | null;

  /** download progress between 0 and 1 */
  progress: LoadProgress;
}

export interface BlobUploader {
  upload(blob: Blob): Observable<UploadStatus>;
}

export interface BlobDownloader {
  download(
    source: string,
    size: number,
    mimeType: string
  ): Observable<DownloadStatus>;
}
