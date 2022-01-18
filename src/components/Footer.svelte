<script lang="ts">
  export let results: number = 0;
</script>

<div class="footer">
  <div class="results">{results} result{results === 1 ? "" : "s"}</div>
  <div class="arrows">
    Use arrow keys <span class="shortcut">↑</span><span class="shortcut">↓</span
    > to navigate
  </div>
</div>

<style>
  .footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.5rem;
    border-top: 1px solid var(--border);
    margin: 0 1rem;
    color: var(--text-3);
    font-size: 0.75rem;
    font-weight: 500;
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
    min-width: 1.5rem;
    margin: 0 0.25rem;
    padding: 0 0.25rem;
  }
</style>
