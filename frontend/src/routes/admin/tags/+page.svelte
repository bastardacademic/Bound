<script lang="ts">
  import { onMount } from "svelte";
  import { session } from "$stores/session";
  import { goto } from "$app/navigation";
  import { get } from "svelte/store";

  let flagged = [];
  let banned = [];
  let search = "";
  let message = "";

  onMount(async () => {
    const user = get(session).user;
    if (!user || user.role !== "admin") {
      goto("/");
      return;
    }

    const flaggedRes = await fetch("/api/admin/tags/flagged");
    const bannedRes = await fetch("/api/admin/tags/banned");
    if (flaggedRes.ok) flagged = await flaggedRes.json();
    if (bannedRes.ok) banned = await bannedRes.json();
  });

  async function approve(tag) {
    await fetch("/api/admin/tags/approve", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tag })
    });
    flagged = flagged.filter(t => t !== tag);
  }

  async function ban(tag) {
    await fetch("/api/admin/tags/ban", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tag })
    });
    flagged = flagged.filter(t => t !== tag);
    if (!banned.includes(tag)) banned.push(tag);
    message = `Tag "${tag}" has been banned.`;
  }
</script>

<h2>??? Tag Moderation Panel</h2>

<section>
  <h3>?? Flagged Tags</h3>
  {#if flagged.length === 0}
    <p>No flagged tags at the moment.</p>
  {:else}
    <ul>
      {#each flagged as tag}
        <li>
          {tag}
          <button on:click={() => approve(tag)}>Approve</button>
          <button on:click={() => ban(tag)}>Ban</button>
        </li>
      {/each}
    </ul>
  {/if}
</section>

<section>
  <h3>?? Manual Ban</h3>
  <form on:submit|preventDefault={() => ban(search)}>
    <input type="text" placeholder="Enter tag to ban" bind:value={search} />
    <button type="submit">Ban</button>
  </form>
  {#if message}<p style="color: green;">{message}</p>{/if}
</section>

<section>
  <h3>? Banned Tags</h3>
  <ul>
    {#each banned as tag}
      <li>{tag}</li>
    {/each}
  </ul>
</section>

<style>
  ul { list-style: none; padding: 0; }
  li { margin-bottom: 0.5rem; }
  button { margin-left: 1rem; }
</style>
