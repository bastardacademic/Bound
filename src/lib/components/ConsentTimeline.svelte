<script>
  export let events = [];
</script>
<ul>{#each events as e}<li>{e.user} {e.action} at {e.createdAt}</li>{/each}</ul>
