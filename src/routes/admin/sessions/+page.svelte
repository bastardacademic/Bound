<script>
  import { onMount } from 'svelte';
  let sessions=[];
  onMount(async()=>{ sessions=await fetch('/api/admin/sessions').then(r=>r.json()); });
</script>
<ul>{#each sessions.sessions as s}<li>{s.id}</li>{/each}</ul>
