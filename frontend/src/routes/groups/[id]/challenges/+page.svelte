<script lang="ts">
  let challenges = [
    {
      id: "abc123",
      title: "Write 3 Journals This Week",
      description: "Encourage reflection and consistency!",
      participants: 7,
      progress: 45
    }
  ];

  function createChallenge() {
    alert("Challenge creation modal or form will go here.");
  }
</script>

<h2>?? Group Challenges</h2>

<button on:click={createChallenge}>? Create Challenge</button>

{#if challenges.length > 0}
  <ul>
    {#each challenges as ch}
      <li>
        <h3>{ch.title}</h3>
        <p>{ch.description}</p>
        <p>?? {ch.participants} participants</p>
        <div class="bar" style="width: {ch.progress}%;"></div>
      </li>
    {/each}
  </ul>
{:else}
  <p>No challenges yet. Be the first to create one!</p>
{/if}

<style>
  ul {
    list-style: none;
    padding: 0;
  }
  li {
    margin-bottom: 1.5rem;
    border-bottom: 1px solid #333;
    padding-bottom: 1rem;
  }
  .bar {
    height: 10px;
    background: var(--accent);
    border-radius: 5px;
    margin-top: 0.5rem;
  }
</style>
