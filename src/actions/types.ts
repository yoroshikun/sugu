export interface Action {
  title: string;
  desc: string;
  type: "action" | "history" | "tab" | "bookmark";
  action: string;
  emoji?: boolean;
  emojiChar?: string;
  url?: string;
  showKeys?: boolean;
  keys?: string[];
  favIconUrl?: string;
  bookmarkId?: string;
  tabIndex?: number;
}
