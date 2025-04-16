<script>
  let followed = ["rope", "aftercare", "negotiation"];
  let muted = ["edgeplay", "bloodplay"];
  let inferredHot = ["aftercare", "domination"];
  let inferredCold = ["bloodplay"];

  function reset() {
    if (confirm("Clear all inferred suggestions and reset preferences?")) {
      followed = [];
      muted = [];
    }
  }
</script>

<h2>?? Feed Preferences</h2>

<section>
  <h3>? Followed Tags</h3>
  <p>{followed.length > 0 ? followed.join(", ") : "None"}</p>

  <h3>?? Muted Tags</h3>
  <p>{muted.length > 0 ? muted.join(", ") : "None"}</p>
</section>

<section>
  <h3>?? Suggested Adjustments</h3>
  <ul>
    {#each inferredHot as tag}
      <li><strong>+ {tag}</strong> — You've engaged with this frequently.</li>
    {/each}
    {#each inferredCold as tag}
      <li><em>– {tag}</em> — You often skip this.</li>
    {/each}
  </ul>
</section>

<button on:click={reset}>?? Reset Preferences</button>

<style>
  section {
    margin-bottom: 2rem;
  }
  ul {
    list-style: disc;
    margin-left: 1.5rem;
  }
  button {
    background: #333;
    color: white;
    padding: 0.5rem 1rem;
    border: 1px solid #555;
    border-radius: 5px;
  }
</style>
