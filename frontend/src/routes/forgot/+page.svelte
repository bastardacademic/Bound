<script>
  let email = '';
  let message = '';
  let error = '';

  async function sendResetLink() {
    error = '';
    const res = await fetch('/api/auth/forgot', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });

    if (res.ok) {
      message = 'Reset link sent to your email.';
    } else {
      error = 'Could not send reset email.';
    }
  }
</script>

<h2>Forgot Password</h2>
<form on:submit|preventDefault={sendResetLink}>
  <input type='email' placeholder='Your email' bind:value={email} required />
  <button type='submit'>Send Reset Link</button>
</form>
{#if error}<p style='color: red;'>{error}</p>{/if}
{#if message}<p style='color: green;'>{message}</p>{/if}
