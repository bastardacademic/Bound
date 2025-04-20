<script lang='ts'>
  import { writable } from 'svelte/store';
  const mode = writable(localStorage.getItem('theme') || 'light');
  mode.subscribe(value => {
    document.documentElement.setAttribute('data-theme', value);
    localStorage.setItem('theme', value);
  });
  function toggle() {
    mode.update(m => m === 'light' ? 'dark' : 'light');
  }
</script>
<button on:click={toggle} aria-label='Toggle theme' class='p-2 rounded' role='switch' aria-checked={ === 'dark'}>
  {#if  === 'dark'}🌙 Dark{else}☀️ Light{/if}
</button>
