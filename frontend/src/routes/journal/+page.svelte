<script lang="ts">
  import CommentThread from "$lib/components/CommentThread.svelte";

  let shown = {};
  function isCW(entry) {
    return entry.title?.toLowerCase().startsWith("cw:") || entry.tags?.some(t => t.toLowerCase().startsWith("cw:"));
  }
  function toggleCW(id) {
    shown[id] = !shown[id];
  }

  let entries = [
    {
      id: "post1",
      title: "cw: bloodplay reflections",
      content: "This is a sensitive journal entry",
      tags: ["cw:bloodplay"]
    }
  ];
</script>

<h2>My Journal</h2>

<ul>
  {#each entries as entry}
    <li class:blurred={isCW(entry) && !shown[entry.id]}>
      {#if isCW(entry) && !shown[entry.id]}
        <button on:click={() => toggleCW(entry.id)} class="reveal">⚠️ Content Warning – Click to Reveal</button>
      {/if}
      <strong>{entry.title}</strong><br />
      <em>{entry.content}</em>
      <CommentThread
        comments={[
          { author: "VelvetTop", text: "Thank you for sharing this.", timestamp: "3h ago" }
        ]}
        onComment={(t) => console.log("New comment:", t)}
      />
      {#if isCW(entry) && shown[entry.id]}
        <p class="note">(CW revealed)</p>
      {/if}
    </li>
  {/each}
</ul>

<style>
  .blurred {
    filter: blur(4px);
    position: relative;
  }
  .reveal {
    position: absolute;
    top: 0;
    left: 0;
    font-size: 0.9rem;
    padding: 0.25rem 0.5rem;
    background: #222;
    color: yellow;
    z-index: 5;
    border: 1px solid #888;
    border-radius: 4px;
  }
  .note {
    font-size: 0.75rem;
    color: #aaa;
  }
</style>