<script lang="ts">
  import ThemeToggle from "$lib/components/ThemeToggle.svelte";
  import { accessibility } from "$stores/accessibility";
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
