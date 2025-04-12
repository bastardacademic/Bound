<script lang="ts">
  let accent = "#c84aff";
  let background = "#1a1a1a";
  let isSubscribed = true;

  function save() {
    if (!isSubscribed) return;
    // Mock API call
    alert("Theme saved! (not yet implemented)");
  }
</script>

<h2>?? Profile Theme</h2>

{#if isSubscribed}
  <label>Accent Color: <input type="color" bind:value={accent} /></label><br />
  <label>Background Color: <input type="color" bind:value={background} /></label><br />
  <button on:click={save}>Save Theme</button>
{:else}
  <p>Upgrade to a subscribed account to customise your profile appearance.</p>
{/if}

<style>
  input[type="color"] {
    margin: 0.5rem;
  }
  button {
    margin-top: 1rem;
    padding: 0.4rem 1rem;
  }
</style>
