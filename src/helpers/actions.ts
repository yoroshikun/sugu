import type { Action } from "./actionsList";
import getCurrentTab from "./getCurrentTab";
import { reset } from "./actionReset";

const switchTab = async (tab: chrome.tabs.Tab) => {
  await chrome.tabs.highlight({
    tabs: tab.index,
  });
};

const goBack = async (tab: chrome.tabs.Tab) => {
  await chrome.tabs.goBack(tab.id);
};

const goForward = async (tab: chrome.tabs.Tab) => {
  await chrome.tabs.goForward(tab.id);
};

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

  console.log(currentTab, mute);

  await chrome.tabs.update(currentTab.id, { muted: mute });
};

const reloadTab = async () => {
  await chrome.tabs.reload();
};

const pinTab = async (pin: boolean) => {
  const currentTab = await getCurrentTab();

  await chrome.tabs.update(currentTab.id, { pinned: pin });
};

// All of these are kinda dangerous! (clearing data)
const clearAllData = () => {
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
};

const clearBrowsingData = () => {
  chrome.browsingData.removeHistory({ since: 0 });
};

const clearCookies = () => {
  chrome.browsingData.removeCookies({ since: 0 });
};

const clearCache = () => {
  chrome.browsingData.removeCache({ since: 0 });
};

const clearLocalStorage = () => {
  chrome.browsingData.removeLocalStorage({ since: 0 });
};

const clearPasswords = () => {
  chrome.browsingData.removePasswords({ since: 0 });
};

const openChromeUrl = async (url: string) => {
  await chrome.tabs.create({ url: "chrome://" + url + "/" });
};

const openIncognito = async () => {
  await chrome.windows.create({ incognito: true });
};

const closeWindow = async (id: number) => {
  await chrome.windows.remove(id);
};

const closeTab = async (tab: chrome.tabs.Tab) => {
  await chrome.tabs.remove(tab.id);
};

const removeBookmark = async (bookmark) => {
  await chrome.bookmarks.remove(bookmark.id);
};

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
};

export const handleAction = async (message, sender, sendResponse) => {
  switch (message.request) {
    case "get-actions":
      const actions = await reset();
      console.log(actions);
      await sendResponse({ actions });
      return true;
    case "switch-tab":
      switchTab(message.tab);
      break;
    case "go-back":
      goBack(message.tab);
      break;
    case "go-forward":
      goForward(message.tab);
      break;
    case "duplicate-tab":
      duplicateTab(message.tab);
      break;
    case "create-bookmark":
      createBookmark(message.tab);
      break;
    case "mute":
      await muteTab(true);
      break;
    case "unmute":
      muteTab(false);
      break;
    case "reload":
      reloadTab();
      break;
    case "pin":
      pinTab(true);
      break;
    case "unpin":
      pinTab(false);
      break;
    case "remove-all":
      clearAllData();
      break;
    case "remove-history":
      clearBrowsingData();
      break;
    case "remove-cookies":
      clearCookies();
      break;
    case "remove-cache":
      clearCache();
      break;
    case "remove-local-storage":
      clearLocalStorage();
      break;
    case "remove-passwords":
      clearPasswords();
    case "history": // Fallthrough
    case "downloads":
    case "extensions":
    case "settings":
    case "extensions/shortcuts":
      openChromeUrl(message.request);
      break;
    case "manage-data":
      openChromeUrl("settings/clearBrowserData");
      break;
    case "incognito":
      openIncognito();
      break;
    case "close-window":
      closeWindow(sender.tab.windowId);
      break;
    case "search-history":
      const newActions = searchHistory(message.query);
      sendResponse({ history: newActions });
      break;
    case "remove":
      if (message.type == "bookmark") {
        removeBookmark(message.action);
      } else {
        closeTab(message.action);
      }
      break;
  }
};
