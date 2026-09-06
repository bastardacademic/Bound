<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { session } from '$stores/session';
  import { get } from 'svelte/store';

  let conversations = [];

  async function loadConversations() {
    const { token } = get(session);
    const res = await fetch('/api/messages', {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (res.ok) conversations = await res.json();
  }

  let poller;
  onMount(() => {
    loadConversations();
    poller = setInterval(loadConversations, 5000);
    return () => clearInterval(poller);
  });
</script>

<h2>Messages</h2>
<ul>
  {#each conversations as conv (conv.id)}
    <li>
      <button on:click={() => goto(`/messages/${conv.id}`)}>
        {conv.name} {#if conv.unread > 0}<strong>({conv.unread})</strong>{/if}
      </button>
      {#if conv.lastMessage}<p class="preview">{conv.lastMessage}</p>{/if}
    </li>
  {/each}
  {#if conversations.length === 0}<p>No conversations yet.</p>{/if}
</ul>

<style>
  ul {
    list-style: none;
    padding: 0;
  }
  li {
    padding: 0.5rem 0;
    border-bottom: 1px solid #333;
  }
  .preview {
    margin: 0.25rem 0 0;
    font-size: 0.85rem;
    color: #999;
  }
</style>
