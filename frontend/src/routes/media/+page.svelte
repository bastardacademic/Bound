<script lang="ts">
  import CommentThread from "$lib/components/CommentThread.svelte";
  import ProfilePreviewCard from "$lib/components/ProfilePreviewCard.svelte";
  import { useHoverPreview } from "$lib/utils/useHoverPreview";
  import { pinnedItems, togglePin } from "$lib/stores/pins";
  import { session } from "$stores/session";
  import { get } from "svelte/store";

  let posts = [];
  let shown = {};

  function isCW(post) {
    return post.title?.toLowerCase().startsWith("cw:") || post.tags?.some(t => t.toLowerCase().startsWith("cw:"));
  }

  function toggleCW(id) {
    shown[id] = !shown[id];
  }

  async function fetchMedia() {
    const { token } = get(session);
    const res = await fetch("/api/media", {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (res.ok) {
      const data = await res.json();
      posts = data.posts;
    }
  }

  fetchMedia();
</script>

<h2>Media Gallery</h2>
<ul>
  {#each posts as post}
    <li class:blurred={isCW(post) && !shown[post.id]}>
      {#if isCW(post) && !shown[post.id]}
        <button on:click={() => toggleCW(post.id)} class="reveal">?? Content Warning – Click to Reveal</button>
      {/if}
      <span use:useHoverPreview={() => {
        const el = document.createElement("div");
        new ProfilePreviewCard({
          target: el,
          props: {
            username: post.author.username,
            displayName: post.author.displayName,
            pronouns: post.author.pronouns,
            flair: post.author.flair,
            mutualGroups: post.author.mutualGroups || []
          }
        });
        return el;
      }}>
        <strong>{post.title}</strong>
      </span><br />
      <button on:click={() => togglePin("media", post.id)}>
        {#if get(pinnedItems).some(p => p.id === post.id)}?? Unpin{:else}?? Pin{/if}
      </button>
      <CommentThread comments={post.comments || []} onComment={(t) => console.log("Media comment:", t)} />
      {#if isCW(post) && shown[post.id]}<p class="note">(CW revealed)</p>{/if}
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
