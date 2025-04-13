<script lang="ts">
  export let comments = [];
  export let onComment = (text: string) => {};

  let newComment = "";

  function submit() {
    if (!newComment.trim()) return;
    onComment(newComment);
    newComment = "";
  }
</script>

<div class="comments">
  <h4>💬 Comments</h4>

  {#if comments.length === 0}
    <p class="empty">No comments yet. Be the first!</p>
  {:else}
    <ul>
      {#each comments as c}
        <li>
          <strong>{c.author}</strong> <span class="ts">{c.timestamp}</span><br />
          <span>{c.text}</span>
        </li>
      {/each}
    </ul>
  {/if}

  <form on:submit|preventDefault={submit}>
    <input type="text" bind:value={newComment} placeholder="Write a comment..." />
    <button type="submit">Reply</button>
  </form>
</div>

<style>
  .comments {
    margin-top: 1rem;
    background: #1b1b1b;
    padding: 1rem;
    border-radius: 8px;
  }
  ul {
    list-style: none;
    padding: 0;
  }
  li {
    padding: 0.5rem 0;
    border-bottom: 1px solid #333;
  }
  .ts {
    color: #888;
    font-size: 0.75rem;
    margin-left: 0.5rem;
  }
  input {
    width: 100%;
    margin-top: 0.5rem;
    padding: 0.5rem;
    background: #111;
    border: 1px solid #444;
    color: white;
  }
  button {
    margin-top: 0.5rem;
  }
  .empty {
    color: #aaa;
    font-size: 0.85rem;
  }
</style>