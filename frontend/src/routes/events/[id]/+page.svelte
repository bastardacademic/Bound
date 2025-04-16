<script lang="ts">
  import { page } from "$app/stores";
  import { session } from "$stores/session";
  import { get } from "svelte/store";

  let eventId = "";
  let event = null;
  let message = "";

  $: eventId = $page.params.id;

  async function fetchEvent() {
    const { token } = get(session);
    const res = await fetch(`/api/events/${eventId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (res.ok) {
      event = await res.json();
    }
  }

  async function rsvp(status: "interested" | "going") {
    const { token } = get(session);
    const res = await fetch(`/api/events/${eventId}/rsvp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ status })
    });
    if (res.ok) {
      message = "RSVP updated.";
    } else {
      message = "Failed to RSVP.";
    }
  }

  fetchEvent();
</script>

{#if event}
  <h2>{event.title}</h2>
  <p><strong>{event.type}</strong> — {event.date} at {event.time}</p>
  <p><strong>Location:</strong> {event.location}</p>
  <p>{event.description}</p>

  <button on:click={() => rsvp("interested")}>Maybe</button>
  <button on:click={() => rsvp("going")}>See You There!</button>
  {#if message}<p style="color: green;">{message}</p>{/if}
{:else}
  <p>Loading event...</p>
{/if}
