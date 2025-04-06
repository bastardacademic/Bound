<script lang="ts">
  import { onMount } from 'svelte';
  import { session } from '$stores/session';
  import { goto } from '$app/navigation';
  import { get } from 'svelte/store';

  let file: File | null = null;
  let tags = '';
  let taggedUsers = '';
  let visibility = 'shared';
  let consentConfirmed = false;
  let message = '';
  let uploading = false;

  onMount(() => {
    const { token } = get(session);
    if (!token) goto('/login');
  });

  async function uploadMedia() {
    if (!file) {
      message = 'Please select an image.';
      return;
    }
    if (!consentConfirmed) {
      message = 'You must confirm consent and age of all tagged parties.';
      return;
    }

    uploading = true;
    const formData = new FormData();
    formData.append('file', file);
    formData.append('tags', tags);
    formData.append('taggedUsers', taggedUsers);
    formData.append('visibility', visibility);

    const res = await fetch('/api/media', {
      method: 'POST',
      body: formData
    });

    if (res.ok) {
      message = 'Media uploaded.';
      file = null;
      tags = '';
      taggedUsers = '';
      visibility = 'shared';
      consentConfirmed = false;
    } else {
      message = 'Upload failed.';
    }
    uploading = false;
  }
</script>

<h2>Upload Media</h2>
<form on:submit|preventDefault={uploadMedia}>
  <label>Select Image</label>
  <input type="file" accept="image/*" on:change={(e) => file = e.target.files[0]} />

  <label>Tags (comma separated)</label>
  <input type="text" bind:value={tags} placeholder="e.g. ropes, ceremony" />

  <label>Tag Users (by username, comma separated)</label>
  <input type="text" bind:value={taggedUsers} placeholder="e.g. user1, user2" />

  <label>Visibility</label>
  <select bind:value={visibility}>
    <option value="shared">Shared (Friends & Constellation)</option>
    <option value="public">Public (Everyone)</option>
  </select>

  <label><input type="checkbox" bind:checked={consentConfirmed} />
    I confirm that all tagged individuals are over 18 and have consented to be in this media.
  </label>

  <button type="submit" disabled={uploading}>Upload</button>
</form>

{#if message}<p style="color: green;">{message}</p>{/if}
