import type { Action } from "./types";
import actionsList from "./list/default";
import addonActionList from "./list/addon";
import getCurrentTab from "../helpers/getCurrentTab";

// Cached Defaults include all actions
let cachedDefaultActions: Action[] = [];

const refreshActions = async (additionalActions?: Action[]) => {
  const currentTab = await getCurrentTab();
  const isMuted = currentTab.mutedInfo.muted || false;
  const isPinned = currentTab.pinned || false;

  if (cachedDefaultActions.length > 0) {
    let tempActions = cachedDefaultActions;

    // These actions are dynamically removed from the list
    if (isPinned) {
      tempActions = tempActions.filter((action) => action.action !== "pin");
    } else {
      tempActions = tempActions.filter((action) => action.action !== "unpin");
    }
    if (isMuted) {
      tempActions = tempActions.filter((action) => action.action !== "mute");
    } else {
      tempActions = tempActions.filter((action) => action.action !== "unmute");
    }

    // Additional actions added last
    if (additionalActions?.length > 0) {
      tempActions = [...tempActions, ...additionalActions];
    }

    return tempActions;
  }

  let tempActions: Action[] = [];
  const isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0; // Possible deprecation issue

  // Add all actions to the actions array
  for (const action of Object.values([...actionsList, ...addonActionList])) {
    if (!isMac && action.keys.length > 0) {
      // TODO: Add support for Linux as well
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
          action.showKeys = false;
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

    tempActions.push(action);
  }

  // Cache the default actions
  cachedDefaultActions = tempActions;

  // These actions are dynamically removed from the list
  if (isPinned) {
    tempActions = tempActions.filter((action) => action.action !== "pin");
  } else {
    tempActions = tempActions.filter((action) => action.action !== "unpin");
  }
  if (isMuted) {
    tempActions = tempActions.filter((action) => action.action !== "mute");
  } else {
    tempActions = tempActions.filter((action) => action.action !== "unmute");
  }

  // Additional actions added last
  if (additionalActions?.length > 0) {
    tempActions = [...tempActions, ...additionalActions];
  }

  return tempActions;
};

export default refreshActions;
