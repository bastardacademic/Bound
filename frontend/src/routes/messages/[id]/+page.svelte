<script>
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { session } from '$stores/session';
  import { get } from 'svelte/store';

  $: partnerId = $page.params.id;
  $: myId = $session?.user?.id;

  let thread = [];
  let content = '';

  async function loadThread() {
    const { token } = get(session);
    const res = await fetch(`/api/messages/${partnerId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (res.ok) thread = await res.json();
  }

  async function sendMessage() {
    if (!content.trim()) return;
    const { token } = get(session);
    const res = await fetch(`/api/messages/${partnerId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ content })
    });
    if (res.ok) {
      const msg = await res.json();
      thread = [...thread, msg];
      content = '';
    }
  }

  async function react(messageId, reaction) {
    const { token } = get(session);
    const res = await fetch(`/api/messages/${partnerId}/${messageId}/react`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ reaction })
    });
    if (res.ok) {
      const updated = await res.json();
      thread = thread.map((m) => (m.id === updated.id ? updated : m));
    }
  }

  async function remove(messageId) {
    const { token } = get(session);
    const res = await fetch(`/api/messages/${partnerId}/${messageId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    if (res.ok) thread = thread.filter((m) => m.id !== messageId);
  }

  let poller;
  onMount(() => {
    loadThread();
    poller = setInterval(loadThread, 5000);
    return () => clearInterval(poller);
  });
</script>

<a href="/messages">&larr; Back to messages</a>
<h2>Conversation</h2>

<div class="thread">
  {#each thread as msg (msg.id)}
    <div class="message" class:mine={msg.senderId === myId}>
      <p>{msg.content}</p>
      {#if msg.reaction}<span class="reaction">{msg.reaction}</span>{/if}
      <div class="actions">
        <button on:click={() => react(msg.id, '❤️')}>❤️</button>
        {#if msg.senderId === myId}
          <button on:click={() => remove(msg.id)}>Delete</button>
        {/if}
      </div>
    </div>
  {/each}
  {#if thread.length === 0}<p>No messages yet. Say hello!</p>{/if}
</div>

<form on:submit|preventDefault={sendMessage}>
  <input bind:value={content} placeholder="Type a message..." />
  <button type="submit">Send</button>
</form>

<style>
  .thread {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin: 1rem 0;
  }
  .message {
    padding: 0.5rem 0.75rem;
    border-radius: 8px;
    background: #222;
    max-width: 70%;
  }
  .message.mine {
    align-self: flex-end;
    background: #044;
  }
  .message p {
    margin: 0;
  }
  .reaction {
    font-size: 0.9rem;
  }
  .actions {
    display: flex;
    gap: 0.5rem;
    margin-top: 0.25rem;
  }
  .actions button {
    font-size: 0.75rem;
    background: none;
    border: none;
    cursor: pointer;
    color: #999;
  }
</style>
