<script lang="ts">
  import { onMount } from "svelte";
  import { session } from "$stores/session";
  import { goto } from "$app/navigation";
  import { get } from "svelte/store";

  let stats = {};

  onMount(async () => {
    const user = get(session).user;
    if (!user || user.role !== "admin") {
      goto("/");
      return;
    }

    const res = await fetch("/api/admin/stats");
    if (res.ok) {
      stats = await res.json();
    }
  });
</script>

<h2>?? Admin Dashboard</h2>

{#if Object.keys(stats).length === 0}
  <p>Loading stats...</p>
{:else}
  <section>
    <h3>Reports</h3>
    <p>Open: {stats.reports.open} | Resolved: {stats.reports.resolved}</p>
  </section>

  <section>
    <h3>Users</h3>
    <p>Total: {stats.users.total} | Active this week: {stats.users.active} | Frozen: {stats.users.frozen}</p>
  </section>

  <section>
    <h3>Content</h3>
    <p>Posts: {stats.content.total} | Flagged: {stats.content.flagged} | Awaiting Consent: {stats.content.pendingConsent}</p>
  </section>

  <section>
    <h3>Quick Links</h3>
    <ul>
      <li><a href="/admin/reports">?? Open Reports</a></li>
      <li><a href="/media/review">?? Consent Approvals</a></li>
      <li><a href="/admin/tags">??? Tag Moderation</a></li>
    </ul>
  </section>
{/if}

<style>
  section { margin-bottom: 2rem; }
  ul { padding-left: 1.2rem; }
</style>
