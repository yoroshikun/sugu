import browser from "webextension-polyfill";
import refreshActions from "./actions/refreshActions";
import handleAction from "./actions/handleAction";
import { getBookmarks, getTabs } from "./actions/browser";
import getCurrentTab from "./helpers/getCurrentTab";

// Open on install
browser.runtime.onInstalled.addListener(async (object) => {
  const manifest = browser.runtime.getManifest();

  const injectIntoTab = (tab) => {
    // Dont inject on non injectable pages
    if (tab.url.startsWith("chrome") || tab.url.startsWith("about:")) {
      return;
    }

    for (const script of manifest.content_scripts[0].js) {
      browser.scripting.executeScript({
        target: { tabId: tab.id },
        files: [script],
      });
    }

    for (const css of manifest.content_scripts[0].css)
      browser.scripting.insertCSS({
        target: { tabId: tab.id },
        files: [css],
      });
  };

  // Get and inject all windows
  const windows = await browser.windows.getAll({
    populate: true,
  });

  for (const window of windows) {
    for (const tab of window.tabs) {
      injectIntoTab(tab);
    }
  }

  // if (object.reason === "install") {
  //   browser.tabs.create({ url: "https://github.com/yoroshikun/sugu-search" });
  // }
});

browser[browser.action ? "action" : "browserAction"].onClicked.addListener(
  (tab) => {
    browser.tabs.sendMessage(tab.id, { request: "open-sugu" });
  }
);

browser.commands.onCommand.addListener(async (command) => {
  if (command === "open-sugu") {
    const tab = await getCurrentTab();
    if (tab.url.includes("chrome://") || tab.url.startsWith("about:")) {
      // Create new page
      return browser.tabs.create({ url: "./sugu-new.html" });
    }

    return browser.tabs.sendMessage(tab.id, { request: "open-sugu" });
  }
});

const reSyncSugu = async () => {
  const tabs = await getTabs();
  const bookmarks = await getBookmarks();
  await refreshActions([...tabs, ...bookmarks]);
  // Send a message back to the content script
};

// Check if tabs have changed and actions need to be fetched again
browser.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) =>
  reSyncSugu()
);
browser.tabs.onCreated.addListener(async (tab) => reSyncSugu());
browser.tabs.onRemoved.addListener(async (tabId, changeInfo) => reSyncSugu());

// Receive messages from any tab
browser.runtime.onMessage.addListener(async (message, sender) =>
  handleAction(message, sender)
);
