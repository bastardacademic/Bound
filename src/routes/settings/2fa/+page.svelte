<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '/navigation';
  let qrUrl: string | null = null;
  let token = '';
  let message = '';

  // Fetch otpauth URL on mount
  onMount(async () => {
    const res = await fetch('/api/admin/2fa-setup');
    if (res.ok) {
      const data = await res.json();
      qrUrl = data.otpauth_url;
    } else {
      message = 'Failed to load 2FA setup.';
    }
  });

  // Verify token
  async function verify() {
    message = '';
    const res = await fetch('/api/admin/2fa-verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, secret: qrUrl })
    });
    const data = await res.json();
    if (data.verified) {
      message = '2FA setup successful!';
      // Redirect or update UI
      setTimeout(() => goto('/settings'), 1000);
    } else {
      message = 'Invalid code, please try again.';
    }
  }
</script>

<div class="p-4 max-w-md mx-auto bg-white dark:bg-gray-800 rounded">
  <h1 class="text-xl font-bold mb-4">Two-Factor Authentication</h1>

  {#if qrUrl}
    <p>Scan this QR code with your authenticator app:</p>
    <img src={qrUrl} alt="2FA QR Code" class="my-4 w-48 h-48 mx-auto" />

    <label class="block mb-2">Enter code:</label>
    <input type="text" bind:value={token} class="w-full p-2 mb-4 rounded border" placeholder="123456" />
    <button on:click={verify} class="px-4 py-2 bg-blue-600 text-white rounded">Verify</button>
  {:else}
    <p>Loading 2FA setup...</p>
  {/if}

  {#if message}
    <p class="mt-4 text-center">{message}</p>
  {/if}
</div>
