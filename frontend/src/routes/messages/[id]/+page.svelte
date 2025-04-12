<script lang="ts">
  import { onMount } from "svelte";
  import { page } from "$app/stores";

  let messages = [];
  let newMessage = "";
  let burnOnView = false;
  let userId = $page.params.id;

  onMount(async () => {
    const res = await fetch("/api/messages/" + userId);
    if (res.ok) messages = await res.json();
  });

  async function sendMessage() {
    if (!newMessage) return;
    const res = await fetch("/api/messages/" + userId, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: newMessage, burnOnView })
    });
    if (res.ok) {
      const msg = await res.json();
      messages.push(msg);
      newMessage = "";
      burnOnView = false;
    }
  }

  async function markViewed(id) {
    await fetch("/api/messages/" + id + "/burn", { method: "POST" });
    messages = messages.filter(m => m.id !== id);
  }
</script>

<h2>Messages with {userId}</h2>

<ul>
  {#each messages as m}
    <li on:mouseenter={() => m.burnOnView && !m.opened && markViewed(m.id)}>
      <strong>{m.senderId}</strong>: {m.content}
      {#if m.burnOnView}
        <span title="Burn-on-view">??</span>
      {/if}
    </li>
  {/each}
</ul>

<form on:submit|preventDefault={sendMessage}>
  <textarea bind:value={newMessage} placeholder="Write a message..." rows="2" />
  <label><input type="checkbox" bind:checked={burnOnView} /> Burn-on-View</label>
  <button type="submit">Send</button>
</form>

<style>
  li { margin-bottom: 0.5rem; }
  span[title] { margin-left: 0.5rem; color: red; }
</style>
