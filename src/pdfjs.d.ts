import type { PDFViewer as BasePDFViewer } from "pdfjs-dist/web/pdf_viewer";

declare module "pdfjs-dist/web/pdf_viewer" {
  export interface PageView {
    viewport: Viewport;
    canvas: HTMLCanvasElement;
    textLayer?: {
      textLayerDiv: HTMLDivElement;
    };
    div: HTMLDivElement;
  }

  export class PDFViewer extends BasePDFViewer {
    getPageView(index: number): PageView | null;
  }
}
