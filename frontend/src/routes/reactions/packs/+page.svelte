<script lang="ts">
  import { onMount } from 'svelte';
  let myPacks = [];
  let name = '';
  let emojis = '';
  let sharing = 'private';
  let message = '';

  onMount(() => {
    fetch('/api/reactions/packs/mine')
      .then(res => res.json())
      .then(data => myPacks = data);
  });

  async function createPack() {
    const emojiList = emojis.split(',').map(e => e.trim()).filter(Boolean);
    if (!name || emojiList.length === 0) {
      message = 'Please enter a name and at least one emoji.';
      return;
    }

    const res = await fetch('/api/reactions/packs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, emojis: emojiList, sharing })
    });

    if (res.ok) {
      message = 'Pack created!';
      name = '';
      emojis = '';
      sharing = 'private';
      myPacks = await (await fetch('/api/reactions/packs/mine')).json();
    } else {
      message = 'Failed to create pack.';
    }
  }
</script>

<h2>My Reaction Packs</h2>
<ul>
  {#each myPacks as pack}
    <li>
      <strong>{pack.name}</strong> — {pack.sharing} <br />
      {pack.emojis?.join(' ')}
    </li>
  {/each}
</ul>

<h3>Create New Pack</h3>
<form on:submit|preventDefault={createPack}>
  <label>Name</label>
  <input type="text" bind:value={name} />

  <label>Emojis (comma separated)</label>
  <input type="text" bind:value={emojis} placeholder="??, ??, ??" />

  <label>Sharing</label>
  <select bind:value={sharing}>
    <option value="private">Private</option>
    <option value="friends">Friends & Groups</option>
    <option value="public">Public</option>
  </select>

  <button type="submit">Create Pack</button>
</form>

{#if message}<p style="color: green;">{message}</p>{/if}
