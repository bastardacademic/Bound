<script>
  import { session } from '/session';
  import { goto } from '/navigation';
  let email = '';
  let password = '';
  let error = '';

  async function login() {
    error = '';
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    if (res.ok) {
      const data = await res.json();
      session.set({ token: data.token, user: data.user });
      goto('/dashboard');
    } else {
      error = 'Invalid email or password';
    }
  }
</script>

<h2>Login</h2>
<form on:submit|preventDefault={login}>
  <input type='email' placeholder='Email' bind:value={email} required />
  <input type='password' placeholder='Password' bind:value={password} required />
  <button type='submit'>Login</button>
</form>
{#if error}<p style='color: red;'>{error}</p>{/if}
