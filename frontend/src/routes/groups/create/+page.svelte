<script lang="ts">
  import { onMount } from 'svelte';
  import { session } from '$stores/session';
  import { goto } from '$app/navigation';
  import { get } from 'svelte/store';

  let name = '';
  let description = '';
  let type = 'public';
  let joinPolicy = 'auto';
  let conduct = '';
  let message = '';

  onMount(() => {
    const { token } = get(session);
    if (!token) goto('/login');
  });

  async function createGroup() {
    if (!name || !description) {
      message = 'Name and description are required.';
      return;
    }

    const res = await fetch('/api/groups', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, description, type, joinPolicy, conduct })
    });

    if (res.ok) {
      message = 'Group created successfully.';
      name = '';
      description = '';
      type = 'public';
      joinPolicy = 'auto';
      conduct = '';
    } else {
      message = 'Failed to create group.';
    }
  }
</script>

<h2>Create New Group</h2>
<form on:submit|preventDefault={createGroup}>
  <label>Group Name</label>
  <input type="text" bind:value={name} required />

  <label>Description</label>
  <textarea rows="3" bind:value={description} required></textarea>

  <label>Type</label>
  <select bind:value={type}>
    <option value="public">Public (searchable, joinable)</option>
    <option value="private">Private (hidden, invite-only)</option>
  </select>

  {#if type === 'public'}
    <label>Join Policy</label>
    <select bind:value={joinPolicy}>
      <option value="auto">Anyone can join</option>
      <option value="approval">Approval required</option>
    </select>
  {/if}

  <label>Code of Conduct (optional)</label>
  <textarea rows="3" bind:value={conduct} placeholder="Group rules or posting policies (optional)"></textarea>

  <button type="submit">Create Group</button>
</form>

{#if message}<p style="color: green;">{message}</p>{/if}
