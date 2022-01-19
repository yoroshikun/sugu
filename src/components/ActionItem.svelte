<script lang="ts">
  import type { Action } from "../actions/types";

  import { createEventDispatcher } from "svelte";
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
    {#if action.emoji}
      <span class="emoji-action">{action.emojiChar}</span>
    {/if}
    {#if action.favIconUrl}
      <img
        class="sugu-icon"
        src={action.favIconUrl || chrome.runtime.getURL("icons/globe.svg")}
        alt={action.title}
      />
    {/if}
    {#if !action.favIconUrl && !action.emoji}
      <img
        class="sugu-icon"
        src={chrome.runtime.getURL("icons/globe.svg")}
        alt={action.title}
      />
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
          <span class="sugu-sugu">{key}</span>
        {/each}
      </div>
    {/if}
    <span class="sugu-sugu sugu-select"> ⏎ </span>
  </div>
</div>

<style>
  .sugu-item {
    display: flex;
    position: relative;
    justify-content: space-between;
    min-height: 60px;
    width: calc(100% - 0.5rem);
    border-radius: 1rem;
  }

  .sugu-right {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    padding: 0.5rem 1rem;
  }

  .sugu-left {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    padding: 0.5rem 0;
  }

  .sugu-item:hover {
    background-color: var(--sugu-select-sugu);
    cursor: pointer;
  }

  .sugu-item::before {
    position: absolute;
    display: block;
    top: 1rem;
    left: 0.5rem;
    height: 28px;
    content: "";
    width: 0.4rem;
    border-radius: 0.3rem;
    background-color: var(--accent-sugu);
    opacity: 0;
    transition: all 0.175s ease-in;
  }

  .sugu-item:hover::before {
    opacity: 1;
    left: 1rem;
  }

  .sugu-item:hover .sugu-select {
    display: block;
  }

  .sugu-item:hover .sugu-keys {
    display: none;
  }

  .sugu-item:hover .sugu-icon,
  .sugu-item:hover .emoji-action {
    margin-left: 2.5rem;
  }

  .sugu-item .sugu-select {
    display: none;
  }

  .sugu-item .sugu-keys {
    display: block;
  }

  .sugu-item-active {
    background-color: var(--sugu-select-sugu);
    position: relative;
  }

  .sugu-item-active.sugu-item::before {
    opacity: 1;
    left: 1rem;
  }

  .sugu-item-active .sugu-select {
    display: block;
  }

  .sugu-item-active .sugu-keys {
    display: none;
  }

  .sugu-item-active .sugu-icon,
  .sugu-item-active .emoji-action {
    margin-left: 2.5rem;
  }

  .sugu-icon {
    width: 1.5rem;
    height: 1.5rem;
    margin-left: 1rem;
    margin-top: -0.25rem;
    transition: margin-left 0.175s ease-in;
  }

  .emoji-action {
    font-size: 18px;
    width: 1.5rem;
    height: 1.5rem;
    margin-left: 1rem;
    margin-top: -0.25rem;
    transition: margin-left 0.175s ease-in;
  }

  .sugu-item-details {
    margin-left: 0.75rem;
  }

  .sugu-item-name {
    color: var(--text-sugu-2);
    font-size: 0.8rem;
    font-weight: 500;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 350px;
    width: 100%;
  }

  .sugu-item-active .sugu-item-name {
    color: var(--text-sugu) !important;
  }

  .sugu-item-desc {
    color: var(--text-sugu-3);
    margin-top: 0.25rem;
    font-size: 0.8rem;
  }

  .sugu-sugu {
    display: inline-block;
    font-size: 0.6rem;
    border-radius: 0.25rem;
    background-color: var(--sugu-sugu-sugu);
    color: var(--text-sugu);
    text-align: center;
    height: 1.25rem;
    line-height: 1.25rem;
  }
</style>
