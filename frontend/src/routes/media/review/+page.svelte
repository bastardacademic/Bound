<script lang="ts">
  import { onMount } from "svelte";
  import { session } from "$stores/session";
  import { goto } from "$app/navigation";
  import { get } from "svelte/store";

  let pending = [];

  onMount(async () => {
    const { token } = get(session);
    if (!token) goto("/login");

    const res = await fetch("/api/media/review");
    if (res.ok) {
      pending = await res.json();
    }
  });

  async function approve(id) {
    await fetch(`/api/media/${id}/approve`, { method: "POST" });
    pending = pending.filter(p => p.id !== id);
  }

  async function deny(id) {
    await fetch(`/api/media/${id}/deny`, { method: "POST" });
    pending = pending.filter(p => p.id !== id);
  }
</script>

<h2>?? Media Tag Consent Requests</h2>

{#if pending.length === 0}
  <p>You have no unapproved tags.</p>
{:else}
  <ul>
    {#each pending as item}
      <li>
        <strong>Tagged by {item.author}</strong> — {item.created}
        <br />
        <img src={item.preview} alt="media preview" width="200" />
        <div class="actions">
          <button on:click={() => approve(item.id)}>Approve</button>
          <button on:click={() => deny(item.id)}>Deny</button>
        </div>
      </li>
    {/each}
  </ul>
{/if}

<style>
  ul { list-style: none; padding: 0; }
  li {
    margin-bottom: 2rem;
    padding: 1rem;
    background: #f1f1f1;
    border-radius: 6px;
  }
  img { display: block; margin-top: 0.5rem; border: 1px solid #ccc; }
  .actions button {
    margin-top: 0.5rem;
    margin-right: 1rem;
    padding: 0.4rem 1rem;
    cursor: pointer;
  }
</style>
