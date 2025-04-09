<script lang="ts">
  import { onMount } from 'svelte';

  let followed = [];
  let muted = [];
  let message = '';

  onMount(async () => {
    const res = await fetch('/api/tags/preferences');
    const data = await res.json();
    followed = data.followed || [];
    muted = data.muted || [];
  });

  async function unfollow(tag) {
    await fetch('/api/tags/unfollow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tag })
    });
    followed = followed.filter(t => t !== tag);
  }

  async function unmute(tag) {
    await fetch('/api/tags/unmute', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tag })
    });
    muted = muted.filter(t => t !== tag);
  }
</script>

<h2>Tag Preferences</h2>

<h3>Followed Tags</h3>
{#if followed.length === 0}
  <p>You’re not following any tags yet.</p>
{:else}
  <ul>
    {#each followed as tag}
      <li>{tag} <button on:click={() => unfollow(tag)}>Unfollow</button></li>
    {/each}
  </ul>
{/if}

<h3>Muted Tags</h3>
{#if muted.length === 0}
  <p>You haven’t muted any tags yet.</p>
{:else}
  <ul>
    {#each muted as tag}
      <li>{tag} <button on:click={() => unmute(tag)}>Unmute</button></li>
    {/each}
  </ul>
{/if}
