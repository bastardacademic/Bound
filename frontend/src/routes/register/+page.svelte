<script>
  import { goto } from '/navigation';
  let email = '';
  let password = '';
  let confirm = '';
  let error = '';
  let message = '';

  async function register() {
    error = '';
    if (password !== confirm) {
      error = 'Passwords do not match';
      return;
    }

    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    if (res.ok) {
      message = 'Account created. You can now login.';
      setTimeout(() => goto('/login'), 1500);
    } else {
      error = 'Could not register. Try a different email.';
    }
  }
</script>

<h2>Register</h2>
<form on:submit|preventDefault={register}>
  <input type='email' placeholder='Email' bind:value={email} required />
  <input type='password' placeholder='Password' bind:value={password} required />
  <input type='password' placeholder='Confirm Password' bind:value={confirm} required />
  <button type='submit'>Register</button>
</form>
{#if error}<p style='color: red;'>{error}</p>{/if}
{#if message}<p style='color: green;'>{message}</p>{/if}
