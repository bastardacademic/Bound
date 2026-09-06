<script>
  import { onMount } from 'svelte';
  import { session } from '$stores/session';
  import { goto } from '$app/navigation';
  import { get } from 'svelte/store';
  import PushToggle from '$lib/components/PushToggle.svelte';

  let profile = { email: '', bio: '', pronouns: '' };
  let theme = 'light';
  let message = '';
  let error = '';

  let totpEnabled = get(session).user?.totp_enabled || false;
  let totpSetup = null; // { secret, otpauth_url } while a setup is pending confirmation
  let totpCode = '';
  let disablePassword = '';
  let totpError = '';

  async function authedFetch(url, opts = {}) {
    const { token } = get(session);
    return fetch(url, {
      ...opts,
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}`, ...(opts.headers || {}) }
    });
  }

  async function startTotpSetup() {
    totpError = '';
    const res = await authedFetch('/api/2fa/setup', { method: 'POST' });
    if (res.ok) {
      totpSetup = await res.json();
    } else {
      totpError = 'Could not start 2FA setup.';
    }
  }

  async function confirmTotpSetup() {
    totpError = '';
    const res = await authedFetch('/api/2fa/verify', {
      method: 'POST',
      body: JSON.stringify({ token: totpCode })
    });
    if (res.ok) {
      totpEnabled = true;
      totpSetup = null;
      totpCode = '';
    } else {
      const data = await res.json();
      totpError = data.message || 'Invalid code.';
    }
  }

  async function disableTotp() {
    totpError = '';
    const res = await authedFetch('/api/2fa/disable', {
      method: 'POST',
      body: JSON.stringify({ password: disablePassword })
    });
    if (res.ok) {
      totpEnabled = false;
      disablePassword = '';
    } else {
      const data = await res.json();
      totpError = data.message || 'Could not disable 2FA.';
    }
  }

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

<h3>Notifications</h3>
<PushToggle />

<h3>Two-Factor Authentication</h3>
{#if totpError}<p style="color: red;">{totpError}</p>{/if}

{#if totpEnabled}
  <p>Two-factor authentication is <strong>enabled</strong>.</p>
  <input type="password" placeholder="Confirm password to disable" bind:value={disablePassword} />
  <button on:click={disableTotp}>Disable 2FA</button>
{:else if totpSetup}
  <p>Scan this into your authenticator app, or enter it manually:</p>
  <code>{totpSetup.secret}</code>
  <p>Then enter the 6-digit code it generates to confirm:</p>
  <input type="text" placeholder="6-digit code" bind:value={totpCode} inputmode="numeric" />
  <button on:click={confirmTotpSetup}>Confirm</button>
{:else}
  <p>Two-factor authentication is not enabled.</p>
  <button on:click={startTotpSetup}>Enable 2FA</button>
{/if}
