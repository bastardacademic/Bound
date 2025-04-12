<script lang="ts">
  import { session } from "$stores/session";
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import { get } from "svelte/store";
  import { marked } from "marked";
  import VoiceRecorder, { getAudioBlob } from "$lib/components/VoiceRecorder.svelte";

  let entries = [];
  let content = "";
  let title = "";
  let message = "";

  onMount(() => {
    const { token } = get(session);
    if (!token) {
      goto("/login");
    } else {
      fetchEntries();
    }
  });

  async function fetchEntries() {
    const res = await fetch("/api/journal");
    const data = await res.json();
    entries = data.entries || [];
  }

  async function submitEntry() {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);

    const audio = getAudioBlob();
    if (audio) {
      formData.append("audio", audio, "entry.webm");
    }

    const res = await fetch("/api/journal", {
      method: "POST",
      body: formData
    });

    const data = await res.json();
    message = data.message;
    content = "";
    title = "";
    fetchEntries();
  }
</script>

<h2>My Journal</h2>
<form on:submit|preventDefault={submitEntry}>
  <input type="text" placeholder="Title (optional)" bind:value={title} />
  <textarea placeholder="Write something..." bind:value={content}></textarea>

  <VoiceRecorder />

  <button type="submit">Save</button>
</form>
<p>{message}</p>

<h3>Live Preview</h3>
<div class="preview">
  {@html marked(content)}
</div>

<hr />

<ul>
  {#each entries as entry}
    <li>
      <strong>{entry.title}</strong><br />
      <em>{entry.content}</em>
      {#if entry.audioUrl}
        <br /><audio controls src={entry.audioUrl}></audio>
      {/if}
    </li>
  {/each}
</ul>
