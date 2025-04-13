<script lang="ts">
  let isTyping = true;
  let timeout;
  function simulatePeerTyping() {
    clearTimeout(timeout);
    isTyping = true;
    timeout = setTimeout(() => isTyping = false, 3000);
  }

  let messages = [
    { id: 1, sender: "UserA", text: "Hey!" },
    { id: 2, sender: "UserB", text: "What’s up?" }
  ];
</script>

<ul>
  {#each messages as msg}
    <li><strong>{msg.sender}</strong>: <span>{msg.text}</span> <span class="delivered">✅</span></li>
  {/each}
</ul>
{#if isTyping}
  <p class="typing">✏️ typing...</p>
{/if}