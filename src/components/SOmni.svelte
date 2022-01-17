<script lang="ts">
  import { onMount, onDestroy } from "svelte";

  import "../styles/index.css";
  import { actions } from "../stores/actions";
  import { search } from "../stores/search";
  import SearchBar from "./SearchBar.svelte";

  let isOpen = false;

  // Event handlers
  const handleCloseOmni = () => {
    isOpen = false;
  };

  const handleOpenOmni = () => {
    isOpen = true;

    actions.reset();

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

  const handleAction = (event?: KeyboardEvent) => {
    handleCloseOmni();

    actions.dispatchSelectedAction(event);
  };

  const handleCommand = (event?: KeyboardEvent) => {
    handleCloseOmni();

    actions.dispatchCommand(event);
  };

  $: handleInteraction = (event: KeyboardEvent) => {
    // Only care if the user has omni open
    if (!isOpen) {
      return;
    }

    // Singular cases
    switch (event.key) {
      case "Escape":
        return handleCloseOmni();
      case "Enter":
        if (!$search.command) {
          return handleAction(event);
        }
        handleCommand(event);
        return;
      case "ArrowDown": {
        return actions.selectNearest(1);
      }
      case "ArrowUp": {
        return actions.selectNearest(-1);
      }
    }

    // Multiple cases
    if (event.shiftKey && event.ctrlKey && event.key === "P") {
      if ($actions.actions.findIndex((a) => a.action === "pin") !== -1) {
        chrome.runtime.sendMessage({ request: "pin" });
        return;
      }
      chrome.runtime.sendMessage({ request: "unpin" });
      handleCloseOmni();
      return;
    }

    if (event.shiftKey && event.ctrlKey && event.key === "M") {
      if ($actions.actions.findIndex((a) => a.action === "mute") !== -1) {
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

  // Truncated
  $: truncatedActions = $actions.filteredActions.slice(0, 75);

  onMount(() => {
    actions.reset();

    // Subscribe to background messages
    chrome.runtime.onMessage.addListener(messageListener);
  });

  onDestroy(() => {
    chrome.runtime.onMessage.removeListener(messageListener);
  });
</script>

<svelte:window on:keydown={handleInteraction} />

<div id="omni-extension" class="omni-extension" class:omni-closing={!isOpen}>
  <div id="omni-wrap">
    <div id="omni">
      <SearchBar />
      <div id="omni-list">
        {#each truncatedActions as action}
          <div
            id="omni-item-{action.title.toLowerCase().split(' ').join('-')}"
            class="omni-item"
            class:omni-item-active={$actions.selectedAction === action}
            data-type={action.type}
            data-url={action.url}
            on:click={() => handleAction()}
            on:mouseenter={() => actions.selectAction(action)}
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
            {#if action.showKeys && $actions.selectedAction !== action}
              <div class="omni-keys">
                {#each action.keys as key}
                  <span class="omni-shortcut">{key}</span>
                {/each}
              </div>
            {/if}
            {#if $actions.selectedAction === action}
              <div class="omni-select">
                <span class="omni-shortcut"> ⏎ </span>
              </div>
            {/if}
          </div>
        {/each}
      </div>
      <div id="omni-footer">
        <div id="omni-results">{$actions.filteredActions.length} results</div>
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
