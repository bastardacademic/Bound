<script lang='ts'>
  let enabled = false;
  async function subscribe() {
    const reg = await navigator.serviceWorker.ready;
    const sub = await reg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: Uint8Array.from(atob(import.meta.env.VITE_VAPID_PUBLIC_KEY), c => c.charCodeAt(0))
    });
    await fetch('/api/notifications/subscribe', {
      method: 'POST', headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ subscription: sub })
    });
    enabled = true;
  }
</script>
<button on:click={subscribe} disabled={enabled} class='px-4 py-2 bg-green-600 rounded text-white'>
  {enabled ? 'Subscribed to Notifications' : 'Enable Notifications'}
</button>
