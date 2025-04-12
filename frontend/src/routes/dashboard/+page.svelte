<script lang="ts">
  import { onMount } from "svelte";

  let stats = {
    journals: [],
    media: 0,
    polls: 0,
    streak: 0,
    tags: []
  };

  onMount(async () => {
    const res = await fetch("/api/dashboard");
    if (res.ok) {
      stats = await res.json();
    }
  });
</script>

<h2>?? Your Dashboard</h2>

{#if stats.journals.length > 0}
  <section>
    <h3>Journals This Week</h3>
    <ul class="bar-graph">
      {#each stats.journals as count, i}
        <li style="height: {count * 10}px" title="Day {i + 1}: {count} entries"></li>
      {/each}
    </ul>
  </section>
{/if}

<section>
  <h3>Content Summary</h3>
  <p>Media Uploaded: {stats.media}</p>
  <p>Polls Created: {stats.polls}</p>
</section>

<section>
  <h3>Weekly Activity Streak</h3>
  <p>?? {stats.streak} days in a row</p>
</section>

{#if stats.tags.length > 0}
  <section>
    <h3>Top Tags</h3>
    <ul>
      {#each stats.tags as tag}
        <li>#{tag}</li>
      {/each}
    </ul>
  </section>
{/if}

<style>
  section {
    margin-bottom: 2rem;
  }
  .bar-graph {
    display: flex;
    gap: 0.5rem;
    height: 100px;
    align-items: flex-end;
  }
  .bar-graph li {
    width: 20px;
    background: var(--accent, #c84aff);
    border-radius: 3px;
    cursor: help;
  }
</style>
