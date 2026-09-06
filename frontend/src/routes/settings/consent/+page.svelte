<script lang="ts">
  import { onMount } from "svelte";
  import { session } from "$stores/session";
  import { get } from "svelte/store";

  let ledger = [];
  let error = "";

  async function loadLedger() {
    const { token } = get(session);
    const res = await fetch("/api/consent", {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (res.ok) ledger = await res.json();
  }

  async function revoke(id: number) {
    if (!confirm("Are you sure you want to revoke this consent?")) return;

    const { token } = get(session);
    const res = await fetch(`/api/consent/${id}/revoke`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` }
    });
    if (res.ok) {
      const updated = await res.json();
      ledger = ledger.map((item) => (item.id === updated.id ? updated : item));
    } else {
      error = "Could not revoke consent.";
    }
  }

  onMount(loadLedger);
</script>

<h2>Consent Ledger</h2>

{#if error}<p style="color: red;">{error}</p>{/if}

{#if ledger.length === 0}
  <p>No consent approvals found.</p>
{:else}
  <ul>
    {#each ledger as item (item.id)}
      <li>
        <strong>{item.label}</strong><br />
        <small>Approved: {new Date(item.createdAt).toLocaleString()}</small>
        {#if item.revoked}
          <span class="revoked">Revoked</span>
        {:else}
          <button on:click={() => revoke(item.id)}>Revoke</button>
        {/if}
      </li>
    {/each}
  </ul>
{/if}

<style>
  ul {
    list-style: none;
    padding: 0;
  }
  li {
    margin-bottom: 1rem;
    border-bottom: 1px solid #333;
    padding-bottom: 0.5rem;
  }
  button {
    margin-top: 0.25rem;
  }
  .revoked {
    color: red;
    font-weight: bold;
    margin-left: 0.5rem;
  }
</style>
