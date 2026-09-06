<script lang='ts'>
  import { session } from '$stores/session';
  import { get } from 'svelte/store';

  let enabled = false;
  let error = '';

  function urlBase64ToUint8Array(base64: string) {
    const padding = '='.repeat((4 - (base64.length % 4)) % 4);
    const base64Safe = (base64 + padding).replace(/-/g, '+').replace(/_/g, '/');
    return Uint8Array.from(atob(base64Safe), (c) => c.charCodeAt(0));
  }

  async function subscribe() {
    error = '';
    try {
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(import.meta.env.VITE_VAPID_PUBLIC_KEY)
      });
      const { token } = get(session);
      const res = await fetch('/api/notifications/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ subscription: sub })
      });
      if (!res.ok) throw new Error('Server rejected subscription');
      enabled = true;
    } catch (err) {
      error = 'Could not enable notifications. Check browser permissions and try again.';
    }
  }
</script>
<button on:click={subscribe} disabled={enabled} class='px-4 py-2 bg-green-600 rounded text-white'>
  {enabled ? 'Subscribed to Notifications' : 'Enable Notifications'}
</button>
{#if error}<p style='color: red;'>{error}</p>{/if}
