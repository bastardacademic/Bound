<script lang="ts">
  import { onMount } from 'svelte';
  import { session } from '$stores/session';
  import { goto } from '$app/navigation';
  import { get } from 'svelte/store';

  let question = '';
  let options = ['', '', ''];
  let duration = '24';
  let visibility = 'shared';
  let message = '';

  onMount(() => {
    const { token } = get(session);
    if (!token) goto('/login');
  });

  function addOption() {
    if (options.length < 5) options.push('');
  }

  function removeOption(i) {
    if (options.length > 2) options.splice(i, 1);
  }

  async function submitPoll() {
    const trimmed = options.map(opt => opt.trim()).filter(opt => opt.length > 0);
    if (question.trim().length < 1 || trimmed.length < 2) {
      message = 'Poll must have a question and at least 2 options.';
      return;
    }

    const res = await fetch('/api/poll', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question, options: trimmed, duration, visibility })
    });

    if (res.ok) {
      message = 'Poll created!';
      question = '';
      options = ['', '', ''];
      duration = '24';
      visibility = 'shared';
    } else {
      message = 'Failed to create poll.';
    }
  }
</script>

<h2>Create Poll</h2>
<form on:submit|preventDefault={submitPoll}>
  <label>Question</label>
  <input type="text" bind:value={question} maxlength="150" placeholder="Ask something..." />

  <label>Options</label>
  {#each options as option, i}
    <div>
      <input type="text" bind:value={options[i]} placeholder="Option" />
      {#if options.length > 2}
        <button type="button" on:click={() => removeOption(i)}>?</button>
      {/if}
    </div>
  {/each}
  {#if options.length < 5}
    <button type="button" on:click={addOption}>Add Option</button>
  {/if}

  <label>Duration (hours)</label>
  <select bind:value={duration}>
    <option value="1">1 hour</option>
    <option value="6">6 hours</option>
    <option value="12">12 hours</option>
    <option value="24">1 day</option>
    <option value="48">2 days</option>
    <option value="72">3 days</option>
    <option value="168">7 days</option>
  </select>

  <label>Visibility</label>
  <select bind:value={visibility}>
    <option value="shared">Shared (Friends & Constellation)</option>
    <option value="public">Public (Everyone)</option>
  </select>

  <button type="submit">Create Poll</button>
</form>

{#if message}<p style="color: green;">{message}</p>{/if}
