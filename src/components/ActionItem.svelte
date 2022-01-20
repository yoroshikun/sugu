<script lang="ts">
  import type { Action } from "../actions/types";

  import { createEventDispatcher } from "svelte";
  import { Globe } from "../actions/icons/fluidui";
  import { actions } from "../stores/actions";

  export let action: Action;
  let dispatch = createEventDispatcher();

  $: handleClick = (action: Action) => {
    actions.selectAction(action);
    return dispatch("handleClick");
  };

  $: isSelected = $actions.selectedAction === action;
</script>

<div
  id="sugu-item-{action.title.toLowerCase().split(' ').join('-')}"
  class="sugu-item"
  class:sugu-item-active={isSelected}
  data-type={action.type}
  data-url={action.url}
  on:click={() => handleClick(action)}
>
  <div class="sugu-left">
    {#if action.icon}
      <span class="sugu-icon sugu-svg">{@html action.icon}</span>
    {/if}
    {#if action.favIconUrl}
      <img class="sugu-icon" src={action.favIconUrl} alt={action.title} />
    {/if}
    {#if !action.favIconUrl && !action.icon}
      <span class="sugu-icon sugu-svg">{@html Globe}</span>
    {/if}
    <div class="sugu-item-details">
      <div class="sugu-item-name">
        {action.title}
      </div>
      <div class="sugu-item-desc">
        {action.desc}
      </div>
    </div>
  </div>
  <div class="sugu-right">
    {#if action.showKeys}
      <div class="sugu-keys">
        {#each action.keys as key}
          <span class="sugu-key">{key}</span>
        {/each}
      </div>
    {/if}
    <span class="sugu-key sugu-select"> ⏎ </span>
  </div>
</div>

<style>
  .sugu-item {
    display: flex;
    position: relative;
    justify-content: space-between;
    min-height: 60px;
    width: calc(100% - 0.5em);
    border-radius: 1em;
  }

  .sugu-right {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    padding: 0.5em 1em;
  }

  .sugu-left {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    padding: 0.5em 0;
  }

  .sugu-item:hover {
    background-color: var(--select-sugu);
    cursor: pointer;
  }

  .sugu-item::before {
    position: absolute;
    display: block;
    top: 1em;
    left: 0.5em;
    height: 28px;
    content: "";
    width: 0.4em;
    border-radius: 0.3em;
    background-color: var(--accent-sugu);
    opacity: 0;
    transition: all 0.175s ease-in;
  }

  .sugu-item:hover::before {
    opacity: 1;
    left: 1em;
  }

  .sugu-item:hover .sugu-select {
    display: block;
  }

  .sugu-item:hover .sugu-keys {
    display: none;
  }

  .sugu-item:hover .sugu-icon {
    margin-left: 2em;
  }

  .sugu-item .sugu-select {
    display: none;
  }

  .sugu-item .sugu-keys {
    display: block;
  }

  .sugu-item-active {
    background-color: var(--select-sugu);
    position: relative;
  }

  .sugu-item-active.sugu-item::before {
    opacity: 1;
    left: 1em;
  }

  .sugu-item-active .sugu-select {
    display: block;
  }

  .sugu-item-active .sugu-keys {
    display: none;
  }

  .sugu-item-active .sugu-icon {
    margin-left: 2em;
  }

  .sugu-icon {
    width: 1.5em;
    height: 1.5em;
    margin-left: 0.75em;
    margin-top: -2px;
    transition: margin-left 0.175s ease-in;
  }

  .sugu-item-details {
    margin-left: 0.75em;
  }

  .sugu-item-name {
    color: var(--text-sugu-2);
    font-size: 0.8em;
    font-weight: 500;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 350px;
    width: 100%;
  }

  .sugu-svg {
    fill: var(--accent-sugu);
  }

  .sugu-item-active .sugu-item-name {
    color: var(--text-sugu) !important;
  }

  .sugu-item-desc {
    color: var(--text-sugu-3);
    margin-top: 0.25em;
    font-size: 0.8em;
  }

  .sugu-key {
    display: inline-block;
    font-size: 0.6em;
    border-radius: 0.25em;
    background-color: var(--shortcut-sugu);
    color: var(--text-sugu);
    text-align: center;
    padding: 0.25em 0.5em;
    margin-left: 0.5em;
  }
</style>
