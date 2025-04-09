<script lang="ts">
  import { onMount } from 'svelte';

  let events = [];
  let typeFilter = 'all';
  let keyword = '';

  onMount(() => {
    fetchEvents();
  });

  async function fetchEvents() {
    const query = new URLSearchParams();
    if (typeFilter !== 'all') query.append('type', typeFilter);
    if (keyword) query.append('q', keyword);

    const res = await fetch('/api/events/public?' + query.toString());
    events = await res.json();
  }
</script>

<h2>All Events</h2>

<div class="filters">
  <input type="text" bind:value={keyword} on:input={fetchEvents} placeholder="Search events..." />
  <select bind:value={typeFilter} on:change={fetchEvents}>
    <option value="all">All Types</option>
    <option value="workshop">Workshop</option>
    <option value="munch">Munch</option>
    <option value="festival">Festival</option>
    <option value="playparty">Play Party</option>
    <option value="educational">Educational</option>
    <option value="sexparty">Sex Party</option>
  </select>
</div>

<ul>
  {#each events as event}
    <li>
      <strong>{event.title}</strong> — {event.type}<br />
      {event.date} at {event.time} — {event.location}<br />
      {event.description}
    </li>
  {/each}
</ul>
