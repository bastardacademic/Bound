<script lang="ts">
  import { theme } from "$stores/theme";
  let current;
  $: $theme.subscribe(value => current = value);

  function toggle() {
    theme.set(current === "dark" ? "light" : "dark");
  }
</script>

<button on:click={toggle}>
  Switch to {current === "dark" ? "Light" : "Dark"} Mode
</button>

<style>
  button {
    margin: 1rem 0;
    padding: 0.5rem 1rem;
    background: var(--accent);
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
  }
</style>
