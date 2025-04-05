<script>
  let conversations = [
    { id: 1, name: 'RopeTop99' },
    { id: 2, name: 'SwitchBabe' }
  ];
  let selected = null;
  let message = '';
  let thread = [];

  function selectConversation(conv) {
    selected = conv;
    thread = [
      { from: 'them', text: 'Hey there!' },
      { from: 'me', text: 'Hello!' }
    ];
  }

  function sendMessage() {
    if (!message.trim()) return;
    thread.push({ from: 'me', text: message });
    message = '';
  }
</script>

<h2>Messages</h2>
<div style='display: flex; gap: 2rem;'>
  <aside>
    <ul>
      {#each conversations as conv}
        <li><button on:click={() => selectConversation(conv)}>{conv.name}</button></li>
      {/each}
    </ul>
  </aside>

  {#if selected}
  <section>
    <h3>Chat with {selected.name}</h3>
    <div class='thread'>
      {#each thread as msg}
        <p><strong>{msg.from}:</strong> {msg.text}</p>
      {/each}
    </div>
    <input bind:value={message} placeholder='Type message...' />
    <button on:click={sendMessage}>Send</button>
  </section>
  {/if}
</div>
