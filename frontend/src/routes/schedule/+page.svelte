<script lang="ts">
  type ScheduledPost = {
    id: string;
    type: "journal" | "media";
    title: string;
    scheduledFor: string;
  };

  let posts: ScheduledPost[] = [
    {
      id: "sj1",
      type: "journal",
      title: "Midweek Reflections",
      scheduledFor: "2025-04-17T10:00:00Z"
    },
    {
      id: "sm2",
      type: "media",
      title: "Evening Rope Gallery",
      scheduledFor: "2025-04-18T19:30:00Z"
    }
  ];

  function cancel(id: string) {
    if (confirm("Cancel this scheduled post?")) {
      posts = posts.filter(p => p.id !== id);
    }
  }
</script>

<h2>??? Scheduled Posts</h2>
<p class="note">Premium Feature: Manage scheduled journal and media posts.</p>

<ul>
  {#each posts as p}
    <li>
      <strong>{p.title}</strong> ({p.type})<br />
      <small>Scheduled for: {new Date(p.scheduledFor).toLocaleString()}</small><br />
      <button on:click={() => cancel(p.id)}>Cancel</button>
    </li>
  {/each}
</ul>

<style>
  .note {
    color: #aaa;
    font-size: 0.9rem;
    margin-bottom: 1rem;
  }
  ul {
    list-style: none;
    padding: 0;
  }
  li {
    border-bottom: 1px solid #333;
    padding: 0.75rem 0;
  }
</style>
