<script lang="ts">
  import { onMount } from 'svelte';

  let posts = [];
  let selectedFeed = 'exhibitionist';

  const feedOptions = {
    exhibitionist: 'Public posts',
    mypervs: 'Posts by followed tags & liked content',
    orgy: 'Group posts from your memberships',
    sizzling: 'Most liked content sitewide',
    custom: 'Your premium custom feed'
  };

  onMount(() => fetchFeed());

  async function fetchFeed() {
    const res = await fetch('/api/feed/discover?type=' + selectedFeed);
    posts = await res.json();
  }
</script>

<h2>Discover Desires</h2>

<nav class="tabs">
  {#each Object.entries(feedOptions) as [key, label]}
    <button
      class:selected={selectedFeed === key}
      on:click={() => { selectedFeed = key; fetchFeed(); }}
    >
      {label}
    </button>
  {/each}
</nav>

<ul>
  {#each posts as post}
    <li>
      <strong>{post.author}</strong> — {post.type}<br />
      {post.content?.slice(0, 200)}...
    </li>
  {/each}
</ul>

<style>
  .tabs {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 1rem;
    flex-wrap: wrap;
  }
  .tabs button {
    padding: 0.4rem 1rem;
    border: none;
    background: #eee;
    border-radius: 6px;
    cursor: pointer;
  }
  .tabs button.selected {
    background: var(--accent-color, #c94e4e);
    color: white;
  }
</style>
