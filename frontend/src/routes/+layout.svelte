<script lang="ts">
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import ThemeToggle from "$lib/components/ThemeToggle.svelte";
  import { accessibility } from "$stores/accessibility";
  import { session, logout } from "$stores/session";

  onMount(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/service-worker.js");
    }
  });

  function handleLogout() {
    logout();
    goto("/login");
  }
</script>

<header>
  <h1>Bound</h1>
  <div class="actions">
    <ThemeToggle />
    {#if $session.token}
      <button on:click={handleLogout}>Log out</button>
    {/if}
  </div>
</header>

<slot />

<style>
  header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
  }
  .actions {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }
</style>
