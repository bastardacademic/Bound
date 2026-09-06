<script lang="ts">
  import { onMount } from "svelte";
  import ThemeToggle from "$lib/components/ThemeToggle.svelte";
  import { accessibility } from "$stores/accessibility";

  onMount(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/service-worker.js");
    }
  });
</script>

<header>
  <h1>Bound</h1>
  <ThemeToggle />
</header>

<slot />

<style>
  header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
  }
</style>
