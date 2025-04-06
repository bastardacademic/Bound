<script>
  import { onMount } from 'svelte';
  import { theme } from '/theme';

  onMount(() => {
    const stored = localStorage.getItem('theme');
    if (stored) {
      theme.set(stored);
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      theme.set(prefersDark ? 'dark' : 'light');
    }
  });
</script>

<slot />
