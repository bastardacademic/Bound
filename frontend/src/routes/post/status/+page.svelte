<script lang="ts">
  import { onMount } from 'svelte';
  import { session } from '$stores/session';
  import { goto } from '$app/navigation';
  import { get } from 'svelte/store';

  let content = '';
  let visibility = 'shared';
  let message = '';
  const maxLength = 500;

  onMount(() => {
    const { token } = get(session);
    if (!token) goto('/login');
  });

  async function postStatus() {
    if (content.trim().length === 0 || content.length > maxLength) {
      message = 'Post must be between 1 and 500 characters.';
      return;
    }

    const res = await fetch('/api/status', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content, visibility })
    });

    if (res.ok) {
      message = 'Status posted!';
      content = '';
      visibility = 'shared';
    } else {
      message = 'Failed to post status.';
    }
  }
</script>

<h2>New Status Update</h2>
<form on:submit|preventDefault={postStatus}>
  <textarea
    bind:value={content}
    maxlength={maxLength}
    placeholder="What's on your mind?"
    rows="4"
  ></textarea>
  <p>{content.length}/{maxLength}</p>

  <label>Visibility</label>
  <select bind:value={visibility}>
    <option value="shared">Shared (Friends & Constellation)</option>
    <option value="public">Public (Everyone)</option>
  </select>

  <button type="submit">Post</button>
</form>

{#if message}<p style="color: green;">{message}</p>{/if}
