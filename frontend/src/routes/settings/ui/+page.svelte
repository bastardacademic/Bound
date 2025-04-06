<script>
  import { onMount } from 'svelte';
  import { theme } from '$stores/theme';

  let color = localStorage.getItem('accentColor') || 'teal';
  let fontScale = localStorage.getItem('fontScale') || '100';
  let reduceMotion = localStorage.getItem('reduceMotion') === 'true';

  function savePreferences() {
    localStorage.setItem('accentColor', color);
    localStorage.setItem('fontScale', fontScale);
    localStorage.setItem('reduceMotion', reduceMotion);
    document.documentElement.style.setProperty('--accent-color', color);
    document.documentElement.style.setProperty('--font-scale', fontScale + '%');
    document.documentElement.setAttribute('data-motion', reduceMotion ? 'reduced' : 'default');
  }

  onMount(() => {
    savePreferences();
  });
</script>

<h2>UI Preferences</h2>

<form on:submit|preventDefault={savePreferences}>
  <label>Accent Color</label>
  <select bind:value={color}>
    <option value="teal">Teal</option>
    <option value="crimson">Crimson</option>
    <option value="gold">Gold</option>
    <option value="emerald">Emerald</option>
  </select>

  <label>Font Size</label>
  <input type="range" min="80" max="150" bind:value={fontScale} />
  <span>{fontScale}%</span>

  <label><input type="checkbox" bind:checked={reduceMotion} /> Reduce Motion</label>

  <button type="submit">Save Preferences</button>
</form>
