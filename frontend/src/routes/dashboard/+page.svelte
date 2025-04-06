<script>
  import { session } from '$stores/session';
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { get } from 'svelte/store';

  let stats = {};
  let loading = true;

  onMount(async () => {
    const { token } = get(session);
    if (!token) goto('/login');
    const res = await fetch('/api/dashboard');
    stats = await res.json();
    loading = false;
  });
</script>

<h2>Welcome to Your Dashboard</h2>
{#if loading}
  <p>Loading...</p>
{:else}
  <ul>
    <li><strong>Unread Messages:</strong> {stats.unreadMessages}</li>
    <li><strong>Journal Entries:</strong> {stats.journalCount}</li>
    <li><strong>Achievements:</strong> {stats.achievements}</li>
    <li><strong>Connections:</strong> {stats.connections}</li>
  </ul>
{/if}
