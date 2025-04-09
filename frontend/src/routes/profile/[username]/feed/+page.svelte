<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores';

  let username = '';
  let posts = [];

  $: username = $page.params.username;

  onMount(() => {
    fetch(`/api/users/${username}/feed`)
      .then((res) => res.json())
      .then((data) => posts = data);
  });
</script>

<h2>{username}'s Posts</h2>

{#if posts.length === 0}
  <p>This user hasn't posted anything yet.</p>
{:else}
  <ul>
    {#each posts as post}
      <li>
        <strong>{post.type}</strong> by {post.author}<br />
        {post.content?.slice(0, 200)}...
      </li>
    {/each}
  </ul>
{/if}
