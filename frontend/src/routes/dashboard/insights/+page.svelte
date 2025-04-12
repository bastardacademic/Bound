<script lang="ts">
  import PremiumOnly from "$lib/components/PremiumOnly.svelte";

  let insights = {
    hourly: Array(24).fill(0).map((_, i) => Math.floor(Math.random() * 6)),
    weekly: [3, 6, 7, 4, 2, 1, 5],
    topTags: ["aftercare", "growth", "control", "obedience", "self"]
  };
</script>

<PremiumOnly condition={true}>
  <h2>?? Advanced Insights (Premium)</h2>

  <section>
    <h3>Journaling by Hour</h3>
    <ul class="hourly-bar">
      {#each insights.hourly as count, hour}
        <li style="height: {count * 10}px" title="{hour}:00">{hour}</li>
      {/each}
    </ul>
  </section>

  <section>
    <h3>Activity by Day</h3>
    <ul class="week-bar">
      {#each insights.weekly as count, i}
        <li style="height: {count * 12}px" title="Day {i + 1}">{["S","M","T","W","T","F","S"][i]}</li>
      {/each}
    </ul>
  </section>

  <section>
    <h3>Top Tags</h3>
    <div class="tag-cloud">
      {#each insights.topTags as tag}
        <span class="tag">#{tag}</span>
      {/each}
    </div>
  </section>
</PremiumOnly>

<style>
  .hourly-bar, .week-bar {
    display: flex;
    gap: 4px;
    align-items: flex-end;
    height: 100px;
  }
  .hourly-bar li, .week-bar li {
    width: 20px;
    background: var(--accent);
    color: white;
    font-size: 10px;
    text-align: center;
    border-radius: 3px;
  }
  .tag-cloud {
    margin-top: 1rem;
  }
  .tag-cloud .tag {
    display: inline-block;
    margin: 0.25rem;
    background: #444;
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    font-size: 0.9rem;
  }
</style>
