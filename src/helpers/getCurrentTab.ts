import detectBrowser from "./detectBrowser";

// Cross browser get current tab
const getCurrentTab = async () => {
  const browser = detectBrowser();

  if (
    browser === "Google Chrome or Chromium" ||
    browser === "Microsoft Edge (Chromium)"
  ) {
    return (await chrome.tabs.query({ active: true, currentWindow: true }))[0];
  }
  if (browser === "Mozilla Firefox") {
    // TODO: Add support for firefox
    return null;
  }
  if (browser === "Apple Safari") {
    // TODO: Add support for safari
    return null;
  }

  return null;
};

export default getCurrentTab;
