import debug from "debug";
import { forkJoin, mergeMap, of, pipe, tap, share } from "rxjs";
import { DocumentHighlightDocument } from "~/persistence/collections/documentHighlight";

import { IPFSClient } from "~/persistence/ipfs";
import { Database } from "~/persistence/rxdb";

const log = debug("services:IPFSImageUploader");

export function createIPFSHighlightImageUploader(
  db: Database,
  client: IPFSClient
) {
  const imgsToUpload$ = db.documenthighlights
    .find({
      selector: {
        $and: [
          // have image attached
          { image: { $exists: true } },

          // but no image
          { "image.source": { $exists: false } },
        ],
      },
    })
    .$.pipe(mergeMap((doc) => doc));

  const uploadImgs = pipe(
    // get image associated with highlight
    mergeMap((highlight: DocumentHighlightDocument) =>
      forkJoin({
        highlight: of(highlight),
        image: highlight.getCachedImage(),
      })
    ),

    tap(({ highlight }) => log("uploading image for highlight", highlight.id)),

    // do the actual upload
    mergeMap(({ highlight, image }) =>
      uploadHighlightImgToIPFS(highlight, image!)
    ),

    tap(({ highlight, progress }) =>
      log("highlight image upload progress", highlight.id, progress)
    )
  );

  const uploadHighlightImgToIPFS = (
    highlight: DocumentHighlightDocument,
    image: Blob
  ) =>
    client.upload(image).pipe(
      mergeMap(async ({ cid, progress }) => {
        log("highlight image uploaded", cid);

        // add source to document
        highlight = await highlight.atomicPatch({
          image: {
            ...highlight.image!,
            source: `ipfs://${cid}`,
          },
        });

        return { highlight, progress };
      })
    );

  const uploads$ = imgsToUpload$.pipe(uploadImgs, share());

  const start = () => {
    log("starting ipfs highlight image uploader");
    return uploads$.subscribe();
  };

  return { start };
}
