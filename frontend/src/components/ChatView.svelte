<script lang="ts">
  import { onMount } from "svelte";
  import { page } from "$app/stores";
  import { invalidate } from "$app/navigation";
  import axios from "axios";

  export let threadId: string;

  let messages = [];
  let newMessage = "";
  let loading = true;

  async function fetchMessages() {
    loading = true;
    const res = await axios.get(`/api/chat/${threadId}`);
    messages = res.data.messages;
    loading = false;
  }

  async function sendMessage() {
    if (!newMessage.trim()) return;
    await axios.post(`/api/chat/${threadId}/send`, {
      content: newMessage.trim()
    });
    newMessage = "";
    await fetchMessages();
  }

  async function burnView(id: string) {
    await axios.post(`/api/chat/${threadId}/view/${id}`);
    await fetchMessages();
  }

  onMount(fetchMessages);
</script>

<div class="p-4 space-y-4">
  {#if loading}
    <div>Loading messages…</div>
  {:else if messages.length === 0}
    <div class="text-muted">No messages yet.</div>
  {:else}
    <div class="space-y-2">
      {#each messages as m (m.id)}
        <div class="bg-muted p-2 rounded-xl">
          <div class="flex justify-between">
            <span class="text-sm font-semibold">@{m.sender.username}</span>
            <span class="text-xs text-muted-foreground">{new Date(m.createdAt).toLocaleTimeString()}</span>
          </div>
          <div class="mt-1">{m.content}</div>
          {#if m.burnOnView && !m.viewedAt}
            <button
              class="text-xs text-destructive mt-1 hover:underline"
              on:click={() => burnView(m.id)}
            >
              🔥 Mark viewed
            </button>
          {/if}
        </div>
      {/each}
    </div>
  {/if}

  <form on:submit|preventDefault={sendMessage} class="flex gap-2 mt-4">
    <input
      class="flex-1 p-2 rounded border border-muted bg-background"
      bind:value={newMessage}
      placeholder="Type a message…"
    />
    <button type="submit" class="bg-primary text-primary-foreground rounded px-3 py-1">
      Send
    </button>
  </form>
</div>
