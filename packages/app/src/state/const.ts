export const paths = {
  docInfo: (docId: string) => `docs/${docId}/info.json`,
  docReadingInfo: (docId: string) => `docs/${docId}/reading.json`,
  docHighlights: (docId: string) => `docs/${docId}/hihlights.json`,
  highlightImg: (docId: string, highlightId: string) =>
    `docs/${docId}/highlight-${highlightId}.png`,
  file: (fileId: string, ext: string) => `files/${fileId}.${ext}`,
};
