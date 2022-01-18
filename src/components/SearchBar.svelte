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

<div>
  {#if $search.command}
    <div class="" />
  {/if}
  <input
    id="somni-input"
    type="search"
    autocomplete="off"
    class="somni-search-input"
    placeholder="Type away"
    bind:value={searchValue}
    on:input={(e) => debounce(handleSearchInput(e))}
  />
</div>

<style>
  .somni-search-input {
    background: transparent;
    border: 0px;
    outline: none;
    font-size: 1.4rem;
    font-weight: 400;
    height: 3rem;
    width: 100%;
    margin-left: auto;
    margin-right: auto;
    display: block;
    color: var(--text);
    caret-color: var(--accent);
    margin: 1rem;
    box-sizing: border-box;
  }

  .somni-search-input::placeholder {
    color: var(--placeholder);
    opacity: 1;
  }

  .somni-search-input::-webkit-search-decoration,
  .somni-search-input::-webkit-search-cancel-button,
  .somni-search-input::-webkit-search-results-button,
  .somni-search-input::-webkit-search-results-decoration {
    display: none;
  }
</style>
