<script>
  import { onMount } from 'svelte';
  import { session } from '$stores/session';
  import { goto } from '$app/navigation';
  import { get } from 'svelte/store';

  let profile = { email: '', bio: '', pronouns: '' };
  let theme = 'light';
  let message = '';
  let error = '';

  onMount(async () => {
    const { token } = get(session);
    if (!token) goto('/login');
    const res = await fetch('/api/users/me');
    const data = await res.json();
    profile = { ...data };
    theme = localStorage.getItem('theme') || 'light';
  });

  async function updateProfile() {
    const res = await fetch('/api/users/me', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profile)
    });

    if (res.ok) {
      message = 'Profile updated';
    } else {
      error = 'Failed to update';
    }
  }

  function updateTheme(newTheme) {
    theme = newTheme;
    localStorage.setItem('theme', newTheme);
    document.documentElement.className = newTheme === 'dark' ? 'theme-dark' : 'theme-light';
  }
</script>

<h2>Settings</h2>
<form on:submit|preventDefault={updateProfile}>
  <label>Email (read-only)</label>
  <input type="email" value={profile.email} disabled />
  <label>Bio</label>
  <textarea bind:value={profile.bio} rows="3"></textarea>
  <label>Pronouns</label>
  <input type="text" bind:value={profile.pronouns} />
  <button type="submit">Update Profile</button>
</form>

{#if message}<p style="color: green;">{message}</p>{/if}
{#if error}<p style="color: red;">{error}</p>{/if}

<h3>Theme</h3>
<label><input type="radio" name="theme" value="light" checked={theme === 'light'} on:change={() => updateTheme('light')} /> Light</label>
<label><input type="radio" name="theme" value="dark" checked={theme === 'dark'} on:change={() => updateTheme('dark')} /> Dark</label>
