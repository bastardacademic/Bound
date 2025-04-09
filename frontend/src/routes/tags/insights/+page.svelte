<script lang="ts">
  import { onMount } from 'svelte';

  let likedTags = [];
  let mutedTags = [];
  let suggestedFollows = [];
  let suggestedMutes = [];

  onMount(async () => {
    const res = await fetch('/api/tags/insights');
    const data = await res.json();
    likedTags = data.liked || [];
    mutedTags = data.muted || [];
    suggestedFollows = data.suggestedFollows || [];
    suggestedMutes = data.suggestedMutes || [];
  });

  async function follow(tag) {
    await fetch('/api/tags/follow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tag })
    });
    suggestedFollows = suggestedFollows.filter(t => t !== tag);
  }

  async function mute(tag) {
    await fetch('/api/tags/mute', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tag })
    });
    suggestedMutes = suggestedMutes.filter(t => t !== tag);
  }
</script>

<h2>Learning Feed Preferences</h2>

<h3>Most Engaged Tags</h3>
<ul>
  {#each likedTags as tag}
    <li>?? {tag}</li>
  {/each}
</ul>

<h3>Muted Tags</h3>
<ul>
  {#each mutedTags as tag}
    <li>?? {tag}</li>
  {/each}
</ul>

<h3>Suggested Tags to Follow</h3>
{#if suggestedFollows.length === 0}
  <p>No suggestions right now.</p>
{:else}
  <ul>
    {#each suggestedFollows as tag}
      <li>{tag} <button on:click={() => follow(tag)}>Follow</button></li>
    {/each}
  </ul>
{/if}

<h3>Suggested Tags to Mute</h3>
{#if suggestedMutes.length === 0}
  <p>No suggestions right now.</p>
{:else}
  <ul>
    {#each suggestedMutes as tag}
      <li>{tag} <button on:click={() => mute(tag)}>Mute</button></li>
    {/each}
  </ul>
{/if}
