<script>
  // Register our service worker on client
  if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js');
  }
</script>

<slot /> <!-- Render the page content -->
<script>if ('serviceWorker' in navigator) navigator.serviceWorker.register('/service-worker.js');</script>
