<script lang="ts">
  import { onMount } from "svelte";
  import { session } from "$stores/session";
  import { goto } from "$app/navigation";
  import { get } from "svelte/store";
  import Reactions from "$lib/components/Reactions.svelte";
  import ReportButton from "$lib/components/ReportButton.svelte";

  let posts = [];
  let typeFilter = "all";

  onMount(async () => {
    const { token } = get(session);
    if (!token) goto("/login");
    await fetchFeed();
  });

  async function fetchFeed() {
    const query = new URLSearchParams();
    if (typeFilter !== "all") query.append("type", typeFilter);
    const res = await fetch("/api/feed/home?" + query.toString());
    posts = await res.json();
  }
</script>

<h2>Welcome Back</h2>

<div class="filters">
  <label>Show:</label>
  <select bind:value={typeFilter} on:change={fetchFeed}>
    <option value="all">Everything</option>
    <option value="journal">Journals</option>
    <option value="status">Status Updates</option>
    <option value="poll">Polls</option>
    <option value="media">Images & Videos</option>
    <option value="event">Events</option>
  </select>
</div>

<ul>
  {#each posts as post}
    <li>
      <strong>{post.author}</strong> — {post.type}<br />
      {post.content?.slice(0, 200)}...

      <Reactions postId={post.id} reactions={post.reactions} userReaction={post.userReaction} tags={post.tags} />
      <ReportButton targetId={post.id} type="post" />
    </li>
  {/each}
</ul>

<style>
  .filters {
    display: flex;
    gap: 1rem;
    margin: 1rem 0;
    align-items: center;
  }
</style>
