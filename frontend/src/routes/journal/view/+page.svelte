<script lang="ts">
  import { onMount } from 'svelte';
  import { session } from '$stores/session';
  import { goto } from '$app/navigation';
  import { get } from 'svelte/store';

  let entries = [];
  let tagFilter = '';
  let typeFilter = 'all';
  let allTags = [];

  onMount(async () => {
    const { token } = get(session);
    if (!token) goto('/login');
    await fetchEntries();
  });

  async function fetchEntries() {
    const query = new URLSearchParams();
    if (tagFilter) query.append('tag', tagFilter);
    if (typeFilter !== 'all') query.append('type', typeFilter);

    const res = await fetch('/api/journal?' + query.toString());
    const data = await res.json();
    entries = data.entries || [];
    allTags = data.tags || [];
  }
</script>

<h2>My Journal</h2>

<div class="filters">
  <label>Filter by Tag</label>
  <input type="text" placeholder="e.g. ritual, trust" bind:value={tagFilter} on:input={fetchEntries} />

  <label>Type</label>
  <select bind:value={typeFilter} on:change={fetchEntries}>
    <option value="all">All Types</option>
    <option value="journal">Journal</option>
    <option value="note">Note</option>
    <option value="erotica">Erotica</option>
    <option value="educational">Educational</option>
  </select>
</div>

<ul>
  {#each entries as entry}
    <li>
      <strong>{entry.title}</strong> <em>({entry.type})</em><br />
      <small>{entry.tags?.join(', ')}</small>
      <p>{entry.excerpt}</p>
    </li>
  {/each}
</ul>

<style>
  .filters {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    margin-bottom: 1rem;
  }
  .filters label {
    font-weight: bold;
  }
</style>
