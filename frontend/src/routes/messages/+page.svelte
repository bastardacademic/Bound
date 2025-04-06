<script>
  import { onMount } from 'svelte';
  let conversations = [];
  let selected = null;
  let message = '';
  let thread = [];

  async function loadConversations() {
    const res = await fetch('/api/messages');
    conversations = await res.json();
  }

  async function selectConversation(conv) {
    selected = conv;
    await loadThread();
  }

  async function loadThread() {
    const res = await fetch('/api/messages/' + selected.id);
    thread = await res.json();
  }

  async function sendMessage() {
    if (!message.trim()) return;
    const res = await fetch('/api/messages/' + selected.id, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: message })
    });
    const newMsg = await res.json();
    thread.push(newMsg);
    message = '';
    await loadConversations(); // refresh unread counts
  }

  let poller;
  onMount(() => {
    loadConversations();
    poller = setInterval(() => {
      loadConversations();
      if (selected) loadThread();
    }, 5000);
    return () => clearInterval(poller);
  });
</script>

<h2>Messages</h2>
<div style='display: flex; gap: 2rem;'>
  <aside>
    <ul>
      {#each conversations as conv}
        <li>
          <button on:click={() => selectConversation(conv)}>
            {conv.name} {#if conv.unread > 0}<strong>({conv.unread})</strong>{/if}
          </button>
        </li>
      {/each}
    </ul>
  </aside>

  {#if selected}
  <section>
    <h3>Chat with {selected.name}</h3>
    <div class='thread'>
      {#each thread as msg}
        <p><strong>{msg.senderId === selected.id ? selected.name : 'Me'}:</strong> {msg.content}</p>
      {/each}
    </div>
    <input bind:value={message} placeholder='Type message...' />
    <button on:click={sendMessage}>Send</button>
  </section>
  {/if}
</div>
