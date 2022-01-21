import browser from "webextension-polyfill";

const getCurrentTab = async () => {
  return (await browser.tabs.query({ active: true, currentWindow: true }))[0];
};

export default getCurrentTab;
