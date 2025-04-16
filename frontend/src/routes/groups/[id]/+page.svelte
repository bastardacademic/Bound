<script>
  import { mutedGroups, blockedGroups, toggleMuteGroup, toggleBlockGroup } from "$lib/stores/groups";
  import { get } from "svelte/store";

  let group = {
    id: "group123",
    name: "Rope Dojo"
  };

  $: muted = get(mutedGroups).includes(group.id);
  $: blocked = get(blockedGroups).includes(group.id);
</script>

<h2>{group.name}</h2>

<button on:click={() => toggleMuteGroup(group.id)}>
  {#if muted}?? Unmute Group{:else}?? Mute Group{/if}
</button>

<button on:click={() => toggleBlockGroup(group.id)}>
  {#if blocked}?? Unblock Group{:else}?? Block Group{/if}
</button>

<p class="note">This group page is for demonstration. Posts and members would be listed below.</p>

<style>
  .note {
    margin-top: 1rem;
    color: #888;
  }
  button {
    margin-right: 1rem;
    padding: 0.5rem 1rem;
    border: 1px solid #444;
    border-radius: 4px;
    background: #222;
    color: white;
  }
</style>
