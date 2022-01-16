import type { Action } from "./types";
import getCurrentTab from "../helpers/getCurrentTab";
import refreshActions from "./refreshActions";

// Helpers
export const getTabs = () => {
  return new Promise<Action[]>((resolve, reject) => {
    chrome.tabs.query({}, (tabs) => {
      const newActions: Action[] = [];

      for (const tab of tabs) {
        newActions.push({
          title: tab.title,
          desc: "Chrome tab",
          showKeys: false,
          action: "switch-tab",
          type: "tab",
          tabIndex: tab.index,
        });
      }

      resolve(newActions);
    });
  });
};

export const getBookmarks = () => {
  const newActions: Action[] = [];

  const process_bookmark = (bookmarks: chrome.bookmarks.BookmarkTreeNode[]) => {
    for (const bookmark of bookmarks) {
      if (bookmark.url) {
        newActions.push({
          title: bookmark.title,
          desc: "Bookmark",
          bookmarkId: bookmark.id,
          url: bookmark.url,
          type: "bookmark",
          action: "bookmark",
          emoji: true,
          emojiChar: "⭐️",
          showKeys: false,
        });
      }

      if (bookmark.children) {
        process_bookmark(bookmark.children);
      }
    }
  };

  chrome.bookmarks.getTree(process_bookmark);

  return newActions;
};

// Actions
const switchTab = async (tab: Action) =>
  chrome.tabs.highlight({
    tabs: tab?.tabIndex,
  });

const goBack = async (tab: chrome.tabs.Tab) => chrome.tabs.goBack(tab.id);

const goForward = async (tab: chrome.tabs.Tab) => chrome.tabs.goForward(tab.id);

const duplicateTab = async (_: chrome.tabs.Tab) => {
  const currentTab = await getCurrentTab();

  chrome.tabs.duplicate(currentTab.id);
};

const createBookmark = async (_: chrome.tabs.Tab) => {
  const currentTab = await getCurrentTab();

  await chrome.bookmarks.create({
    title: currentTab.title,
    url: currentTab.url,
  });
};

const muteTab = async (mute: boolean) => {
  const currentTab = await getCurrentTab();

  await chrome.tabs.update(currentTab.id, { muted: mute });
};

const reloadTab = async () => chrome.tabs.reload();

const pinTab = async (pin: boolean) => {
  const currentTab = await getCurrentTab();

  await chrome.tabs.update(currentTab.id, { pinned: pin });
};

// All of these are kinda dangerous! (clearing data)
const clearAllData = () =>
  chrome.browsingData.remove(
    {
      since: new Date().getTime(),
    },
    {
      appcache: true,
      cache: true,
      cookies: true,
      downloads: true,
      fileSystems: true,
      formData: true,
      history: true,
      indexedDB: true,
      localStorage: true,
      passwords: true,
      serviceWorkers: true,
      webSQL: true,
    }
  );

const clearBrowsingData = () => chrome.browsingData.removeHistory({ since: 0 });

const clearCookies = () => chrome.browsingData.removeCookies({ since: 0 });

const clearCache = () => chrome.browsingData.removeCache({ since: 0 });

const clearLocalStorage = () =>
  chrome.browsingData.removeLocalStorage({ since: 0 });

const clearPasswords = () => chrome.browsingData.removePasswords({ since: 0 });

const openChromeUrl = async (url: string) =>
  await chrome.tabs.create({ url: "chrome://" + url + "/" });

const openIncognito = async () =>
  await chrome.windows.create({ incognito: true });

const closeWindow = async (id: number) => await chrome.windows.remove(id);

const closeTab = async (tab: chrome.tabs.Tab) =>
  await chrome.tabs.remove(tab.id);

const removeBookmark = async (bookmark: { id: string }) =>
  await chrome.bookmarks.remove(bookmark.id);

const searchHistory = (query) => {
  const newActions: Action[] = [];

  chrome.history.search(
    {
      text: query,
      maxResults: 1000,
      startTime: 31536000000 * 5,
    },
    (data) => {
      for (const action of data) {
        newActions.push({
          title: action.title,
          type: "history",
          emoji: true,
          emojiChar: "🏛",
          action: "history",
          desc: action.url,
        });
      }
    }
  );

  return newActions;
};

const handleAction = async (message, sender, sendResponse): Promise<any> => {
  switch (message.request) {
    case "get-actions":
      const tabs = await getTabs();
      const bookmarks = getBookmarks();
      console.log(tabs, bookmarks);
      const actions = await refreshActions([...tabs, ...bookmarks]);
      return sendResponse({ actions });
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
      return openChromeUrl(message.request);
    case "manage-data":
      return openChromeUrl("settings/clearBrowserData");
    case "incognito":
      return openIncognito();
    case "close-window":
      return closeWindow(sender.tab.windowId);
    case "search-history":
      const newActions = searchHistory(message.query);
      return sendResponse({ history: newActions });
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
