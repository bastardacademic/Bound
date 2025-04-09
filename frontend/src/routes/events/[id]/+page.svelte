<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { session } from '$stores/session';
  import { goto } from '$app/navigation';
  import { get } from 'svelte/store';

  let eventId = '';
  let event = null;
  let message = '';

  $: eventId = $page.params.id;

  onMount(async () => {
    const { token } = get(session);
    if (!token) goto('/login');

    const res = await fetch('/api/events/' + eventId);
    if (res.ok) {
      event = await res.json();
    }
  });

  async function rsvp(status: 'interested' | 'going') {
    const res = await fetch('/api/events/' + eventId + '/rsvp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    if (res.ok) {
      message = 'RSVP updated.';
    } else {
      message = 'Failed to RSVP.';
    }
  }
</script>

{#if event}
  <h2>{event.title}</h2>
  <p><strong>{event.type}</strong> — {event.date} at {event.time}</p>
  <p><strong>Location:</strong> {event.location}</p>
  <p>{event.description}</p>

  <button on:click={() => rsvp('interested')}>Maybe</button>
  <button on:click={() => rsvp('going')}>See You There!</button>
  {#if message}<p style="color: green;">{message}</p>{/if}
{:else}
  <p>Loading event...</p>
{/if}
