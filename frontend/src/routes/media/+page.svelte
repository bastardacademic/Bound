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

  const getAuthorPreview = () => {
    const el = document.createElement("div");
    new ProfilePreviewCard({
      target: el,
      props: {
        username: "scenecurator",
        displayName: "SceneCurator",
        pronouns: "they/them",
        flair: "Observer",
        mutualGroups: ["KinkPhoto Meetup"]
      }
    });
    return el;
  };
</script>

<h2>Media Gallery</h2>

<ul>
  {#each posts as post}
    <li class:blurred={isCW(post) && !shown[post.id]}>
      {#if isCW(post) && !shown[post.id]}
        <button on:click={() => toggleCW(post.id)} class="reveal">?? Content Warning – Click to Reveal</button>
      {/if}

      <strong>{post.title}</strong><br />

      <div class="comment-thread">
        <h4>?? Comments</h4>
        <ul>
          <li>
            <span use:useHoverPreview={getAuthorPreview}><strong>SceneCurator</strong></span> <span class="ts">1h ago</span><br />
            <span>This is beautiful work.</span>
          </li>
        </ul>
      </div>

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
  .ts { color: #888; font-size: 0.75rem; margin-left: 0.25rem; }
</style>
