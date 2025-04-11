<script lang="ts">
  import { onMount } from "svelte";
  import { session } from "$stores/session";
  import { goto } from "$app/navigation";
  import { get } from "svelte/store";

  let reports = [];

  onMount(async () => {
    const user = get(session).user;
    if (!user || user.role !== "admin") {
      goto("/");
      return;
    }

    const res = await fetch("/api/reports?status=open");
    if (res.ok) {
      reports = await res.json();
    }
  });

  async function resolveReport(id) {
    await fetch(`/api/reports/${id}/resolve`, { method: "POST" });
    reports = reports.filter(r => r.id !== id);
  }

  async function escalate(id) {
    await fetch(`/api/reports/${id}/escalate`, { method: "POST" });
    reports = reports.filter(r => r.id !== id);
  }

  async function removeTarget(id) {
    await fetch(`/api/reports/${id}/remove`, { method: "POST" });
    reports = reports.filter(r => r.id !== id);
  }
</script>

<h2>?? Admin Report Queue</h2>

{#if reports.length === 0}
  <p>No open reports ??</p>
{:else}
  <ul>
    {#each reports as r}
      <li>
        <strong>{r.type.toUpperCase()}</strong> — {r.reason}
        <br />
        <a href={r.link} target="_blank">View Target</a>
        <br />
        <small>{r.note}</small>
        <div class="actions">
          <button on:click={() => resolveReport(r.id)}>Mark Resolved</button>
          <button on:click={() => removeTarget(r.id)}>Remove Content</button>
          <button on:click={() => escalate(r.id)}>Freeze Account</button>
        </div>
      </li>
    {/each}
  </ul>
{/if}

<style>
  ul { padding: 0; list-style: none; }
  li {
    margin-bottom: 1.5rem;
    padding: 1rem;
    background: #f9f9f9;
    border-left: 4px solid crimson;
  }
  .actions button {
    margin-right: 1rem;
    padding: 0.4rem 1rem;
    cursor: pointer;
  }
</style>
