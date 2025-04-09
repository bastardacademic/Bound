<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores';

  let username = '';
  let user = null;
  let message = '';

  $: username = $page.params.username;

  onMount(async () => {
    const res = await fetch('/api/users/' + username);
    if (res.ok) {
      user = await res.json();
    }
  });

  async function muteUser() {
    await fetch('/api/users/mute', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username })
    });
    message = 'User muted.';
  }

  async function blockUser() {
    await fetch('/api/users/block', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username })
    });
    message = 'User blocked.';
  }
</script>

<h2>Profile: {username}</h2>

{#if user}
  <p><strong>Pronouns:</strong> {user.pronouns}</p>
  <p><strong>Orientation:</strong> {user.orientation}</p>

  <div class="actions">
    <button on:click={muteUser}>Mute</button>
    <button on:click={blockUser}>Block</button>
  </div>
{:else}
  <p>Loading profile...</p>
{/if}

{#if message}<p style="color: green;">{message}</p>{/if}

<style>
  .actions {
    margin-top: 1rem;
    display: flex;
    gap: 1rem;
  }
  .actions button {
    padding: 0.4rem 1rem;
    background: #eee;
    border: 1px solid #999;
    border-radius: 4px;
    cursor: pointer;
  }
</style>
