<script lang="ts">
  import { onMount } from 'svelte';
  let jobs = [];
  onMount(async () => {
    const res = await fetch('/api/admin/poll-jobs');
    jobs = await res.json();
  });
</script>

<h1>Poll Jobs</h1>
<table class="w-full">
  <thead>
    <tr><th>ID</th><th>Name</th><th>State</th><th>ExpiresAt</th></tr>
  </thead>
  <tbody>
    {#each jobs as job}
      <tr>
        <td>{job.id}</td>
        <td>{job.name}</td>
        <td>{job.state}</td>
        <td>{new Date(job.data.pollMeta?.expiresAt || job.data.expiresAt).toLocaleString()}</td>
      </tr>
    {/each}
  </tbody>
</table>
