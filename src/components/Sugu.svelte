<script lang="ts">
  import browser from "webextension-polyfill";
  import focusLock from "dom-focus-lock";
  import { onMount, onDestroy } from "svelte";
  import { fade, fly } from "svelte/transition";
  import { cubicIn } from "svelte/easing";
  import VirtualList from "@sveltejs/svelte-virtual-list";

  import { actions } from "../stores/actions";
  import { search } from "../stores/search";
  import SearchBar from "./SearchBar.svelte";
  import ActionItem from "./ActionItem.svelte";
  import Footer from "./Footer.svelte";
  import detectBrowser from "../helpers/detectBrowser";

  let isOpen = false;
  let isFirefox = detectBrowser() === "Mozilla Firefox";

  // Handle propigated events
  const handleClick = () => {
    // Does not pass in keyboard events
    handleAction();
  };

  // Helpers
  const closeSugu = () => {
    const searchInput = document.querySelector(
      "#sugu-input"
    ) as HTMLInputElement;
    focusLock.off(searchInput);
    document.getElementsByTagName("body")[0].style.overflow = "visible";

    isOpen = false;

    // if in the temp tab we destroy the tab
    if (window.location.href.endsWith("/sugu-new.html")) {
      window.close();
    }
  };

  const openSugu = () => {
    isOpen = true;
    document.getElementsByTagName("body")[0].style.overflow = "hidden";

    actions.reset();
    search.reset();

    // Autofocus on search input
    setTimeout(() => {
      const searchInput = document.querySelector(
        "#sugu-input"
      ) as HTMLInputElement;

      if (searchInput) {
        focusLock.on(searchInput);
        searchInput.focus();
      }
    }, 100);
  };

  // Handlers
  $: handleAction = (event?: KeyboardEvent) => {
    if ($search.command) {
      actions.dispatchCommand(event);
      return closeSugu();
    }

    actions.dispatchAction(event);
    return closeSugu();
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
        browser.runtime.sendMessage({ request: "pin" });
        return;
      }
      browser.runtime.sendMessage({ request: "unpin" });
      closeSugu();
      return;
    }

    if (event.shiftKey && event.ctrlKey && event.key === "M") {
      if ($actions.actions.findIndex((a) => a.action === "mute") !== -1) {
        browser.runtime.sendMessage({ request: "mute" });
        return;
      }
      browser.runtime.sendMessage({ request: "unmute" });
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

    setTimeout(() => {
      const searchInput = document.querySelector(
        "#sugu-input"
      ) as HTMLInputElement;

      if (searchInput) {
        // Multiple to fight
        searchInput.focus();
        focusLock.on(searchInput);
        searchInput.focus();
        searchInput.focus();
      }
    }, 100);

    // Subscribe to background messages
    browser.runtime.onMessage.addListener(messageListener);
    document.getElementsByTagName("body")[0].style.overflow = "hidden";
    isOpen = true;
  });

  onDestroy(() => {
    // Remove overriding eventListeners
    focusLock.off(document.querySelector("#sugu-input") as HTMLInputElement);

    browser.runtime.onMessage.removeListener(messageListener);
  });
</script>

<svelte:window on:keydown={handleInteraction} />

{#if isOpen}
  <div class="sugu-search">
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
        <div class="sugu-list" class:overflow={isFirefox}>
          <!-- Firefox has a weird bug that does not play nice with the virtual list -->
          {#if isFirefox}
            {#each filteredActions as action}
              <ActionItem on:handleClick={handleClick} {action} />
            {/each}
          {:else}
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
          {/if}

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
    .sugu-search {
      --background-sugu: #1e2128;
      --border-sugu: #35373e;
      --text-sugu: #f1f1f1;
      --text-sugu-2: #c5c6ca;
      --text-sugu-3: #a5a5ae;
      --select-sugu: #2e323c;
      --accent-sugu: #a160d2;
      --accent-sugu-hover: #484fac;
      --shortcut-sugu: #4b4f5c;
      --placeholder-sugu: #63687b;
      --background-sugu-2: #292d36;
    }
  }
  @media (prefers-color-scheme: light) {
    .sugu-search {
      --background-sugu: #fafcff;
      --border-sugu: #f2f3fb;
      --text-sugu: #2b2d41;
      --text-sugu-2: #2b2d41;
      --text-sugu-3: #929db2;
      --select-sugu: #eff3f9;
      --accent-sugu: #a160d2;
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
    src: url("chrome-extension://__MSG_@@extension_id__/fonts/OpenSans-Regular.ttf")
      url("moz-extension://__MSG_@@extension_id__/fonts/OpenSans-Regular.ttf");
  }

  @font-face {
    font-family: "OpenSans";
    font-style: normal;
    font-weight: 500;
    src: url("chrome-extension://__MSG_@@extension_id__/fonts/OpenSans-Regular.ttf")
      url("moz-extension://__MSG_@@extension_id__/fonts/OpenSans-Regular.ttf");
  }

  @font-face {
    font-family: "OpenSans";
    font-style: normal;
    font-weight: 600;
    src: url("chrome-extension://__MSG_@@extension_id__/fonts/OpenSans-Regular.ttf")
      url("moz-extension://__MSG_@@extension_id__/fonts/OpenSans-Regular.ttf");
  }

  @font-face {
    font-family: "OpenSans";
    font-style: normal;
    font-weight: 700;
    src: url("chrome-extension://__MSG_@@extension_id__/fonts/OpenSans-Regular.ttf")
      url("moz-extension://__MSG_@@extension_id__/fonts/OpenSans-Regular.ttf");
  }

  /* These seem not work with the virtual list */
  .sugu-search ::-webkit-scrollbar {
    width: 10px;
    height: 10px;
    transition: 0.275s;
  }

  .sugu-search ::-webkit-scrollbar-track {
    background-color: transparent;
  }

  .sugu-search ::-webkit-scrollbar-corner {
    background-color: transparent;
  }

  .sugu-search ::-webkit-scrollbar-thumb:vertical:hover,
  .sugu-search ::-webkit-scrollbar-thumb:horizontal:hover {
    background-color: rgba(161, 96, 210, 1);
  }

  .sugu-search ::-webkit-scrollbar-thumb:vertical:active,
  .sugu-search ::-webkit-scrollbar-thumb:horizontal:active {
    background-color: rgba(161, 96, 210, 1);
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
    padding-top: 140px;
    z-index: 9999999999; /* Very high z-index */
  }

  .sugu-inner {
    display: block;
    position: relative;
    font-size: 16px;
    width: 70vw;
    font-family: "OpenSans", sans-serif;
    border-radius: 8px;
    top: 0;
    left: 0;
    z-index: 9999999998;
  }

  .sugu-list {
    background: var(--background-sugu);
    padding: 0.25em;
    border-radius: 1em;
    width: calc(100% - 0.5em);
    max-height: 400px;
    margin-top: 1em;
    margin-bottom: 1em;
    overflow: hidden;
  }

  .sugu-list.overflow {
    overflow-y: auto;
  }

  .sugu-no-results {
    display: flex;
    flex-direction: row;
    padding: 1em;
    color: var(--text-sugu-3);
    font-size: 0.75em;
  }

  .sugu-highlight-tick {
    display: block;
    top: 0.4em;
    left: -0.25em;
    height: 14px;
    content: "";
    width: 0.4em;
    border-radius: 0.3em;
    background-color: var(--accent-sugu);
    margin-right: 0.5em;
    margin-top: 2px;
  }
</style>
