<script lang="ts">
  import { onMount } from "svelte";
  import { page } from "$app/stores";
  import ReportButton from "$lib/components/ReportButton.svelte";
  let username = "";
  let user = null;
  let message = "";
  $: username = $page.params.username;
  onMount(async () => {
    const res = await fetch("/api/users/" + username);
    if (res.ok) user = await res.json();
  });
  async function muteUser() {
    await fetch("/api/users/mute", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username })
    });
    message = "User muted.";
  }
  async function blockUser() {
    await fetch("/api/users/block", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username })
    });
    message = "User blocked.";
  }
</script>

<h2>Profile: {username}</h2>
{#if user}
  <p><strong>Pronouns:</strong> {user.pronouns}</p>
  <p><strong>Orientation:</strong> {user.orientation}</p>
  <div class="actions">
    <button on:click={muteUser}>Mute</button>
    <button on:click={blockUser}>Block</button>
    <ReportButton targetId={username} type="user" />
  </div>
{:else}
  <p>Loading profile...</p>
{/if}
{#if message}<p style="color: green;">{message}</p>{/if}
