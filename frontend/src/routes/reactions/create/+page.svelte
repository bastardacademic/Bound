<script lang="ts">
  let title = "";
  let visibility = "private";
  let emojis: File[] = [];

  function handleFiles(event) {
    emojis = Array.from(event.target.files);
  }

  async function submitPack() {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("visibility", visibility);
    emojis.forEach((file, i) => {
      formData.append("emojis", file, file.name);
    });

    const res = await fetch("/api/reactions/packs", {
      method: "POST",
      body: formData
    });

    if (res.ok) {
      alert("Pack created!");
      title = "";
      emojis = [];
    }
  }
</script>

<h2>?? Create a Reaction Pack</h2>

<form on:submit|preventDefault={submitPack}>
  <label>Pack Name:</label><br />
  <input type="text" bind:value={title} required /><br /><br />

  <label>Visibility:</label><br />
  <select bind:value={visibility}>
    <option value="private">Private</option>
    <option value="friends">Friends</option>
    <option value="group">Groups</option>
    <option value="public">Public</option>
  </select><br /><br />

  <label>Upload up to 10 emojis:</label><br />
  <input type="file" accept="image/*" on:change={handleFiles} multiple /><br />

  {#if emojis.length > 0}
    <h4>Preview:</h4>
    <div class="emoji-preview">
      {#each emojis as e}
        <img src={URL.createObjectURL(e)} alt={e.name} title={e.name} />
      {/each}
    </div>
  {/if}

  <button type="submit">Upload Pack</button>
</form>

<style>
  input, select {
    margin: 0.5rem 0;
  }
  .emoji-preview {
    display: flex;
    gap: 0.5rem;
    margin: 1rem 0;
  }
  .emoji-preview img {
    width: 40px;
    height: 40px;
  }
</style>
