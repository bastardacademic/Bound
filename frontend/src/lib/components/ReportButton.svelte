<script lang="ts">
  export let targetId: string;
  export let type: "post" | "user" | "group";
  let open = false;
  let reason = "";
  let note = "";
  let submitted = false;
  const reasons = [
    "Non-consensual content",
    "Underage depiction",
    "Harassment or abuse",
    "Impersonation or fake identity",
    "Spam or scam",
    "Other"
  ];
  async function submitReport() {
    const res = await fetch("/api/reports", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ targetId, type, reason, note })
    });
    if (res.ok) {
      submitted = true;
      open = false;
    }
  }
</script>

{#if !submitted}
  <button on:click={() => (open = !open)}>Report</button>
{/if}
{#if open}
  <div class="report-form">
    <label>Reason</label>
    <select bind:value={reason}>
      <option value="">Choose reason</option>
      {#each reasons as r}<option value={r}>{r}</option>{/each}
    </select>
    {#if reason === "Other"}
      <textarea bind:value={note} placeholder="Optional additional info" />
    {/if}
    <button on:click={submitReport} disabled={!reason}>Submit Report</button>
  </div>
{/if}
{#if submitted}
  <p style="color: green;">Report submitted.</p>
{/if}
