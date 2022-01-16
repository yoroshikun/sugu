import handleChromeAction from "./chrome";
import handleUniversalAction from "./universal";
import detectBrowser from "../helpers/detectBrowser";

// Overseer handles multi browser actions
const handleAction = async (message, sender, sendResponse): Promise<any> => {
  // Always attempt universal actions first
  const universalAction = await handleUniversalAction(
    message,
    sender,
    sendResponse
  );
  if (universalAction) {
    return universalAction; // Return early if matched
  }

  const browser = detectBrowser();

  // Handle browser specific actions
  if (browser === "Google Chrome or Chromium") {
    return handleChromeAction(message, sender, sendResponse);
  }
  if (browser === "Mozilla Firefox") {
    // TODO: Add support for firefox
    return null;
  }
};

export default handleAction;
