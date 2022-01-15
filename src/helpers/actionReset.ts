import type { Action } from "./actionsList";
import actionsList from "./actionsList";
import getCurrentTab from "./getCurrentTab";

const reset = async () => {
  const actions: Action[] = [];
  const currentTab = await getCurrentTab();
  const isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0; // Possible deprecation issue
  const isMuted = currentTab.mutedInfo.muted || false;
  const isPinned = currentTab.pinned || false;

  // Add all actions to the actions array

  for (const action of Object.values(actionsList)) {
    if (!isMac && action.keys.length > 0) {
      // Automated key replacement
      action.keys = action.keys.map((key) =>
        key.replace("⌘", "Ctrl").replace("⌥", "Alt").replace("⇧", "Shift")
      );

      // Custom replacement
      switch (action.action) {
        case "reload":
          action.keys = ["F5"];
          break;
        case "fullscreen":
          action.keys = ["F11"];
          break;
        case "downloads":
          action.keys = ["Ctrl", "J"];
          break;
        case "settings":
          action.keyCheck = false;
          break;
        case "history":
          action.keys = ["Ctrl", "H"];
          break;
        case "go-back":
          action.keys = ["Alt", "←"];
          break;
        case "go-forward":
          action.keys = ["Alt", "→"];
          break;
        case "scroll-top":
          action.keys = ["Home"];
          break;
        case "scroll-bottom":
          action.keys = ["End"];
          break;
      }
    }

    // Special Cases to skip (this can be done better)
    if (action.action === "mute" && isMuted) {
      continue;
    }
    if (action.action === "unmute" && !isMuted) {
      continue;
    }
    if (action.action === "pin" && isPinned) {
      continue;
    }
    if (action.action === "unpin" && !isPinned) {
      continue;
    }

    // Add the action to the actions array
    actions.push(action);
  }

  return actions;
};

// Nicer looking init
const init = () => reset();

export { init, reset };
