<script lang="ts">
  import { onMount } from 'svelte';
  import { session } from '$stores/session';
  import { goto } from '$app/navigation';
  import { get } from 'svelte/store';

  let events = [];

  onMount(async () => {
    const { token } = get(session);
    if (!token) goto('/login');
    const res = await fetch('/api/events/my-calendar');
    events = await res.json();
  });
</script>

<h2>My Event Calendar</h2>

{#if events.length === 0}
  <p>No upcoming events found.</p>
{:else}
  <ul>
    {#each events as event}
      <li>
        <strong>{event.title}</strong> — {event.type} <br />
        {event.date} at {event.time} — {event.location}
      </li>
    {/each}
  </ul>
{/if}
