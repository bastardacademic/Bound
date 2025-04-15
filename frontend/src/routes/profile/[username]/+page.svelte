<script lang="ts">
  import { pinnedItems } from "$lib/stores/pins";
  import { get } from "svelte/store";

  let profile = {
    username: "kinkenthusiast",
    displayName: "KinkEnthusiast",
    pronouns: "they/them",
    flair: "Explorer"
  };

  const pins = get(pinnedItems);
  const pinnedJournal = pins.find(p => p.type === "journal");
  const pinnedMedia = pins.find(p => p.type === "media");
</script>

<h2>{profile.displayName}</h2>
<p>@{profile.username} • {profile.pronouns} • <strong>{profile.flair}</strong></p>

{#if pinnedJournal}
  <section>
    <h3>?? Pinned Journal</h3>
    <div class="pinned-card">
      <strong>Post #{pinnedJournal.id}</strong><br />
      <p>[Journal content will load here]</p>
    </div>
  </section>
{/if}

{#if pinnedMedia}
  <section>
    <h3>?? Pinned Media</h3>
    <div class="pinned-card">
      <strong>Media #{pinnedMedia.id}</strong><br />
      <p>[Media preview will load here]</p>
    </div>
  </section>
{/if}

<style>
  .pinned-card {
    border: 1px solid #444;
    padding: 1rem;
    border-radius: 6px;
    margin: 1rem 0;
    background: #111;
  }
</style>
