<script lang="ts">
  import { onMount } from "svelte";
  import { page } from "$app/stores";

  let messages = [];
  let newMessage = "";
  let burnOnView = false;
  let file = null;
  let previewUrl = "";
  let userId = $page.params.id;

  onMount(async () => {
    const res = await fetch("/api/messages/" + userId);
    if (res.ok) messages = await res.json();
  });

  function handleFile(event) {
    file = event.target.files[0];
    previewUrl = file ? URL.createObjectURL(file) : "";
  }

  async function sendMessage() {
    if (!newMessage && !file) return;

    const formData = new FormData();
    formData.append("burnOnView", burnOnView.toString());
    if (newMessage) formData.append("content", newMessage);
    if (file) formData.append("file", file);

    const res = await fetch("/api/messages/" + userId, {
      method: "POST",
      body: formData
    });

    if (res.ok) {
      const msg = await res.json();
      messages.push(msg);
      newMessage = "";
      burnOnView = false;
      file = null;
      previewUrl = "";
    }
  }

  async function markViewed(id) {
    await fetch("/api/messages/" + id + "/burn", { method: "POST" });
    messages = messages.filter(m => m.id !== id);
  }

  async function react(id, emoji) {
    await fetch("/api/messages/" + id + "/react", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ emoji })
    });
    const msg = messages.find(m => m.id === id);
    if (msg) {
      msg.reactions = msg.reactions || [];
      msg.reactions.push(emoji);
    }
  }
</script>

<h2>Messages with {userId}</h2>

<ul>
  {#each messages as m}
    <li on:mouseenter={() => m.burnOnView && !m.opened && markViewed(m.id)}>
      <strong>{m.senderId}</strong>:
      {#if m.attachmentUrl}
        <br />
        {#if m.attachmentType === "image"}
          <img src={m.attachmentUrl} alt="image attachment" width="150" />
        {:else if m.attachmentType === "video"}
          <video src={m.attachmentUrl} width="150" controls />
        {/if}
      {/if}
      {#if m.content}
        <div>{m.content}</div>
      {/if}
      {#if m.burnOnView}
        <span title="Burn-on-view">??</span>
      {/if}
      <div class="reactions">
        <button on:click={() => react(m.id, "??")}>??</button>
        <button on:click={() => react(m.id, "??")}>??</button>
        <button on:click={() => react(m.id, "??")}>??</button>
        <button on:click={() => react(m.id, "??")}>??</button>
        <span>{m.reactions?.join(" ")}</span>
      </div>
    </li>
  {/each}
</ul>

<form on:submit|preventDefault={sendMessage}>
  <textarea bind:value={newMessage} placeholder="Write a message..." rows="2" />
  <input type="file" on:change={handleFile} accept="image/*,video/*" />
  {#if previewUrl}
    <p><strong>Preview:</strong></p>
    <img src={previewUrl} alt="preview" width="120" />
  {/if}
  <label><input type="checkbox" bind:checked={burnOnView} /> Burn-on-View</label>
  <button type="submit">Send</button>
</form>

<style>
  li { margin-bottom: 1rem; }
  span[title] { margin-left: 0.5rem; color: red; }
  img, video { margin-top: 0.5rem; max-width: 200px; display: block; }
  .reactions button {
    margin-right: 0.5rem;
    font-size: 1.2rem;
    background: none;
    border: none;
    cursor: pointer;
  }
  .reactions span {
    margin-left: 0.5rem;
  }
</style>
