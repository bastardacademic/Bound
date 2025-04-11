<script lang="ts">
  import { onMount } from "svelte";
  import { page } from "$app/stores";
  import ReportButton from "$lib/components/ReportButton.svelte";
  let groupId = "";
  let group = null;
  let message = "";
  $: groupId = $page.params.id;
  onMount(async () => {
    const res = await fetch("/api/groups/" + groupId);
    if (res.ok) group = await res.json();
  });
  async function muteGroup() {
    await fetch("/api/groups/mute", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ groupId })
    });
    message = "Group muted.";
  }
  async function blockGroup() {
    await fetch("/api/groups/block", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ groupId })
    });
    message = "Group blocked and left.";
  }
</script>

<h2>Group: {group?.name || groupId}</h2>
{#if group}
  <p><strong>Description:</strong> {group.description}</p>
  <div class="actions">
    <button on:click={muteGroup}>Mute Group</button>
    <button on:click={blockGroup}>Block & Leave</button>
    <ReportButton targetId={groupId} type="group" />
  </div>
{:else}
  <p>Loading group info...</p>
{/if}
{#if message}<p style="color: green;">{message}</p>{/if}
