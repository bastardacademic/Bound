<script>
  import { uiSettings } from "$lib/stores/ui";
</script>

<h2>? All Set</h2>
<p>You're ready to start exploring Bound. Before you go, pick your visual preferences:</p>

<div class="options">
  <label>
    Theme:
    <select bind:value={$uiSettings.theme}>
      <option value="dark">Dark</option>
      <option value="light">Light</option>
    </select>
  </label>

  <label>
    Contrast:
    <select bind:value={$uiSettings.contrast}>
      <option value="normal">Normal</option>
      <option value="high">High</option>
    </select>
  </label>

  <label>
    Text Size:
    <select bind:value={$uiSettings.textSize}>
      <option value="normal">Normal</option>
      <option value="large">Large</option>
    </select>
  </label>

  <label>
    Haptics:
    <input type="checkbox" bind:checked={$uiSettings.haptics} />
  </label>
</div>

<style>
  .options {
    margin-top: 2rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  select, input[type="checkbox"] {
    margin-left: 1rem;
  }
</style>
