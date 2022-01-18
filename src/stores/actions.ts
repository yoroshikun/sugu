import type { Action } from "../actions/types";

import { writable, get } from "svelte/store";
import handleBrowserAction from "../actions/browser";
import { search } from "./search";

const createActions = () => {
  const { subscribe, set, update } = writable<{
    actions: Action[];
    filteredActions: Action[];
    selectedAction: Action | null;
  }>({ actions: [], filteredActions: [], selectedAction: null });

  return {
    subscribe,
    reset: () => {
      chrome.runtime.sendMessage({ request: "get-actions" }, (response) => {
        if (response) {
          set({
            actions: response.actions,
            filteredActions: response.actions,
            selectedAction: response.actions[0],
          });
        }
      });
    },
    filter: (value: string, full?: boolean) => {
      update((prev) => {
        const filteredActions = prev[
          full ? "actions" : "filteredActions"
        ].filter((action) => {
          // This is where the fuzzy filtering can be implemented
          return (
            action.title.toLowerCase().includes(value.toLowerCase()) ||
            action.desc.toLowerCase().includes(value.toLowerCase())
          );
        });

        console.log(filteredActions);

        return {
          actions: prev.actions,
          filteredActions,
          selectedAction: filteredActions[0],
        };
      });
    },
    dispatchAction: (e: KeyboardEvent) => {
      const selectedAction = get(actions).selectedAction;

      if (!selectedAction) {
        console.error("No selected action");
        return;
      }

      chrome.runtime.sendMessage({
        request: selectedAction.action,
        tab: selectedAction,
      }); // Hmmm this needs to be different

      handleBrowserAction(selectedAction, e);
    },
    dispatchCommand: (event?: KeyboardEvent) => {
      const { selectedAction } = get(actions);
      const { command } = get(search);

      if (!selectedAction || !command) {
        console.error("No selected action, and no command to handle");
        return;
      }

      if (command === "remove") {
        chrome.runtime.sendMessage({
          request: "remove",
          type: selectedAction.type,
          action: selectedAction,
        });
        return;
      }

      if (command === "history") {
        if (!selectedAction.url) {
          console.error("Could not find history for action: ", selectedAction);
          return;
        }

        if (event.ctrlKey || event.metaKey) {
          window.open(selectedAction.url, "_self");
          return;
        }
        window.open(selectedAction.url, "_blank");
        return;
      }
    },
    selectNearest: (offset: number) => {
      update((prev) => {
        if (prev.filteredActions.length < 0) {
          return prev;
        }
        const { filteredActions, selectedAction } = get(actions);

        const selectedActionIndex = filteredActions.findIndex(
          (action) => selectedAction === action
        );
        const newAction = filteredActions[selectedActionIndex + offset];

        if (!newAction) {
          return prev;
        }

        const element = document.querySelector(
          `#omni-item-${newAction.title.toLowerCase().split(" ").join("-")}`
        );

        if (element) {
          element.scrollIntoView({
            block: "nearest",
            inline: "nearest",
            behavior: "smooth",
          });
        }

        return {
          actions: prev.actions,
          filteredActions: prev.filteredActions,
          selectedAction: newAction,
        };
      });
    },
    selectAction: (action: Action) => {
      update((prev) => {
        return {
          actions: prev.actions,
          filteredActions: prev.filteredActions,
          selectedAction: action,
        };
      });
    },
    set: (actions: Action[]) => {
      set({ actions, filteredActions: actions, selectedAction: actions[0] });
    },
  };
};

export const actions = createActions();
