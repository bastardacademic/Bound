<script lang="ts">
  export let onCreate;

  let title = "";
  let description = "";
  let type = "journal";
  let deadline = "";

  function submit() {
    if (!title || !description) return alert("All fields required");
    onCreate({ title, description, type, deadline });
    title = "";
    description = "";
    deadline = "";
  }
</script>

<div class="form">
  <h4>Create a Group Challenge</h4>
  <label>Title:</label>
  <input bind:value={title} required />

  <label>Description:</label>
  <textarea bind:value={description}></textarea>

  <label>Type:</label>
  <select bind:value={type}>
    <option value="journal">Journal</option>
    <option value="habit">Habit</option>
    <option value="media">Media</option>
    <option value="poll">Poll</option>
  </select>

  <label>Deadline (optional):</label>
  <input type="date" bind:value={deadline} />

  <button on:click={submit}>Create</button>
</div>

<style>
  .form {
    background: #222;
    padding: 1rem;
    border-radius: 8px;
    margin: 1rem 0;
  }
  input, textarea, select {
    width: 100%;
    margin-bottom: 0.75rem;
    padding: 0.5rem;
    background: #111;
    border: 1px solid #444;
    color: white;
  }
  button {
    margin-top: 0.5rem;
  }
</style>
