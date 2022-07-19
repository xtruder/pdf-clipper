import { IPFSHTTPClient } from "ipfs-http-client";
import { BehaviorSubject } from "rxjs";

export class IPFSClient {
  constructor(private client: IPFSHTTPClient) {}

  /**uploads blob to IPFS and reports upload progress */
  upload(blob: Blob) {
    const subject = new BehaviorSubject<{
      cid: string | null;
      progress: number;
    }>({
      cid: null,
      progress: 0,
    });

    this.client
      .add(blob, {
        progress: (bytes) => {
          const progress = bytes / blob.size;

          if (progress < 1)
            subject.next({ cid: null, progress: bytes / blob.size });
        },
      })
      .then(({ cid }) => {
        subject.next({ cid: cid.toV1().toString(), progress: 1 });
      })
      .catch((err) => subject.error(err));

    return subject;
  }
}
