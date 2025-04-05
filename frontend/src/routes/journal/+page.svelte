<script lang='ts'>
  import { session } from '/session';
  import { onMount } from 'svelte';
  import { goto } from '/navigation';
  import { get } from 'svelte/store';
  import { marked } from 'marked';

  let entries = [];
  let content = '';
  let title = '';
  let message = '';

  onMount(() => {
    const { token } = get(session);
    if (!token) {
      goto('/login');
    } else {
      fetchEntries();
    }
  });

  async function fetchEntries() {
    const res = await fetch('/api/journal');
    const data = await res.json();
    entries = data.entries || [];
  }

  async function submitEntry() {
    const res = await fetch('/api/journal', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, content })
    });
    const data = await res.json();
    message = data.message;
    content = '';
    title = '';
    fetchEntries();
  }
</script>

<h2>My Journal</h2>
<form on:submit|preventDefault={submitEntry}>
  <input type='text' placeholder='Title (optional)' bind:value={title} />
  <textarea placeholder='Write something...' bind:value={content}></textarea>
  <button type='submit'>Save</button>
</form>
<p>{message}</p>

<h3>Live Preview</h3>
<div class='preview'>
  {@html marked(content)}
</div>

<hr />

<ul>
  {#each entries as entry}
    <li>
      <strong>{entry.title}</strong><br />
      <em>{entry.content}</em>
    </li>
  {/each}
</ul>

<style>
  .preview {
    background: #f9f9f9;
    border: 1px solid #ccc;
    padding: 1rem;
    margin-top: 1rem;
    white-space: pre-wrap;
  }
</style>
