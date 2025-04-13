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
    <li class:blurred={isCW(entry) && !shown[entry.id]}>
  {#if isCW(entry) && !shown[entry.id]}<button on:click={() => toggleCW(entry.id)} class='reveal'>⚠️ Content Warning – Click to Reveal</button>{/if}
      <strong>{entry.title}</strong><br />
      <em>{entry.content}</em>
      {#if entry.audioUrl}
        <br /><audio controls src={entry.audioUrl}></audio>
      {/if}
    {#if isCW(entry) && shown[entry.id]}<p class='note'>(CW revealed)</p>{/if}</li>
  {/each}
</ul>

<style>
  .blurred { filter: blur(4px); position: relative; }
  .reveal { position: absolute; top: 0; left: 0; font-size: 0.9rem; padding: 0.25rem 0.5rem; background: #222; color: yellow; z-index: 5; border: 1px solid #888; border-radius: 4px; }
  .note { font-size: 0.75rem; color: #aaa; }
</style>
