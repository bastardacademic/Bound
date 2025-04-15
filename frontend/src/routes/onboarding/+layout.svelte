<script>
  export let data;
</script>

<main class="onboarding">
  <slot />
</main>

<style>
  .onboarding {
    max-width: 600px;
    margin: 3rem auto;
    padding: 2rem;
    background: #1a1a1a;
    border-radius: 10px;
    color: white;
  }
</style>
