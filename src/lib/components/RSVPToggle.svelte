<script lang='ts'>
  export let eventId: number;
  import { onMount } from 'svelte';
  let rsvped = false;
  onMount(async () => {
    // Optionally fetch initial state
  });
  async function toggle() {
    const res = await fetch(/api/events//rsvp, { method: 'POST' });
    const data = await res.json(); rsvped = data.rsvped;
  }
</script>
<button on:click={toggle} class='px-4 py-2 rounded bg-blue-600 text-white'>
  {rsvped ? 'Cancel RSVP' : 'RSVP'}
</button>
