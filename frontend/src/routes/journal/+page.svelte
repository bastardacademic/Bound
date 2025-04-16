<script lang="ts">
  import CommentThread from "$lib/components/CommentThread.svelte";
  import ProfilePreviewCard from "$lib/components/ProfilePreviewCard.svelte";
  import { useHoverPreview } from "$lib/utils/useHoverPreview";
  import { pinnedItems, togglePin } from "$lib/stores/pins";
  import { session } from "$stores/session";
  import { get } from "svelte/store";

  let entries = [];
  let shown = {};

  function isCW(entry) {
    return entry.title?.toLowerCase().startsWith("cw:") || entry.tags?.some(t => t.toLowerCase().startsWith("cw:"));
  }

  function toggleCW(id) {
    shown[id] = !shown[id];
  }

  async function fetchEntries() {
    const { token } = get(session);
    const res = await fetch("/api/journal", {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (res.ok) {
      const data = await res.json();
      entries = data.entries;
    }
  }

  fetchEntries();
</script>

<h2>My Journal</h2>
<ul>
  {#each entries as entry}
    <li class:blurred={isCW(entry) && !shown[entry.id]}>
      {#if isCW(entry) && !shown[entry.id]}
        <button on:click={() => toggleCW(entry.id)} class="reveal">?? Content Warning – Click to Reveal</button>
      {/if}
      <span use:useHoverPreview={() => {
        const el = document.createElement("div");
        new ProfilePreviewCard({
          target: el,
          props: {
            username: entry.author.username,
            displayName: entry.author.displayName,
            pronouns: entry.author.pronouns,
            flair: entry.author.flair,
            mutualGroups: entry.author.mutualGroups || []
          }
        });
        return el;
      }}>
        <strong>{entry.title}</strong>
      </span><br />
      <em>{entry.content}</em>
      <button on:click={() => togglePin("journal", entry.id)}>
        {#if get(pinnedItems).some(p => p.id === entry.id)}?? Unpin{:else}?? Pin{/if}
      </button>
      <CommentThread comments={entry.comments || []} onComment={(t) => console.log("New comment:", t)} />
      {#if isCW(entry) && shown[entry.id]}<p class="note">(CW revealed)</p>{/if}
    </li>
  {/each}
</ul>
<style>
  .blurred { filter: blur(4px); position: relative; }
  .reveal {
    position: absolute; top: 0; left: 0;
    font-size: 0.9rem; padding: 0.25rem 0.5rem;
    background: #222; color: yellow;
    z-index: 5; border: 1px solid #888; border-radius: 4px;
  }
  .note { font-size: 0.75rem; color: #aaa; }
</style>
