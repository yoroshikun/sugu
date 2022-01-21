import type { Action } from "./types";
import refreshActions from "./refreshActions";
import { History, Star } from "./icons/fluidui";
import browser, { Bookmarks, Tabs } from "webextension-polyfill";
import detectBrowser from "../helpers/detectBrowser";
import getCurrentTab from "../helpers/getCurrentTab";

// Helpers
export const getTabs = async (): Promise<Action[]> => {
  const tabs = await browser.tabs.query({});

  return tabs.map((tab) => ({
    title: tab.title,
    description: "Browser tab",
    showKeys: false,
    action: "switch-tab",
    type: "tab",
    tabIndex: tab.index,
  }));
};

export const getBookmarks = async () => {
  const tempActions: Action[] = [];

  const process_bookmark = (bookmark: Bookmarks.BookmarkTreeNode) => {
    if (bookmark.url) {
      tempActions.push({
        title: bookmark.title,
        description: bookmark.url,
        bookmarkId: bookmark.id,
        url: bookmark.url,
        type: "bookmark",
        action: "bookmark",
        icon: Star,
      });
    }

    if (bookmark.children) {
      for (const child of bookmark.children) {
        process_bookmark(child);
      }
    }
  };

  const tree = await browser.bookmarks.getTree();

  for (const bookmark of tree) {
    process_bookmark(bookmark);
  }

  return tempActions;
};

// Actions
const switchTab = async (tab: Action) =>
  browser.tabs.highlight({
    tabs: tab?.tabIndex,
  });

const goBack = async (tab: Tabs.Tab) => browser.tabs.goBack(tab.id);

const goForward = async (tab: Tabs.Tab) => browser.tabs.goForward(tab.id);

const duplicateTab = async (_: Tabs.Tab) => {
  const currentTab = await getCurrentTab();

  browser.tabs.duplicate(currentTab.id);
};

const createBookmark = async (_: Tabs.Tab) => {
  const currentTab = await getCurrentTab();

  await browser.bookmarks.create({
    title: currentTab.title,
    url: currentTab.url,
  });
};

const muteTab = async (mute: boolean) => {
  const currentTab = await getCurrentTab();

  await browser.tabs.update(currentTab.id, { muted: mute });
};

const reloadTab = async () => browser.tabs.reload();

const pinTab = async (pin: boolean) => {
  const currentTab = await getCurrentTab();

  await browser.tabs.update(currentTab.id, { pinned: pin });
};

// All of these are kinda dangerous! (clearing data)
const clearAllData = () =>
  browser.browsingData.remove(
    {
      since: new Date().getTime(),
    },
    {
      // appcache: true,
      cache: true,
      cookies: true,
      downloads: true,
      // fileSystems: true,
      formData: true,
      history: true,
      indexedDB: true,
      localStorage: true,
      passwords: true,
      serviceWorkers: true,
      // webSQL: true,
    }
  );

const clearBrowsingData = () =>
  browser.browsingData.removeHistory({ since: 0 });

const clearCookies = () => browser.browsingData.removeCookies({ since: 0 });

const clearCache = () => browser.browsingData.removeCache({ since: 0 });

const clearLocalStorage = () =>
  browser.browsingData.removeLocalStorage({ since: 0 });

const clearPasswords = () => browser.browsingData.removePasswords({ since: 0 });

const openBrowserUrl = async (url: string) => {
  const browserUA = detectBrowser();

  if (
    browserUA === "Google Chrome or Chromium" ||
    browserUA === "Microsoft Edge (Chromium)"
  ) {
    browser.tabs.create({ url: "chrome://" + url + "/" });
  }

  if (browserUA === "Mozilla Firefox") {
    if (url === "extensions") url = "addons";
    if (url === "settings") url = "preferences";

    if (url === "addons" || url === "preferences") {
      browser.tabs.create({ url: "about:" + url });
    }
  }
};

const openIncognito = async () => browser.windows.create({ incognito: true });

const closeWindow = async (id: number) => browser.windows.remove(id);

const closeTab = async (tab: Tabs.Tab) => browser.tabs.remove(tab.id);

const closeCurrentTab = async () => closeTab(await getCurrentTab());

const removeBookmark = async (bookmark: { id: string }) =>
  browser.bookmarks.remove(bookmark.id);

const searchHistory = async (query) => {
  const history = await browser.history.search({
    text: query,
    maxResults: 1000,
    startTime: 31536000000 * 5,
  });

  return history.map((action) => ({
    title: action.title,
    description: action.url,
    type: "history",
    action: "history",
    icon: History,
  }));
};

const handleAction = async (message, sender): Promise<any> => {
  switch (message.request) {
    case "get-actions":
      const tabs = await getTabs();
      const bookmarks = await getBookmarks();
      const actions = await refreshActions([...tabs, ...bookmarks]);
      return { actions };
    case "switch-tab":
      return switchTab(message.tab);
    case "go-back":
      return goBack(message.tab);
    case "go-forward":
      return goForward(message.tab);
    case "duplicate-tab":
      return duplicateTab(message.tab);
    case "create-bookmark":
      return createBookmark(message.tab);
    case "mute":
      return await muteTab(true);
    case "unmute":
      return muteTab(false);
    case "reload":
      return reloadTab();
    case "pin":
      return pinTab(true);
    case "unpin":
      return pinTab(false);
    case "remove-all":
      return clearAllData();
    case "remove-history":
      return clearBrowsingData();
    case "remove-cookies":
      return clearCookies();
    case "remove-cache":
      return clearCache();
    case "remove-local-storage":
      return clearLocalStorage();
    case "remove-passwords":
      return clearPasswords();
    case "history": // Fallthrough
    case "downloads":
    case "extensions":
    case "settings":
    case "extensions/shortcuts":
      return openBrowserUrl(message.request);
    case "manage-data":
      return openBrowserUrl("settings/clearBrowserData");
    case "incognito":
      return openIncognito();
    case "close-window":
      return closeWindow(sender.tab.windowId);
    case "close-current-tab":
      return closeCurrentTab();
    case "search-history":
      const newActions = searchHistory(message.query);
      return { history: newActions };
    case "remove":
      if (message.type == "bookmark") {
        removeBookmark(message.action);
      } else {
        closeTab(message.action);
      }
      return;
  }
};

export default handleAction;
