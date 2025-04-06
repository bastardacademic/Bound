<script>
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  let password = '';
  let confirm = '';
  let error = '';
  let message = '';
  $: token = $page.params.token;

  async function resetPassword() {
    error = '';
    if (password !== confirm) {
      error = 'Passwords do not match.';
      return;
    }

    const res = await fetch('/api/auth/reset/' + token, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password })
    });

    if (res.ok) {
      message = 'Password has been reset.';
      setTimeout(() => goto('/login'), 1500);
    } else {
      error = 'Invalid or expired reset token.';
    }
  }
</script>

<h2>Reset Password</h2>
<form on:submit|preventDefault={resetPassword}>
  <input type='password' placeholder='New password' bind:value={password} required />
  <input type='password' placeholder='Confirm password' bind:value={confirm} required />
  <button type='submit'>Reset</button>
</form>
{#if error}<p style='color: red;'>{error}</p>{/if}
{#if message}<p style='color: green;'>{message}</p>{/if}
