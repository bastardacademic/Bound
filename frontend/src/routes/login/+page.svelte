<script>
  let email = '';
  let password = '';
  let error = '';
  async function login() {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Login failed');
    } catch (err) {
      error = err.message;
    }
  }
</script>
<h2>Login</h2>
<form on:submit|preventDefault={login}>
  <input type="email" placeholder="Email" bind:value={email} required />
  <input type="password" placeholder="Password" bind:value={password} required />
  <button type="submit">Login</button>
</form>
<p>{error}</p>
