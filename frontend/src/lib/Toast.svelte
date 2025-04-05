<script>
  export let message = '';
</script>
{#if message}
  <div class='toast'>{message}</div>
{/if}
<style>
.toast {
  background-color: #222;
  color: white;
  padding: 1rem;
  border-radius: 5px;
  position: fixed;
  bottom: 1rem;
  right: 1rem;
  z-index: 1000;
}
</style>
