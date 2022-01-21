import handleChromeAction from "./chrome";
import handleFirefoxAction from "./firefox";
import handleBrowserAction from "./browser";
import detectBrowser from "../helpers/detectBrowser";

// Overseer handles multi browser actions
const handleAction = async (message, sender): Promise<any> => {
  // Always attempt polyfilled actions first
  const browserActions = await handleBrowserAction(message, sender);

  if (browserActions) {
    return browserActions; // Return early if matched
  }

  const browser = detectBrowser();

  // Handle browser specific actions
  if (browser === "Google Chrome or Chromium") {
    return handleChromeAction(message, sender);
  }
  if (browser === "Mozilla Firefox") {
    return handleFirefoxAction(message, sender);
  }
};

export default handleAction;
