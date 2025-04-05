<script>
  let email = '';
  let password = '';
  let error = '';
  async function signup() {
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Signup failed');
    } catch (err) {
      error = err.message;
    }
  }
</script>
<h2>Signup</h2>
<form on:submit|preventDefault={signup}>
  <input type="email" placeholder="Email" bind:value={email} required />
  <input type="password" placeholder="Password" bind:value={password} required />
  <button type="submit">Create Account</button>
</form>
<p>{error}</p>
