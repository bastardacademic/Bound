<script>
  import { onMount } from 'svelte';
  import { session } from '$stores/session';
  import { goto } from '$app/navigation';
  import { get } from 'svelte/store';

  let badges = [];
  let loading = true;

  onMount(async () => {
    const { token } = get(session);
    if (!token) goto('/login');
    const res = await fetch('/api/achievements');
    const data = await res.json();
    badges = data.badges || [];
    loading = false;
  });
</script>

<h2>Achievements & Badges</h2>
{#if loading}
  <p>Loading...</p>
{:else if badges.length === 0}
  <p>No achievements earned yet. Keep going!</p>
{:else}
  <div class='grid'>
    {#each badges as badge}
      <div class='badge'>
        <img src={badge.icon} alt={badge.name} />
        <strong>{badge.name}</strong>
        <p>{badge.description}</p>
      </div>
    {/each}
  </div>
{/if}

<style>
  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 1rem;
  }
  .badge {
    text-align: center;
    padding: 1rem;
    background: var(--surface);
    border: 1px solid #ccc;
    border-radius: 8px;
  }
  .badge img {
    width: 48px;
    height: 48px;
    margin-bottom: 0.5rem;
  }
</style>
