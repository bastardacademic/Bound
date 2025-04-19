<script lang="ts">
  import { onMount } from "svelte";
  import axios from "axios";

  let loading = true;
  let saving = false;
  let error = "";
  let success = false;

  let avatarUrl = "";
  let flair = "";
  let bio = "";
  let isCommercial = false;

  onMount(async () => {
    try {
      const res = await axios.get("/api/profile/me");
      const user = res.data.profile;
      avatarUrl = user.avatarUrl;
      flair = user.flair || "";
      bio = user.bio || "";
      isCommercial = user.accountType === "commercial";
    } catch (err) {
      error = "Failed to load settings.";
    } finally {
      loading = false;
    }
  });

  async function saveSettings() {
    saving = true;
    error = "";
    success = false;
    try {
      await axios.patch("/api/settings", {
        avatarUrl,
        flair,
        bio,
      });
      success = true;
    } catch (err) {
      error = "Failed to save settings.";
    } finally {
      saving = false;
    }
  }
</script>

<div class="p-4 max-w-2xl mx-auto space-y-4">
  <h2 class="text-xl font-semibold">Edit Profile</h2>

  {#if loading}
    <div>Loading…</div>
  {:else}
    <form on:submit|preventDefault={saveSettings} class="space-y-4">
      <div>
        <label class="block text-base font-medium">Avatar URL</label>
        <input
          type="text"
          bind:value={avatarUrl}
          class="w-full mt-1 p-3 rounded-xl border border-muted bg-background"
        />
      </div>

      <div>
        <label class="block text-base font-medium">Flair</label>
        {#if isCommercial}
          <select bind:value={flair} class="w-full mt-1 p-3 rounded-xl border border-muted">
            <option disabled value="">-- Select --</option>
            <option value="Merchant">Merchant</option>
            <option value="Model">Model</option>
          </select>
        {:else}
          <input
            type="text"
            bind:value={flair}
            placeholder="e.g. brat, voyeur, domme"
            class="w-full mt-1 p-3 rounded-xl border border-muted bg-background"
          />
        {/if}
      </div>

      <div>
        <label class="block text-base font-medium">Bio</label>
        <textarea
          bind:value={bio}
          rows="4"
          class="w-full mt-1 p-3 rounded-xl border border-muted bg-background"
        ></textarea>
      </div>

      {#if error}
        <div class="text-base text-destructive">{error}</div>
      {/if}

      {#if success}
        <div class="text-base text-success-foreground">Settings saved!</div>
      {/if}

      <button
        type="submit"
        class="bg-primary text-primary-foreground rounded-xl px-4 py-2"
        disabled={saving}
      >
        {saving ? 'Saving…' : 'Save Changes'}
      </button>
    </form>
  {/if}
</div>

