<script lang="ts">
  import { page } from "$app/stores";
  import { pinnedItems } from "$lib/stores/pins";
  import { session } from "$stores/session";
  import { get } from "svelte/store";

  let username = "";
  let profile = null;
  let pinnedJournal = null;
  let pinnedMedia = null;

  $: username = $page.params.username;

  async function fetchProfile() {
    const { token } = get(session);
    const res = await fetch(`/api/profile/${username}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (res.ok) {
      profile = await res.json();
      pinnedJournal = profile.pinned?.journal || null;
      pinnedMedia = profile.pinned?.media || null;
    }
  }

  fetchProfile();
</script>

{#if profile}
  <h2>{profile.displayName}</h2>
  <p>@{profile.username} • {profile.pronouns} • <strong>{profile.flair}</strong></p>

  {#if pinnedJournal}
    <section>
      <h3>?? Pinned Journal</h3>
      <div class="pinned-card">
        <strong>{pinnedJournal.title}</strong><br />
        <p>{pinnedJournal.excerpt}</p>
      </div>
    </section>
  {/if}

  {#if pinnedMedia}
    <section>
      <h3>?? Pinned Media</h3>
      <div class="pinned-card">
        <strong>{pinnedMedia.title}</strong><br />
        <p>[Media Preview]</p>
      </div>
    </section>
  {/if}
{:else}
  <p>Loading profile…</p>
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
