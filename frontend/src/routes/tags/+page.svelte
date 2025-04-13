<script lang="ts">
  type TagStatus = {
    name: string;
    followed: boolean;
    muted: boolean;
  };

  let tags: TagStatus[] = [
    { name: "rope", followed: true, muted: false },
    { name: "domination", followed: false, muted: false },
    { name: "impact", followed: false, muted: true },
    { name: "aftercare", followed: true, muted: false },
    { name: "bloodplay", followed: false, muted: false }
  ];

  function toggleFollow(tag: TagStatus) {
    if (tag.muted) tag.muted = false;
    tag.followed = !tag.followed;
  }

  function toggleMute(tag: TagStatus) {
    if (tag.followed) tag.followed = false;
    tag.muted = !tag.muted;
  }

  $: followedTags = tags.filter(t => t.followed);
  $: mutedTags = tags.filter(t => t.muted);
</script>

<h2>??? Tag Preferences</h2>
<p class="note">Follow tags to improve feed suggestions. Muted tags will be hidden from feed views.</p>

<ul>
  {#each tags as tag}
    <li>
      <strong>#{tag.name}</strong><br />
      <button on:click={() => toggleFollow(tag)} class:active={tag.followed}>Follow</button>
      <button on:click={() => toggleMute(tag)} class:muted={tag.muted}>Mute</button>
    </li>
  {/each}
</ul>

<h3>? Followed Tags:</h3>
<p>{#if followedTags.length === 0}<em>None</em>{:else}{followedTags.map(t => "#" + t.name).join(", ")}</p>

<h3>?? Muted Tags:</h3>
<p>{#if mutedTags.length === 0}<em>None</em>{:else}{mutedTags.map(t => "#" + t.name).join(", ")}</p>

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
    padding: 0.75rem 0;
    border-bottom: 1px solid #333;
  }
  button {
    margin-right: 0.5rem;
    margin-top: 0.25rem;
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
