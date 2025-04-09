<script lang="ts">
  export let postId: string;
  export let reactions: Record<string, number> = {};
  export let userReaction: string = '';
  export let tags: string[] = [];

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

  async function followTag(tag) {
    await fetch('/api/tags/follow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tag })
    });
  }

  async function muteTag(tag) {
    await fetch('/api/tags/mute', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tag })
    });
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

{#if tags?.length}
  <div class="tags">
    <h4>Tags:</h4>
    {#each tags as tag}
      <span class="tag">{tag}
        <button on:click={() => followTag(tag)}>Follow</button>
        <button on:click={() => muteTag(tag)}>Mute</button>
      </span>
    {/each}
  </div>
{/if}

<style>
  .reactions {
    display: flex;
    gap: 0.5rem;
    margin-top: 0.5rem;
  }
  .tags {
    margin-top: 0.5rem;
    font-size: 0.9rem;
  }
  .tags .tag {
    display: inline-block;
    margin-right: 1rem;
  }
  .tags button {
    margin-left: 0.25rem;
    font-size: 0.8rem;
    background: none;
    border: 1px solid #999;
    border-radius: 4px;
    cursor: pointer;
    padding: 0 0.3rem;
  }
</style>
