<script>
  import { onMount } from 'svelte';
  import { session } from '$stores/session';
  import { goto } from '$app/navigation';
  import { get } from 'svelte/store';

  let collections = [];
  let newTitle = '';
  let message = '';
  let error = '';

  onMount(async () => {
    const { token } = get(session);
    if (!token) goto('/login');
    await loadCollections();
  });

  async function loadCollections() {
    const res = await fetch('/api/journal/collections');
    const data = await res.json();
    collections = data.collections || [];
  }

  async function createCollection() {
    const res = await fetch('/api/journal/collections', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: newTitle })
    });

    if (res.ok) {
      message = 'Collection created';
      newTitle = '';
      await loadCollections();
    } else {
      error = 'Could not create collection';
    }
  }
</script>

<h2>Journal Collections</h2>
<form on:submit|preventDefault={createCollection}>
  <input placeholder='New collection name' bind:value={newTitle} />
  <button type='submit'>Add</button>
</form>
{#if message}<p style='color: green;'>{message}</p>{/if}
{#if error}<p style='color: red;'>{error}</p>{/if}

<ul>
  {#each collections as col}
    <li><strong>{col.title}</strong> ({col.entries.length} entries)</li>
  {/each}
</ul>
