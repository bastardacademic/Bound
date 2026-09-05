<script>
  let data=[];
</script>
<h1>Rate Limit Metrics</h1>
<table>
  <thead>
    <tr><th>User</th><th>Count</th></tr>
  </thead>
  <tbody>
    {#each data as d}<tr><td>{d.user}</td><td>{d.count}</td></tr>{/each}
  </tbody>
</table>
