<script lang="ts">
  import { onMount } from 'svelte';
  let users = [];
  onMount(async () => {
    users = await fetch('/api/admin/users').then(r => r.json());
  });
  async function toggle(userId, suspend) {
    await fetch('/api/admin/users', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ userId, suspend }) });
    users = users.map(u => u.id === userId ? { ...u, suspended: suspend } : u);
  }
</script>

<h1>User Management</h1>
<table class='w-full text-left border'>
  <tr><th>ID</th><th>Email</th><th>Name</th><th>Suspended</th><th>Action</th></tr>
  {#each users as u}
    <tr>
      <td>{u.id}</td>
      <td>{u.email}</td>
      <td>{u.name}</td>
      <td>{u.suspended ? 'Yes' : 'No'}</td>
      <td>
        <button on:click={() => toggle(u.id, !u.suspended)}>
          {u.suspended ? 'Unsuspend' : 'Suspend'}
        </button>
      </td>
    </tr>
  {/each}
</table>
