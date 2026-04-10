<script lang="ts">
  import { theme } from "$stores/theme";
  function toggle() {
    theme.update(t => t === "dark" ? "light" : "dark");
  }
</script>
<button onclick={toggle}>
  Switch to {$theme === "dark" ? "Light" : "Dark"} Mode
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