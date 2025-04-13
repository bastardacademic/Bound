<script lang="ts">
  let unlocked = [
    { name: "🔥 10 Journals This Week", progress: 100, unlocked: true },
    { name: "💬 25 Group Posts", progress: 100, unlocked: true }
  ];

  let inProgress = [
    { name: "📊 80% Poll Participation", progress: 45, unlocked: false },
    { name: "📸 10 Media Shares", progress: 60, unlocked: false }
  ];
</script>

<h2>🏆 Group Achievements</h2>

<section>
  <h3>Unlocked</h3>
  <ul>
    {#each unlocked as a}
      <li class="unlocked">
        {a.name} <span class="status">✅</span>
      </li>
    {/each}
  </ul>
</section>

<section>
  <h3>In Progress</h3>
  <ul>
    {#each inProgress as a}
      <li>
        {a.name}
        <div class="bar-bg">
          <div class="bar-fill" style="width: {a.progress}%"></div>
        </div>
      </li>
    {/each}
  </ul>
</section>

<style>
  ul {
    list-style: none;
    padding: 0;
  }
  li {
    margin: 0.75rem 0;
  }
  .bar-bg {
    height: 8px;
    background: #444;
    border-radius: 5px;
    margin-top: 4px;
  }
  .bar-fill {
    height: 8px;
    background: var(--accent);
    border-radius: 5px;
  }
  .unlocked {
    color: var(--accent);
    font-weight: bold;
  }
  .status {
    margin-left: 0.5rem;
  }
</style>