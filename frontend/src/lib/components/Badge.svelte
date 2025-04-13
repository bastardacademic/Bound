<script lang="ts">
  export let label = "";
  export let color = "var(--accent)";
</script>

<span class="badge" style="background-color: {color}">{label}</span>

<style>
  .badge {
    display: inline-block;
    padding: 0.2rem 0.6rem;
    font-size: 0.8rem;
    font-weight: bold;
    color: white;
    background: var(--accent);
    border-radius: 999px;
    margin-left: 0.5rem;
  }
</style>
