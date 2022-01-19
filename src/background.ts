import refreshActions from "./actions/refreshActions";
import handleAction from "./actions/handleAction";
import { getBookmarks, getTabs } from "./actions/chrome";

// Open on install
chrome.runtime.onInstalled.addListener((object) => {
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

  // if (object.reason === "install") {
  //   chrome.tabs.create({ url: "https://github.com/yoroshikun/sugu-search" });
  // }
});

chrome.action.onClicked.addListener((tab) => {
  chrome.tabs.sendMessage(tab.id, { request: "open-sugu" });
});

chrome.commands.onCommand.addListener((command) => {
  if (command === "open-sugu") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { request: "open-sugu" });
    });
  }
});

const reSyncSugu = async () => {
  const tabs = await getTabs();
  const bookmarks = getBookmarks();
  await refreshActions([...tabs, ...bookmarks]);
  // Send a message back to the content script
};

// Check if tabs have changed and actions need to be fetched again
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) =>
  reSyncSugu()
);
chrome.tabs.onCreated.addListener(async (tab) => reSyncSugu());
chrome.tabs.onRemoved.addListener(async (tabId, changeInfo) => reSyncSugu());

// Receive messages from any tab
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  handleAction(message, sender, sendResponse).then(() => {});
  return true; // This is required for async! (https://stackoverflow.com/a/20077487)
});
