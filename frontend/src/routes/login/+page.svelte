<script>
  import { session } from '$stores/session';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  let email = '';
  let password = '';
  let totpToken = '';
  let needsTotp = false;
  let error = '';

  async function login() {
    error = '';
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, totpToken: needsTotp ? totpToken : undefined })
    });

    const data = await res.json();

    if (res.ok && data.requires2FA) {
      needsTotp = true;
      return;
    }

    if (res.ok) {
      session.set({ token: data.token, user: data.user });
      const redirectTo = $page.url.searchParams.get('redirectTo');
      goto(redirectTo || '/dashboard');
    } else {
      error = data.message || 'Invalid email or password';
    }
  }
</script>

<h2>Login</h2>
<form on:submit|preventDefault={login}>
  <input type='email' placeholder='Email' bind:value={email} required disabled={needsTotp} />
  <input type='password' placeholder='Password' bind:value={password} required disabled={needsTotp} />
  {#if needsTotp}
    <input type='text' placeholder='6-digit authentication code' bind:value={totpToken} inputmode='numeric' required />
  {/if}
  <button type='submit'>{needsTotp ? 'Verify' : 'Login'}</button>
</form>
{#if error}<p style='color: red;'>{error}</p>{/if}
