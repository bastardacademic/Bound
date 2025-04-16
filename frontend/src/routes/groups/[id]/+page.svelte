<script lang="ts">
  import { page } from "$app/stores";
  import { session } from "$stores/session";
  import { get } from "svelte/store";

  let group = null;
  let posts = [];

  $: groupId = $page.params.id;

  async function fetchGroup() {
    const { token } = get(session);
    const res = await fetch(`/api/groups/${groupId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (res.ok) {
      const data = await res.json();
      group = data.group;
      posts = data.posts;
    }
  }

  fetchGroup();
</script>

{#if group}
  <h2>{group.name}</h2>
  <p>ID: {group.id}</p>

  <h3>Recent Posts</h3>
  <ul>
    {#each posts as post}
      <li>
        <strong>{post.title}</strong><br />
        <span>{post.preview}</span>
      </li>
    {/each}
  </ul>
{:else}
  <p>Loading group info…</p>
{/if}

<style>
  ul { list-style: none; padding: 0; }
  li {
    padding: 0.75rem 0;
    border-bottom: 1px solid #333;
  }
</style>
