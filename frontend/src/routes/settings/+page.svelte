<script>
  import { onMount } from 'svelte';
  import { session } from '/session';
  import { goto } from '/navigation';
  import { get } from 'svelte/store';

  let preferences = {
    darkMode: false,
    emailNotifications: true,
  };

  onMount(() => {
    const { token } = get(session);
    if (!token) goto('/login');
    loadSettings();
  });

  async function loadSettings() {
    const res = await fetch('/api/settings');
    preferences = await res.json();
  }

  async function saveSettings() {
    await fetch('/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(preferences)
    });
  }
</script>

<h2>Settings</h2>
<form on:submit|preventDefault={saveSettings}>
  <label><input type='checkbox' bind:checked={preferences.darkMode} /> Dark Mode</label><br />
  <label><input type='checkbox' bind:checked={preferences.emailNotifications} /> Email Notifications</label><br />
  <button type='submit'>Save</button>
</form>
