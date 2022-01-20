<script lang="ts">
  import { Settings } from "../actions/icons/fluidui";

  export let results: number = 0;
</script>

<div class="sugu-footer">
  <div class="sugu-results">{results} result{results === 1 ? "" : "s"}</div>
  <div class="sugu-right">
    <div class="sugu-instructions">
      Use arrow keys <span class="sugu-shortcut">↑</span><span
        class="sugu-shortcut">↓</span
      > to navigate
    </div>
    <div class="sugu-settings">
      <span class="sugu-icon">
        {@html Settings}
      </span>
    </div>
  </div>
</div>

<style>
  .sugu-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: var(--text-sugu-3);
    font-size: 0.75em;
    font-weight: 500;
  }

  .sugu-results {
    padding: 0.75em 1em;
    background: var(--background-sugu);
    border-radius: 1em;
  }

  .sugu-instructions {
    margin-right: 0.5em;
    padding: 0.75em 1em;
    background: var(--background-sugu);
    border-radius: 1em;
  }

  .sugu-shortcut {
    display: inline-block;
    font-size: 0.6em;
    border-radius: 0.25em;
    background-color: var(--shortcut-sugu);
    color: var(--text-sugu);
    text-align: center;
    padding: 0.25em 0.5em;
    margin-left: 0.5em;
  }

  .sugu-right {
    display: flex;
    flex-direction: row;
  }

  .sugu-settings {
    display: flex;
    align-items: center;
    background: var(--background-sugu);
    border-radius: 1em;
    padding: 0.5em;
  }

  .sugu-icon {
    height: 2em;
    width: 2em;
    fill: var(--accent-sugu);
  }
</style>
