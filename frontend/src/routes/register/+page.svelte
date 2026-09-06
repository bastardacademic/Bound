<script>
  import { goto } from '$app/navigation';
  let username = '';
  let email = '';
  let password = '';
  let confirm = '';
  let dateOfBirth = '';
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
      body: JSON.stringify({ username, email, password, date_of_birth: dateOfBirth })
    });

    const data = await res.json();

    if (res.ok) {
      message = 'Account created. You can now login.';
      setTimeout(() => goto('/login'), 1500);
    } else if (data.errors?.length) {
      error = data.errors[0].msg;
    } else {
      error = data.message || 'Could not register.';
    }
  }
</script>

<h2>Register</h2>
<form on:submit|preventDefault={register}>
  <input type='text' placeholder='Username' bind:value={username} required />
  <input type='email' placeholder='Email' bind:value={email} required />
  <input type='password' placeholder='Password' bind:value={password} required />
  <input type='password' placeholder='Confirm Password' bind:value={confirm} required />
  <label>Date of birth</label>
  <input type='date' bind:value={dateOfBirth} required />
  <button type='submit'>Register</button>
</form>
{#if error}<p style='color: red;'>{error}</p>{/if}
{#if message}<p style='color: green;'>{message}</p>{/if}
