<script>
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  let userId = '';
  let profile = null;
  let loading = true;
  let error = '';

  $: userId = $page.params.id;

  onMount(async () => {
    try {
      const res = await fetch('/api/users/' + userId + '/public');
      if (!res.ok) throw new Error();
      profile = await res.json();
    } catch {
      error = 'Could not load public profile.';
    } finally {
      loading = false;
    }
  });
</script>

<h2>Public Profile</h2>
{#if loading}
  <p>Loading...</p>
{:else if error}
  <p style='color:red;'>{error}</p>
{:else}
  <div class='card'>
    <h3>{profile.displayName || profile.email}</h3>
    <p><em>{profile.bio}</em></p>
    <p>Pronouns: {profile.pronouns}</p>
    <p>Joined: {new Date(profile.createdAt).toLocaleDateString()}</p>
    <p>Journal entries: {profile.journalCount}</p>
    <p>Connections: {profile.connections}</p>
  </div>
{/if}

<style>
  .card {
    border: 1px solid #ccc;
    padding: 1rem;
    border-radius: 8px;
    background: var(--surface);
  }
</style>
