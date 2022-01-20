export interface Action {
  title: string;
  description: string;
  type: "action" | "history" | "tab" | "bookmark";
  action: string;
  icon?: string;
  url?: string;
  showKeys?: boolean;
  keys?: string[];
  favIconUrl?: string;
  bookmarkId?: string;
  tabIndex?: number;
}
