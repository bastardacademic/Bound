<script lang="ts">
  import CommentThread from "$lib/components/CommentThread.svelte";
  import ProfilePreviewCard from "$lib/components/ProfilePreviewCard.svelte";
  import { useHoverPreview } from "$lib/utils/useHoverPreview";

  let shown = {};
  function isCW(post) {
    return post.title?.toLowerCase().startsWith("cw:") || post.tags?.some(t => t.toLowerCase().startsWith("cw:"));
  }
  function toggleCW(id) {
    shown[id] = !shown[id];
  }

  let posts = [
    {
      id: "media1",
      title: "cw: sensory deprivation shoot",
      tags: ["cw:sensory"]
    }
  ];
</script>

<h2>Media Gallery</h2>

<ul>
  {#each posts as post}
    <li class:blurred={isCW(post) && !shown[post.id]}>
      {#if isCW(post) && !shown[post.id]}
        <button on:click={() => toggleCW(post.id)} class="reveal">?? Content Warning – Click to Reveal</button>
      {/if}

      <span use:useHoverPreview={() => {
        const el = document.createElement('div');
        new ProfilePreviewCard({
          target: el,
          props: {
            username: 'kinkphotog',
            displayName: 'KinkPhotog',
            pronouns: 'he/him',
            flair: 'Photographer',
            mutualGroups: ['Visual Vibe']
          }
        });
        return el;
      }}>
        <strong>{post.title}</strong>
      </span><br />

      <CommentThread
        comments={[{ author: "SceneCurator", text: "This is beautiful work.", timestamp: "1h ago" }]}
        onComment={(t) => console.log("Media comment:", t)}
      />
      {#if isCW(post) && shown[post.id]}
        <p class="note">(CW revealed)</p>
      {/if}
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
