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
  id="somni-item-{action.title.toLowerCase().split(' ').join('-')}"
  class="item"
  class:item-active={isSelected}
  data-type={action.type}
  data-url={action.url}
  on:click={() => handleClick(action)}
>
  <div class="left">
    {#if action.emoji}
      <span class="emoji-action">{action.emojiChar}</span>
    {/if}
    {#if action.favIconUrl}
      <img
        class="icon"
        src={action.favIconUrl || chrome.runtime.getURL("icons/globe.svg")}
        alt={action.title}
      />
    {/if}
    <div class="item-details">
      <div class="item-name">
        {action.title}
      </div>
      <div class="item-desc">
        {action.desc}
      </div>
    </div>
  </div>
  <div class="right">
    {#if action.showKeys}
      <div class="keys">
        {#each action.keys as key}
          <span class="shortcut">{key}</span>
        {/each}
      </div>
    {/if}
    <span class="shortcut select"> ⏎ </span>
  </div>
</div>

<style>
  .item {
    display: flex;
    position: relative;
    justify-content: space-between;
    min-height: 60px;
    width: 100%;
  }

  .right {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    padding: 0.5rem 1rem;
  }

  .left {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    padding: 0.5rem 0;
  }

  .item:hover {
    background-color: var(--select);
    cursor: pointer;
  }

  .item:hover::before {
    height: 100%;
    position: absolute;
    display: block;
    content: "";
    width: 2px;
    background-color: var(--accent);
  }

  .item:hover .select {
    display: block;
  }

  .item:hover .keys {
    display: none;
  }

  .item .select {
    display: none;
  }

  .item .keys {
    display: block;
  }

  .item-active {
    background-color: var(--select);
    position: relative;
  }

  .item-active:before {
    height: 100%;
    position: absolute;
    display: block;
    content: "";
    width: 2px;
    background-color: var(--accent);
  }

  .item-active .select {
    display: block;
  }

  .item-active .keys {
    display: none;
  }

  .icon {
    width: 1.5rem;
    height: 1.5rem;
    margin-left: 1rem;
    margin-top: -0.5rem;
  }

  .emoji-action {
    font-size: 18px;
    width: 1.5rem;
    height: 1.5rem;
    margin-left: 1rem;
    margin-top: -0.5rem;
  }

  .item-details {
    margin-left: 0.75rem;
  }

  .item-name {
    color: var(--text-2);
    font-size: 0.8rem;
    font-weight: 500;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    width: 100%;
  }

  .item-active .item-name {
    color: var(--text) !important;
  }

  .item-desc {
    color: var(--text-3);
    margin-top: 0.25rem;
    font-size: 0.8rem;
  }

  .shortcut {
    display: inline-block;
    font-size: 0.6rem;
    border-radius: 0.25rem;
    background-color: var(--shortcut);
    color: var(--text);
    text-align: center;
    height: 1.25rem;
    line-height: 1.25rem;
  }
</style>
