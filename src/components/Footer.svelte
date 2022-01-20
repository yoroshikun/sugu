<script lang="ts">
  export let results: number = 0;
</script>

<div class="sugu-footer">
  <div class="sugu-results">{results} result{results === 1 ? "" : "s"}</div>
  <div>
    <div class="sugu-instructions">
      Use arrow keys <span class="sugu-shortcut">↑</span><span
        class="sugu-shortcut">↓</span
      > to navigate
    </div>
    <div class="sugu-settings" />
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
</style>
