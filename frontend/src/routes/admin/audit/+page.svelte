<script lang="ts">
  import { onMount } from "svelte";
  import { session } from "$stores/session";
  import { goto } from "$app/navigation";
  import { get } from "svelte/store";

  let actions = [];

  onMount(async () => {
    const user = get(session).user;
    if (!user || user.role !== "admin") {
      goto("/");
      return;
    }

    const res = await fetch("/api/admin/audit");
    if (res.ok) {
      actions = await res.json();
    }
  });
</script>

<h2>?? Audit Log</h2>

{#if actions.length === 0}
  <p>No actions recorded yet.</p>
{:else}
  <ul>
    {#each actions as a}
      <li>
        <strong>{a.timestamp}</strong> — <em>{a.mod}</em> performed <code>{a.action}</code> on <code>{a.targetType}</code> [{a.targetId}]
        {#if a.note}<br /><small>Note: {a.note}</small>{/if}
      </li>
    {/each}
  </ul>
{/if}

<style>
  li { margin-bottom: 1rem; }
  code { background: #eee; padding: 0 0.3rem; border-radius: 3px; }
</style>
