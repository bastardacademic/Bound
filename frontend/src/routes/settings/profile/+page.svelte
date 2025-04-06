<script lang="ts">
  import { onMount } from 'svelte';
  import { session } from '$stores/session';
  import { goto } from '$app/navigation';
  import { get } from 'svelte/store';

  let profile = {
    displayName: '',
    bio: '',
    gender: '',
    orientation: '',
    pronouns: '',
    starSign: '',
    age: '',
    showMaskedAge: true,
    country: '',
    showMaskedLocation: true
  };
  let message = '';
  let error = '';

  onMount(async () => {
    const { token } = get(session);
    if (!token) goto('/login');
    const res = await fetch('/api/users/me/profile');
    profile = await res.json();
  });

  async function updateProfile() {
    const res = await fetch('/api/users/me/profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profile)
    });

    if (res.ok) {
      message = 'Profile updated.';
    } else {
      error = 'Update failed.';
    }
  }
</script>

<h2>Profile Settings</h2>
<form on:submit|preventDefault={updateProfile}>
  <label>Display Name</label>
  <input type="text" bind:value={profile.displayName} />

  <label>Bio</label>
  <textarea rows="3" bind:value={profile.bio} placeholder="Minimum one sentence" />

  <label>Pronouns</label>
  <input type="text" bind:value={profile.pronouns} />

  <label>Gender Identity</label>
  <input type="text" bind:value={profile.gender} />

  <label>Sexual Orientation</label>
  <input type="text" bind:value={profile.orientation} />

  <label>Star Sign</label>
  <input type="text" bind:value={profile.starSign} />

  <label>Country</label>
  <input type="text" bind:value={profile.country} />
  <label><input type="checkbox" bind:checked={profile.showMaskedLocation} /> Show mythological location instead</label>

  <label>Age</label>
  <input type="number" bind:value={profile.age} />
  <label><input type="checkbox" bind:checked={profile.showMaskedAge} /> Show random age between 120–220</label>

  <button type="submit">Update Profile</button>
</form>

{#if message}<p style="color: green;">{message}</p>{/if}
{#if error}<p style="color: red;">{error}</p>{/if}
