<script lang="ts">
  import type { Action } from "../actions/types";
  import { onMount, onDestroy } from "svelte";

  import "../styles/index.css";
  import { actions } from "../stores/actions";
  import handleBrowserAction from "../actions/browser";

  let isOpen = false;
  let searchValue = "";
  let prevSearchValue = "";
  let selectedAction: Action | null = null;
  let currentCommand: string | null = null;
  let filteredActions: Action[] = []; // TODO: make this into the store

  // Event handlers
  const handleSearchInput = (
    e: Event & { currentTarget: EventTarget & HTMLInputElement }
  ) => {
    // If the last character is a space assime the user is trying to type a new command, TODO: All the logic around this
    if (searchValue.endsWith(" ")) {
      currentCommand = searchValue.trim().toLowerCase().replace("/", "");
      searchValue = "";
      return;
    }

    // Search time
    if (
      filteredActions.length === 0 ||
      prevSearchValue.length > searchValue.length
    ) {
      filteredActions = $actions.filter(
        (action) =>
          action.title.toLowerCase().includes(searchValue) ||
          action.desc.toLowerCase().includes(searchValue)
      );
      prevSearchValue = searchValue;
      selectedAction = filteredActions[0];
    } else {
      // Very simple drilldown search
      filteredActions = filteredActions.filter(
        (action) =>
          action.title.toLowerCase().includes(searchValue) ||
          action.desc.toLowerCase().includes(searchValue)
      );
      prevSearchValue = searchValue;
      selectedAction = filteredActions[0];
    }
  };

  const handleCloseOmni = () => {
    isOpen = false;
  };

  const refreshOmni = () => {
    searchValue = "";
    currentCommand = null;
    chrome.runtime.sendMessage({ request: "get-actions" }, (response) => {
      if (response) {
        actions.set(response.actions);
        selectedAction = response.actions[0];
        filteredActions = response.actions;
      }
    });
  };

  const handleOpenOmni = () => {
    isOpen = true;

    refreshOmni();
    // Autofocus on search input
    setTimeout(() => {
      const searchInput = document.querySelector(
        "#omni-search-input"
      ) as HTMLInputElement;

      if (searchInput) {
        searchInput.focus();
      }
    }, 100);
  };

  const handleAction = (action: string, event?: KeyboardEvent) => {
    const selectedAction = filteredActions.find((a) => a.action === action);
    handleCloseOmni();

    if (!selectedAction) {
      console.error("Could not find action with action: ", action);
      return;
    }

    chrome.runtime.sendMessage({
      request: selectedAction.action,
      tab: selectedAction,
    }); // Hmmm

    handleBrowserAction(selectedAction, event);
  };

  const handleCommand = (
    command: string,
    action: string,
    event?: KeyboardEvent
  ) => {
    const selectedAction = filteredActions.find((c) => c.action === action);
    handleCloseOmni();

    if (!selectedAction) {
      console.error(
        "Could not find command and action with title: ",
        command,
        action
      );
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
  };

  const handleSearchInteraction = (event: KeyboardEvent) => {
    // Only care if the user has omni open
    if (!isOpen) {
      return;
    }

    // Singular cases
    switch (event.key) {
      case "Escape":
        handleCloseOmni();
        return;
      case "Enter":
        if (!currentCommand) {
          handleAction(selectedAction.action, event);
          return;
        }
        handleCommand(currentCommand, selectedAction.action, event);
        return;
      case "ArrowDown": {
        const selectedActionIndex = filteredActions.findIndex(
          (a) => a.title === selectedAction.title
        );
        const newAction = filteredActions[selectedActionIndex + 1];
        selectedAction = newAction || selectedAction;

        const element = document.querySelector(
          `#omni-item-${selectedAction.title
            .toLowerCase()
            .replaceAll(" ", "-")}`
        );
        if (element) {
          element.scrollIntoView({
            block: "nearest",
            inline: "nearest",
            behavior: "smooth",
          });
        }
        return;
      }
      case "ArrowUp": {
        const selectedActionIndex = filteredActions.findIndex(
          (a) => a.title === selectedAction.title
        );
        const newAction = filteredActions[selectedActionIndex - 1];
        selectedAction = newAction || selectedAction;

        const element = document.querySelector(
          `#omni-item-${selectedAction.title
            .toLowerCase()
            .replaceAll(" ", "-")}`
        );
        if (element) {
          element.scrollIntoView({
            block: "nearest",
            inline: "nearest",
            behavior: "smooth",
          });
        }
        return;
      }
    }

    // Multiple cases
    if (event.shiftKey && event.ctrlKey && event.key === "P") {
      if ($actions.findIndex((a) => a.action === "pin") !== -1) {
        chrome.runtime.sendMessage({ request: "pin" });
        return;
      }
      chrome.runtime.sendMessage({ request: "unpin" });
      handleCloseOmni();
      return;
    }

    if (event.shiftKey && event.ctrlKey && event.key === "M") {
      console.log("here");
      if ($actions.findIndex((a) => a.action === "mute") !== -1) {
        chrome.runtime.sendMessage({ request: "mute" });
        return;
      }
      chrome.runtime.sendMessage({ request: "unmute" });
      handleCloseOmni();
      return;
    }

    if (event.shiftKey && event.ctrlKey && event.key === "C") {
      window.open("mailto:");
      return;
    }
  };

  // Listeners
  const messageListener = (message) => {
    if (message.request === "open-omni") {
      return handleOpenOmni();
    }
    if (message.request === "close-omni") {
      return handleCloseOmni();
    }
  };

  //

  // Truncated
  $: truncatedActions = filteredActions.slice(0, 75);

  onMount(() => {
    refreshOmni();

    // Subscribe to background messages
    chrome.runtime.onMessage.addListener(messageListener);
  });

  onDestroy(() => {
    chrome.runtime.onMessage.removeListener(messageListener);
  });
</script>

<svelte:window on:keydown={handleSearchInteraction} />

<div id="omni-extension" class="omni-extension" class:omni-closing={!isOpen}>
  <div id="omni-wrap">
    <div id="omni">
      <div id="omni-search" class:omni-command-mode={currentCommand}>
        <input
          id="omni-search-input"
          placeholder="Type a command or search"
          type="text"
          bind:value={searchValue}
          on:input={handleSearchInput}
        />
      </div>
      <div id="omni-list">
        {#each truncatedActions as action}
          <div
            id="omni-item-{action.title.toLowerCase().replaceAll(' ', '-')}"
            class="omni-item"
            class:omni-item-active={selectedAction.title === action.title}
            data-type={action.type}
            data-url={action.url}
            on:click={() => handleAction(action.action)}
            on:mouseenter={() => (selectedAction = action)}
          >
            {#if action.emoji}
              <span class="omni-emoji-action">{action.emojiChar}</span>
            {/if}
            {#if action.favIconUrl}
              <img
                class="omni-icon"
                src={action.favIconUrl ||
                  chrome.runtime.getURL("icons/globe.svg")}
                alt={action.title}
              />
            {/if}
            <div class="omni-item-details">
              <div class="omni-item-name">
                {action.title}
              </div>
              <div class="omni-item-desc">
                {action.desc}
              </div>
            </div>
            {#if action.showKeys && selectedAction.title !== action.title}
              <div class="omni-keys">
                {#each action.keys as key}
                  <span class="omni-shortcut">{key}</span>
                {/each}
              </div>
            {/if}
            {#if selectedAction.title === action.title}
              <div class="omni-select">
                <span class="omni-shortcut"> ⏎ </span>
              </div>
            {/if}
          </div>
        {/each}
      </div>
      <div id="omni-footer">
        <div id="omni-results">{filteredActions.length} results</div>
        <div id="omni-arrows">
          Use arrow keys <span class="omni-shortcut">↑</span><span
            class="omni-shortcut">↓</span
          > to navigate
        </div>
      </div>
    </div>
  </div>
  <div id="omni-overlay" />
</div>

<style global>
  @media (prefers-color-scheme: dark) {
    :root {
      --background: #1e2128;
      --border: #35373e;
      --text: #f1f1f1;
      --text-2: #c5c6ca;
      --text-3: #a5a5ae;
      --select: #17191e;
      --accent: #6068d2;
      --accent-hover: #484fac;
      --shortcut: #383e4a;
      --placeholder: #63687b;
      --background-2: #292d36;
    }
  }
  @media (prefers-color-scheme: light) {
    :root {
      --background: #fafcff;
      --border: #f2f3fb;
      --text: #2b2d41;
      --text-2: #2b2d41;
      --text-3: #929db2;
      --select: #eff3f9;
      --accent: #6068d2;
      --accent-hover: #484fac;
      --shortcut: #dadeea;
      --placeholder: #bac2d1;
      --background-2: #292d36;
    }
  }

  @font-face {
    font-family: "OpenSans";
    font-style: normal;
    font-weight: 400;
    src: url("chrome-extension://__MSG_@@extension_id__/fonts/OpenSans-Regular.ttf");
  }

  @font-face {
    font-family: "OpenSans";
    font-style: normal;
    font-weight: 500;
    src: url("chrome-extension://__MSG_@@extension_id__/fonts/OpenSans-Medium.ttf");
  }

  @font-face {
    font-family: "OpenSans";
    font-style: normal;
    font-weight: 600;
    src: url("chrome-extension://__MSG_@@extension_id__/fonts/OpenSans-SemiBold.ttf");
  }

  @font-face {
    font-family: "OpenSans";
    font-style: normal;
    font-weight: 700;
    src: url("chrome-extension://__MSG_@@extension_id__/fonts/OpenSans-Bold.ttf");
  }
</style>
