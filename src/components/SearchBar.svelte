<script lang="ts">
  import debounce from "../helpers/debounce";
  import { actions } from "../stores/actions";
  import { search } from "../stores/search";

  let searchValue = "";

  $: handleSearchInput = (
    e: Event & { currentTarget: EventTarget & HTMLInputElement }
  ) => {
    const enteredCommandMode = search.update(searchValue);
    actions.filter(searchValue, searchValue.length < $search.previous.length);

    if (enteredCommandMode) {
      searchValue = $search.current;
      // TODO Fill actions list with command specific
    }
  };
</script>

<div class="sugu-input-container">
  {#if $search.command}
    <div class="sugu-command">
      /{$search.command}
    </div>
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

<style>
  .sugu-search-input {
    display: block;
    background: transparent;
    border: 0px;
    outline: none;
    font-size: 1.4em;
    font-weight: 400;
    height: 3em;
    width: 100%;
    color: var(--text-sugu);
    caret-color: var(--accent-sugu);
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
  }

  .sugu-input-container {
    position: relative;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    height: 3rem;
    width: 100%;
    padding: 1.75em;
    background: var(--background-sugu);
    border: 1px solid var(--border-sugu);
    border-radius: 1em;
  }
</style>
