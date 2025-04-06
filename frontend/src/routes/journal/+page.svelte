<script lang="ts">
  import { onMount } from 'svelte';
  import { session } from '$stores/session';
  import { goto } from '$app/navigation';
  import { get } from 'svelte/store';
  import { marked } from 'marked';

  let title = '';
  let content = '';
  let tags = '';
  let collectionId = '';
  let privacy = 'private';
  let type = 'journal';
  let collections = [];
  let message = '';

  onMount(async () => {
    const { token } = get(session);
    if (!token) goto('/login');
    const res = await fetch('/api/journal/collections');
    const data = await res.json();
    collections = data.collections || [];
  });

  async function submitEntry() {
    const res = await fetch('/api/journal', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title, content, tags: tags.split(',').map(t => t.trim()), collectionId, privacy, type
      })
    });

    const data = await res.json();
    message = data.message;
    title = '';
    content = '';
    tags = '';
    collectionId = '';
    privacy = 'private';
    type = 'journal';
  }
</script>

<h2>New Journal Entry</h2>
<form on:submit|preventDefault={submitEntry}>
  <input type="text" placeholder="Title" bind:value={title} />
  <textarea placeholder="Write your thoughts..." rows="10" bind:value={content}></textarea>

  <label>Tags (comma separated)</label>
  <input type="text" placeholder="e.g. growth, trust, play" bind:value={tags} />

  <label>Privacy</label>
  <select bind:value={privacy}>
    <option value="private">Private</option>
    <option value="shared">Shared</option>
    <option value="erotica">Erotica</option>
    <option value="public">Public</option>
  </select>

  <label>Type</label>
  <select bind:value={type}>
    <option value="journal">Journal</option>
    <option value="note">Note</option>
    <option value="erotica">Erotica</option>
    <option value="educational">Educational</option>
  </select>

  <label>Collection</label>
  <select bind:value={collectionId}>
    <option value="">None</option>
    {#each collections as c}
      <option value={c.id}>{c.title}</option>
    {/each}
  </select>

  <button type="submit">Save Entry</button>
</form>

{#if message}<p style="color: green;">{message}</p>{/if}

<h3>Live Preview</h3>
<div class="preview">
  {@html marked(content)}
</div>
