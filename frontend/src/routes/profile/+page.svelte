<script>
  let bio = '';
  let pronouns = '';
  let message = '';

  async function saveProfile() {
    const res = await fetch('/api/users/me', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bio, pronouns })
    });
    const data = await res.json();
    message = data.message || 'Profile updated';
  }
</script>

<h2>Edit Profile</h2>
<form on:submit|preventDefault={saveProfile}>
  <textarea placeholder='Bio' bind:value={bio}></textarea>
  <input placeholder='Pronouns' bind:value={pronouns} />
  <button type='submit'>Save</button>
</form>
<p>{message}</p>
