<script lang="ts">
  import type { Action } from "../actions/types";
  import { Search } from "../actions/icons/fluidui";

  import debounce from "../helpers/debounce";
  import { actions } from "../stores/actions";
  import { search } from "../stores/search";

  let searchValue = "";
  let ghostAction: Action = null;

  $: handleSearchInput = (
    e: Event & { currentTarget: EventTarget & HTMLInputElement }
  ) => {
    const enteredCommandMode = search.update(searchValue);

    if (enteredCommandMode) {
      searchValue = $search.current;
      actions.prepareCommand($search.command);
      return;
    }

    return actions.filter(searchValue);
  };

  $: {
    if ($actions.filteredActions.length < 1 || searchValue.length === 0) {
      ghostAction = null;
    } else {
      if (
        $actions.filteredActions[0].title
          .toLowerCase()
          .startsWith(searchValue.toLowerCase())
      ) {
        ghostAction = $actions.filteredActions[0];
      } else {
        ghostAction = null;
      }
    }
  }

  $: ghostText = ghostAction
    ? searchValue + ghostAction.title.slice(searchValue.length)
    : "";
</script>

<div class="sugu-input-container">
  <div class="sugu-search-icon">
    {#if ghostAction?.favIconUrl}
      <img src={ghostAction.favIconUrl} alt={ghostAction.title} />
    {:else}
      {@html ghostAction?.icon ? ghostAction.icon : Search}
    {/if}
  </div>
  {#if $search.command}
    <div class="sugu-command">
      /{$search.command}
    </div>
  {/if}
  <div style="flex: 1">
    {#if ghostText}
      <input
        class="sugu-input-ghost"
        type="search"
        value={ghostText}
        style={`width: calc(100% - ${$search.command ? 6 : 3}em);`}
      />
    {/if}
    <input
      id="sugu-input"
      type="search"
      autocomplete="off"
      class="sugu-search-input"
      placeholder="Start typing..."
      bind:value={searchValue}
      on:input={(e) => debounce(handleSearchInput(e))}
    />
  </div>
</div>

<style>
  .sugu-search-icon {
    fill: var(--accent-sugu);
    width: 2em;
    height: 2em;
    margin-left: 0.75em;
    margin-right: 0.5em;
  }

  .sugu-search-icon img {
    width: 1.5em;
    height: 1.5em;
    margin-left: 0.25em;
    margin-top: 0.25em;
  }

  .sugu-search-input {
    display: block;
    position: relative;
    background: transparent;
    border: 0;
    padding: 0;
    outline: none;
    font-size: 1.4em;
    font-weight: 400;
    height: 2.5em;
    width: 100%;
    color: var(--text-sugu);
    caret-color: var(--accent-sugu);
  }

  .sugu-input-ghost {
    position: absolute;
    top: 0;
    background: transparent;
    border: 0;
    padding: 0;
    outline: none;
    font-size: 1.4em;
    font-weight: 400;
    height: 2.5em;
    width: 100%;
    color: var(--placeholder-sugu);
    pointer-events: none;
  }

  .sugu-input-ghost::placeholder {
    color: var(--placeholder-sugu);
    opacity: 1;
  }

  .sugu-search-input::placeholder {
    color: var(--placeholder-sugu);
    opacity: 1;
  }

  .sugu-search-input::-webkit-search-decoration,
  .sugu-search-input::-webkit-search-cancel-button,
  .sugu-search-input::-webkit-search-results-button,
  .sugu-search-input::-webkit-search-results-decoration {
    display: none;
  }

  .sugu-command {
    font-size: 1.4em;
    font-weight: 400;
    color: var(--placeholder-sugu);
    margin-right: 0.5em;
  }

  .sugu-input-container {
    box-sizing: content-box;
    position: relative;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    width: 100%;
    background: var(--background-sugu);
    border: 1px solid var(--border-sugu);
    border-radius: 1em;
  }
</style>
