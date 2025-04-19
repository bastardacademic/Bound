<script lang="ts">
  import { page } from "$app/stores";
  import { onMount } from "svelte";
  import axios from "axios";

  export let username: string;
  let profile: any = null;
  let loading = true;
  let error = "";

  onMount(async () => {
    try {
      const res = await axios.get(`/api/profile/${username}`);
      profile = res.data.profile;
    } catch (err) {
      error = "Failed to load profile.";
    } finally {
      loading = false;
    }
  });
</script>

{#if loading}
  <div class="p-4">Loading profile…</div>
{:else if error}
  <div class="p-4 text-red-500">{error}</div>
{:else}
  <div class="p-4 space-y-4">
    <div class="flex items-center gap-4">
      <img src={profile.avatarUrl} alt="avatar" class="w-12 h-12 rounded-full" />
      <div>
        <h2 class="text-lg font-semibold">@{profile.username}</h2>
        {#if profile.flair}
          <p class="text-sm text-muted-foreground">[{profile.flair}]</p>
        {/if}
      </div>
    </div>

    {#if profile.badges?.length}
      <div class="flex flex-wrap gap-2 text-sm">
        {#each profile.badges as badge}
          <span class="bg-accent px-2 py-1 rounded-full">🏅 {badge}</span>
        {/each}
      </div>
    {/if}

    {#if profile.bio}
      <p class="text-sm text-muted-foreground">{profile.bio}</p>
    {/if}

    {#if profile.isSelf}
      <a href="/settings" class="inline-block text-primary hover:underline">Edit your profile</a>
    {/if}
  </div>
{/if}
