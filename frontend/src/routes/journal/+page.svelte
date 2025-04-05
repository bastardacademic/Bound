<script>
  let entries = [];
  let content = '';
  let title = '';
  let message = '';
  async function fetchEntries() {
    const res = await fetch('/api/journal');
    const data = await res.json();
    entries = data.entries || [];
  }
  async function submitEntry() {
    const res = await fetch('/api/journal', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, content })
    });
    const data = await res.json();
    message = data.message;
    content = '';
    title = '';
    fetchEntries();
  }
  fetchEntries();
</script>
<h2>My Journal</h2>
<form on:submit|preventDefault={submitEntry}>
  <input type="text" placeholder="Title (optional)" bind:value={title} />
  <textarea placeholder="Write something..." bind:value={content}></textarea>
  <button type="submit">Save</button>
</form>
<p>{message}</p>
<hr />
<ul>
  {#each entries as entry}
    <li>
      <strong>{entry.title}</strong><br />
      <em>{entry.content}</em>
    </li>
  {/each}
</ul>
