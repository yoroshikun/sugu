import type { Action } from "./helpers/actionsList";
import { reset } from "./helpers/actionReset";
import { handleAction } from "./helpers/actions";

// Open on install
chrome.runtime.onInstalled.addListener((object) => {
  // Inject Omni on install
  const manifest = chrome.runtime.getManifest();

  const injectIntoTab = (tab) => {
    const scripts = manifest.content_scripts[0].js;
    const s = scripts.length;

    for (let i = 0; i < s; i++) {
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: [scripts[i]],
      });
    }

    chrome.scripting.insertCSS({
      target: { tabId: tab.id },
      files: [manifest.content_scripts[0].css[0]],
    });
  };

  // Get all windows
  chrome.windows.getAll(
    {
      populate: true,
    },
    (windows) => {
      let currentWindow;
      const w = windows.length;

      for (let i = 0; i < w; i++) {
        currentWindow = windows[i];

        let currentTab;
        const t = currentWindow.tabs.length;

        for (let j = 0; j < t; j++) {
          currentTab = currentWindow.tabs[j];
          injectIntoTab(currentTab);
        }
      }
    }
  );

  if (object.reason === "install") {
    chrome.tabs.create({ url: "https://alyssax.com/omni/" });
  }
});

// Check when the extension button is clicked
chrome.action.onClicked.addListener((tab) => {
  chrome.tabs.sendMessage(tab.id, { request: "open-omni" });
});

// Listen for the open omni shortcut
chrome.commands.onCommand.addListener((command) => {
  if (command === "open-omni") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { request: "open-omni" });
    });
  }
});

const reSyncOmni = async () => {
  await reset();
  const tabs = getTabs();
  const bookmarks = getBookmarks();
};

// Check if tabs have changed and actions need to be fetched again
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) =>
  reSyncOmni()
);
chrome.tabs.onCreated.addListener(async (tab) => reSyncOmni());
chrome.tabs.onRemoved.addListener(async (tabId, changeInfo) => reSyncOmni());

const getTabs = () => {
  chrome.tabs.query({}, (tabs) => {
    const tabActions: Action[] = tabs.map((tab) => ({
      title: tab.title,
      desc: "Chrome tab",
      keycheck: false,
      action: "switch-tab",
      type: "tab",
    }));

    return tabActions;
  });
};

const getBookmarks = () => {
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
          keyCheck: false,
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

// Receive messages from any tab
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  handleAction(message, sender, sendResponse).then(() => {});
  return true; // This is required for async! (https://stackoverflow.com/a/20077487)
});
