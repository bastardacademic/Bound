<script lang="ts">
  import { writable } from "svelte/store";

  let font = "sans"; // "sans" | "serif"
  let contrast = false;
  let textSize = "normal"; // "small" | "normal" | "large"

  function savePrefs() {
    alert("Preferences saved (not yet wired to global styles)");
  }
</script>

<h2>?? Accessibility Settings</h2>

<section>
  <label>Font Style:</label><br />
  <label><input type="radio" bind:group={font} value="sans" /> Sans-serif (default)</label><br />
  <label><input type="radio" bind:group={font} value="serif" /> Serif</label><br />
</section>

<section>
  <label><input type="checkbox" bind:checked={contrast} /> Enable High-Contrast Mode</label>
</section>

<section>
  <label>Text Size:</label><br />
  <select bind:value={textSize}>
    <option value="small">Small</option>
    <option value="normal">Normal</option>
    <option value="large">Large</option>
  </select>
</section>

<button on:click={savePrefs}>Save Preferences</button>

<style>
  section {
    margin: 1rem 0;
  }
  button {
    margin-top: 1rem;
    padding: 0.4rem 1rem;
  }
</style>
