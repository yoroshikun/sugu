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
    font-size: 0.75rem;
    font-weight: 500;
  }

  .sugu-results {
    padding: 0.75rem 1rem;
    background: var(--background-sugu);
    border-radius: 1rem;
  }

  .sugu-instructions {
    margin-right: 0.5rem;
    padding: 0.75rem 1rem;
    background: var(--background-sugu);
    border-radius: 1rem;
  }

  .sugu-shortcut {
    display: inline-block;
    font-size: 0.6rem;
    border-radius: 0.25rem;
    background-color: var(--shortcut-sugu);
    color: var(--text-sugu);
    text-align: center;
    height: 1.25rem;
    line-height: 1.25rem;
    min-width: 1.5rem;
    margin: 0 0.25rem;
    padding: 0 0.25rem;
  }
</style>
