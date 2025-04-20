<script lang="ts">
  import { locale, locales } from 'svelte-i18n';
  const available = Object.keys(locales);
  function change(e) {
    locale.set(e.target.value);
  }
</script>
<select on:change={change} bind:value={}>
  {#each available as code}
    <option value={code}>{code.toUpperCase()}</option>
  {/each}
</select>
