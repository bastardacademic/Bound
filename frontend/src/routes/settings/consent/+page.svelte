<script lang="ts">
  import { getConsentLedger, revokeConsent, ConsentEntry } from "$lib/utils/consent.ts";

  let userId = "user123";
  let ledger: ConsentEntry[] = getConsentLedger(userId);

  function revoke(id: string) {
    if (confirm("Are you sure you want to revoke this consent?")) {
      if (revokeConsent(userId, id)) {
        ledger = [...ledger]; // refresh UI
      }
    }
  }
</script>

<h2>?? Consent Ledger</h2>

{#if ledger.length === 0}
  <p>No consent approvals found.</p>
{:else}
  <ul>
    {#each ledger as item}
      <li>
        <strong>{item.label}</strong><br />
        <small>Approved: {new Date(item.approvedAt).toLocaleString()}</small>
        {#if item.revoked}
          <span class="revoked">– Revoked</span>
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
