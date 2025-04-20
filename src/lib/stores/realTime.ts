import { writable } from 'svelte/store';
export type PostEvent = { postId: number; type: string };
const events = writable<PostEvent>();

if (typeof window !== 'undefined' && 'EventSource' in window) {
  const es = new EventSource('/api/socket/events');
  es.onmessage = (e) => {
    try { events.set(JSON.parse(e.data)); }
    catch {};
  };
  es.onerror = () => es.close();
}

export default events;
