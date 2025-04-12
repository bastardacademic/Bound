<script lang="ts">
  export let emojis = [];
  export let onSelect = (emoji) => {};

  function pick(e) {
    onSelect(e);
  }
</script>

<div class="reaction-picker">
  {#each emojis as emoji}
    <button on:click={() => pick(emoji)} title={emoji.name}>
      <img src={emoji.url} alt={emoji.name} />
    </button>
  {/each}
</div>

<style>
  .reaction-picker {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    padding: 0.5rem;
  }
  button {
    background: none;
    border: none;
    cursor: pointer;
  }
  img {
    width: 32px;
    height: 32px;
  }
</style>
