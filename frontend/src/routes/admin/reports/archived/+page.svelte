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

    const res = await fetch("/api/reports?status=resolved");
    if (res.ok) {
      reports = await res.json();
    }
  });
</script>

<h2>?? Archived Reports</h2>

{#if reports.length === 0}
  <p>No archived reports found.</p>
{:else}
  <ul>
    {#each reports as r}
      <li>
        <strong>{r.type.toUpperCase()}</strong> — {r.reason}
        <br />
        <a href={r.link} target="_blank">View Target</a>
        <br />
        <small>{r.note}</small>
        <br />
        <em>Resolved by {r.resolvedBy} at {r.resolvedAt}</em>
      </li>
    {/each}
  </ul>
{/if}

<style>
  li {
    margin-bottom: 1.5rem;
    padding: 1rem;
    background: #f4f4f4;
    border-left: 4px solid #666;
  }
</style>
