<script lang="ts">
  export let condition = false;
</script>

{#if condition}
  <slot />
{:else}
  <div class="locked">
    <p>This feature is for Premium members only.</p>
    <a href="/settings/upgrade">Upgrade now</a>
  </div>
{/if}

<style>
  .locked {
    background: #222;
    color: #eee;
    padding: 1rem;
    border-left: 4px solid gold;
    border-radius: 6px;
  }
  .locked a {
    display: inline-block;
    margin-top: 0.5rem;
    color: gold;
    text-decoration: underline;
  }
</style>
