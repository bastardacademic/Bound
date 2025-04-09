<script lang="ts">
  export let postId: string;
  export let reactions: Record<string, number> = {};
  export let userReaction: string = '';

  const emojis = ['??', '??', '??', '??', '??', '??'];

  async function react(emoji: string) {
    const res = await fetch('/api/reactions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ postId, emoji })
    });

    if (res.ok) {
      userReaction = emoji;
    }
  }
</script>

<div class="reactions">
  {#each emojis as emoji}
    <button
      class:selected={userReaction === emoji}
      on:click={() => react(emoji)}
    >
      {emoji} {reactions[emoji] || ''}
    </button>
  {/each}
</div>

<style>
  .reactions {
    display: flex;
    gap: 0.5rem;
    margin-top: 0.5rem;
  }
  button {
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    padding: 0.2rem 0.4rem;
    border-radius: 6px;
  }
  button.selected {
    background: var(--accent-color, #ffcccb);
  }
</style>
