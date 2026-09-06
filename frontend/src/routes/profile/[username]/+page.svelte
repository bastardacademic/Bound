<script lang="ts">
  import { page } from "$app/stores";
  import { session } from "$stores/session";
  import { get } from "svelte/store";

  let username = "";
  let profile = null;
  let notFound = false;

  $: username = $page.params.username;

  async function fetchProfile() {
    const { token } = get(session);
    const res = await fetch(`/api/profile/${username}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (res.ok) {
      profile = await res.json();
    } else if (res.status === 404) {
      notFound = true;
    }
  }

  fetchProfile();
</script>

{#if profile}
  <h2>@{profile.username}</h2>

  {#if profile.bio}<p class="bio">{profile.bio}</p>{/if}

  {#if profile.about_me}
    <section>
      <h3>About</h3>
      <p>{profile.about_me}</p>
    </section>
  {/if}

  {#if profile.kinks_and_fetishes}
    <section>
      <h3>Kinks &amp; Fetishes</h3>
      <p>{profile.kinks_and_fetishes}</p>
    </section>
  {/if}

  {#if profile.relationship_preferences}
    <section>
      <h3>Relationship Preferences</h3>
      <p>{profile.relationship_preferences}</p>
    </section>
  {/if}
{:else if notFound}
  <p>User not found.</p>
{:else}
  <p>Loading profile…</p>
{/if}

<style>
  .bio {
    color: #aaa;
    font-style: italic;
  }
</style>
