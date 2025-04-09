<script lang="ts">
  import { onMount } from 'svelte';
  import { session } from '$stores/session';
  import { goto } from '$app/navigation';
  import { get } from 'svelte/store';

  let title = '';
  let type = 'workshop';
  let description = '';
  let location = '';
  let date = '';
  let time = '';
  let visibility = 'shared';
  let isRepeating = false;
  let message = '';

  onMount(() => {
    const { token } = get(session);
    if (!token) goto('/login');
  });

  async function createEvent() {
    if (!title || !type || !description || !date || !time) {
      message = 'Please complete all required fields.';
      return;
    }

    const res = await fetch('/api/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title, type, description, location, date, time,
        visibility, isRepeating
      })
    });

    if (res.ok) {
      message = 'Event created.';
      title = '';
      type = 'workshop';
      description = '';
      location = '';
      date = '';
      time = '';
      visibility = 'shared';
      isRepeating = false;
    } else {
      message = 'Event creation failed.';
    }
  }
</script>

<h2>Create Event</h2>
<form on:submit|preventDefault={createEvent}>
  <label>Title</label>
  <input type="text" bind:value={title} required />

  <label>Type</label>
  <select bind:value={type}>
    <option value="workshop">Workshop</option>
    <option value="munch">Munch</option>
    <option value="festival">Festival</option>
    <option value="playparty">Play Party</option>
    <option value="educational">Educational</option>
    <option value="sexparty">Sex Party</option>
  </select>

  <label>Description</label>
  <textarea rows="3" bind:value={description} required></textarea>

  <label>Location</label>
  <input type="text" bind:value={location} placeholder="City, venue, or fuzzy location" />

  <label>Date</label>
  <input type="date" bind:value={date} required />

  <label>Time</label>
  <input type="time" bind:value={time} required />

  <label>Visibility</label>
  <select bind:value={visibility}>
    <option value="shared">Shared (Friends & Constellation)</option>
    <option value="public">Public (Everyone)</option>
  </select>

  <label><input type="checkbox" bind:checked={isRepeating} /> Repeating event</label>

  <button type="submit">Create Event</button>
</form>

{#if message}<p style="color: green;">{message}</p>{/if}
