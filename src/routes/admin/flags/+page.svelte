<script lang="ts">
  import { onMount } from 'svelte';
  let flags = [];
  onMount(async () => {
    flags = await fetch('/api/admin/flags').then(r => r.json());
  });
  async function act(postId, action) {
    await fetch('/api/admin/flags', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ postId, action }) });
    flags = flags.filter(f => f.id !== postId);
  }
</script>

<h1>Flagged Posts</h1>
{#if flags.length === 0}
  <p>No flagged posts.</p>
{:else}
  <table class='w-full text-left border'>
    <tr><th>ID</th><th>Author</th><th>Text</th><th>Actions</th></tr>
    {#each flags as f}
      <tr>
        <td>{f.id}</td>
        <td>{f.author.email}</td>
        <td>{f.text}</td>
        <td>
          <button on:click={() => act(f.id, 'approve')} class='mr-2'>Approve</button>
          <button on:click={() => act(f.id, 'remove')}>Remove</button>
        </td>
      </tr>
    {/each}
  </table>
{/if}
