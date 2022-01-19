<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import { fade, fly } from "svelte/transition";
  import { cubicIn } from "svelte/easing";
  import VirtualList from "@sveltejs/svelte-virtual-list";

  import {
    addOverrideListeners,
    removeOverrideListeners,
  } from "../helpers/overrideListeners";
  import { actions } from "../stores/actions";
  import { search } from "../stores/search";
  import SearchBar from "./SearchBar.svelte";
  import ActionItem from "./ActionItem.svelte";
  import Footer from "./Footer.svelte";

  let isOpen = false;

  // Handle propigated events
  const handleClick = () => {
    // Does not pass in keyboard events
    handleAction();
  };

  // Helpers
  const closeSugu = () => {
    isOpen = false;
  };

  const openSugu = () => {
    isOpen = true;

    actions.reset();

    // Autofocus on search input
    setTimeout(() => {
      const searchInput = document.querySelector(
        "#sugu-input"
      ) as HTMLInputElement;

      if (searchInput) {
        searchInput.focus();
      }
    }, 100);
  };

  // Handlers
  $: handleAction = (event?: KeyboardEvent) => {
    closeSugu();

    if ($search.command) {
      return actions.dispatchCommand(event);
    }

    return actions.dispatchAction(event);
  };

  $: handleInteraction = (event: KeyboardEvent) => {
    // Only care if the user has sugu open
    if (!isOpen) {
      return;
    }

    // Singular cases
    switch (event.key) {
      case "Escape":
        return closeSugu();
      case "Enter":
        handleAction(event);
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
      closeSugu();
      return;
    }

    if (event.shiftKey && event.ctrlKey && event.key === "M") {
      if ($actions.actions.findIndex((a) => a.action === "mute") !== -1) {
        chrome.runtime.sendMessage({ request: "mute" });
        return;
      }
      chrome.runtime.sendMessage({ request: "unmute" });
      closeSugu();
      return;
    }

    if (event.shiftKey && event.ctrlKey && event.key === "C") {
      window.open("mailto:");
      return;
    }
  };

  // Listeners
  const messageListener = (message) => {
    if (message.request === "open-sugu") {
      return openSugu();
    }
    if (message.request === "close-sugu") {
      return closeSugu();
    }
  };

  // Truncated
  $: filteredActions = $actions.filteredActions;
  $: listHeight =
    filteredActions.length * 60 > 400 ? 400 : filteredActions.length * 60;
  $: results = $actions.filteredActions.length;

  onMount(() => {
    actions.reset();

    // Override any existing eventListeners (Fight the focus trap)
    addOverrideListeners();

    // Subscribe to background messages
    chrome.runtime.onMessage.addListener(messageListener);
    isOpen = true;
  });

  onDestroy(() => {
    // Remove overriding eventListeners
    removeOverrideListeners();

    chrome.runtime.onMessage.removeListener(messageListener);
  });
</script>

<svelte:window on:keydown={handleInteraction} />

{#if isOpen}
  <div>
    <div
      class="sugu-overlay"
      in:fade={{ duration: 125, easing: cubicIn }}
      out:fade={{ duration: 125, easing: cubicIn }}
      on:click={() => closeSugu()}
    />
    <div class="sugu-wrapper">
      <div
        class="sugu-inner"
        in:fly={{ y: 40, duration: 325, easing: cubicIn }}
        out:fly={{ y: -40, duration: 325, easing: cubicIn }}
      >
        <SearchBar />
        <div class="sugu-list">
          <VirtualList
            items={filteredActions}
            height={`${listHeight}px`}
            itemHeight={60}
            let:item
          >
            {#if item}
              <ActionItem on:handleClick={handleClick} action={item} />
            {/if}
          </VirtualList>
          {#if results === 0}
            <div class="sugu-no-results">
              <div class="sugu-highlight-tick" />
              No results with this query, wanna try something else?
            </div>
          {/if}
        </div>
        <Footer {results} />
      </div>
    </div>
  </div>
{/if}

<style>
  @media (prefers-color-scheme: dark) {
    :root {
      --background-sugu: #1e2128;
      --border-sugu: #35373e;
      --text-sugu: #f1f1f1;
      --text-sugu-2: #c5c6ca;
      --text-sugu-3: #a5a5ae;
      --select-sugu: #2e323c;
      --accent-sugu: #6068d2;
      --accent-sugu-hover: #484fac;
      --shortcut-sugu: #4b4f5c;
      --placeholder-sugu: #63687b;
      --background-sugu-2: #292d36;
    }
  }
  @media (prefers-color-scheme: light) {
    :root {
      --background-sugu: #fafcff;
      --border-sugu: #f2f3fb;
      --text-sugu: #2b2d41;
      --text-sugu-2: #2b2d41;
      --text-sugu-3: #929db2;
      --select-sugu: #eff3f9;
      --accent-sugu: #6068d2;
      --accent-sugu-hover: #484fac;
      --shortcut-sugu: #dadeea;
      --placeholder-sugu: #bac2d1;
      --background-sugu-2: #292d36;
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

  .sugu-overlay {
    height: 100vh;
    width: 100vw;
    position: fixed;
    top: 0;
    left: 0;
    background-color: #000;
    z-index: 9999;
    opacity: 0.7;
  }

  .sugu-wrapper {
    position: fixed;
    display: flex;
    justify-content: center;
    align-items: flex-start;
    width: 100vw;
    height: 100vh;
    top: 0;
    right: 0;
    padding-top: 8rem;
    z-index: 9999999999; /* Very high z-index */
  }

  .sugu-inner {
    display: block;
    position: relative;
    width: 70vw;
    font-family: "OpenSans", sans-serif;
    border-radius: 5px;
    top: 0;
    left: 0;
    z-index: 9999999998;
  }

  .sugu-list {
    background: var(--background-sugu);
    padding: 0.25rem;
    border-radius: 1rem;
    width: cacl(100% - 0.5rem);
    max-height: 400px;
    margin-top: 1rem;
    margin-bottom: 1rem;
    overflow: hidden;
  }

  .sugu-no-results {
    display: flex;
    flex-direction: row;
    padding: 1rem;
    color: var(--text-sugu-3);
    font-size: 0.75rem;
  }

  .sugu-highlight-tick {
    display: block;
    top: 0.4rem;
    left: -0.25rem;
    height: 14px;
    content: "";
    width: 0.4rem;
    border-radius: 0.3rem;
    background-color: var(--accent-sugu);
    margin-right: 0.5rem;
    margin-top: 2px;
  }
</style>
