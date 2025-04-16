<script>
  let tags = ["rope", "aftercare", "impact", "negotiation", "bondage", "edgeplay", "domination", "submission"];
  let followed = [];
  let muted = [];

  function toggleFollow(tag) {
    if (followed.includes(tag)) {
      followed = followed.filter(t => t !== tag);
    } else {
      followed = [...followed, tag];
      muted = muted.filter(t => t !== tag);
    }
  }

  function toggleMute(tag) {
    if (muted.includes(tag)) {
      muted = muted.filter(t => t !== tag);
    } else {
      muted = [...muted, tag];
      followed = followed.filter(t => t !== tag);
    }
  }
</script>

<h2>??? Tag Preferences</h2>
<p>Select tags you want to see more of (Follow), or less of (Mute):</p>

<ul class="tag-list">
  {#each tags as tag}
    <li>
      <span class="tag">#{tag}</span>
      <button on:click={() => toggleFollow(tag)} class:active={followed.includes(tag)}>Follow</button>
      <button on:click={() => toggleMute(tag)} class:muted={muted.includes(tag)}>Mute</button>
    </li>
  {/each}
</ul>

<h3>? Following:</h3>
<p>{followed.join(", ") || "None"}</p>

<h3>?? Muted:</h3>
<p>{muted.join(", ") || "None"}</p>

<style>
  ul.tag-list {
    list-style: none;
    padding: 0;
    margin-top: 1rem;
  }
  li {
    margin-bottom: 0.5rem;
  }
  .tag {
    font-weight: bold;
    margin-right: 1rem;
  }
  .active {
    background: green;
    color: white;
  }
  .muted {
    background: darkred;
    color: white;
  }
</style>
