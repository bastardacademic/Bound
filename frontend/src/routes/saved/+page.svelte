<script lang="ts">
  type SavedPost = {
    id: string;
    type: "journal" | "media";
    title: string;
    preview: string;
    savedAt: string;
  };

  let filter: "all" | "journal" | "media" = "all";

  let saved: SavedPost[] = [
    {
      id: "j1",
      type: "journal",
      title: "Morning Reflections",
      preview: "Today I woke up with a clear mind and...",
      savedAt: "2025-04-10T09:00:00Z"
    },
    {
      id: "m2",
      type: "media",
      title: "Rope Session Gallery",
      preview: "High-res photo set, 5 images.",
      savedAt: "2025-04-11T14:45:00Z"
    }
  ];

  function filtered() {
    if (filter === "all") return saved;
    return saved.filter(p => p.type === filter);
  }

  function unsave(id: string) {
    if (confirm("Remove this from saved items?")) {
      saved = saved.filter(p => p.id !== id);
    }
  }
</script>

<h2>?? Saved Posts</h2>

<label>Filter:
  <select bind:value={filter}>
    <option value="all">All</option>
    <option value="journal">Journal</option>
    <option value="media">Media</option>
  </select>
</label>

<ul>
  {#each filtered() as post}
    <li>
      <strong>{post.title}</strong> ({post.type})<br />
      <em>{post.preview}</em><br />
      <small>Saved at {new Date(post.savedAt).toLocaleString()}</small><br />
      <button on:click={() => unsave(post.id)}>Remove</button>
    </li>
  {/each}
</ul>

<style>
  ul {
    list-style: none;
    padding: 0;
    margin-top: 1rem;
  }
  li {
    padding: 0.75rem 0;
    border-bottom: 1px solid #333;
  }
  button {
    margin-top: 0.25rem;
  }
</style>
