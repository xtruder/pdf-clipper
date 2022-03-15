export enum HighlightColor {
  RED = "red",
  YELLOW = "yellow",
  GREEN = "green",
  BLUE = "blue",
}

export interface HighlightMeta {
  // owner who created the highlight
  owner: string;

  // highlight creation time
  createdAt: Date;

  // highlight last update time
  updatedAt: Date;

  // state of the highlight whether still in flight or is already synced
  state?: "inflight" | "synced";

  // whether highlight is deleted
  deleted?: boolean;
}

export interface Highlight {
  id: string;
  location: any;
  content: any;
  meta?: HighlightMeta;
  deleted?: boolean;
}
