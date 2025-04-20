<script lang="ts">
  import PostForm from '$lib/components/PostForm.svelte';
  import { goto } from '$app/navigation';
  const initialData = { fileUrl: '', caption: '', tags: [], privacy: 'PRIVATE', taggedUsers: [], ageConfirm: false };
  function validate(data) {
    const errs = {};
    if (!data.fileUrl) errs.fileUrl = 'File URL required';
    if (!data.ageConfirm) errs.ageConfirm = 'Must confirm age';
    return errs;
  }
</script>

<PostForm
  endpoint='/api/posts/media'
  initialData={initialData}
  validate={validate}
  onSuccess={() => goto('/feed')}
  let:formData
  let:errors
  let:loading
  let:submit
>
  <input type='file' accept='image/*,video/*' on:change={e => formData.fileUrl = URL.createObjectURL(e.target.files[0])} class='mb-2'/>
  {#if errors.fileUrl}<p class='text-red-500'>{errors.fileUrl}</p>{/if}
  <input bind:value={formData.caption} placeholder='Caption' class='w-full p-2 mb-2 rounded'/>
  <input bind:value={formData.tags} placeholder='tags' class='w-full p-2 mb-2 rounded' on:input={() => formData.tags = formData.tags.split(',').map(t=>t.trim())}/>
  <input bind:value={formData.taggedUsers} placeholder='tagged user IDs' class='w-full p-2 mb-2 rounded' on:input={() => formData.taggedUsers = formData.taggedUsers.split(',').map(id=>+id)}/>
  <div class='flex items-center mb-2'><input type='checkbox' bind:checked={formData.ageConfirm} id='age'/><label for='age' class='ml-2'>I confirm I am over 18</label></div>
  {#if errors.ageConfirm}<p class='text-red-500'>{errors.ageConfirm}</p>{/if}
  <select bind:value={formData.privacy} class='w-full p-2 mb-2 rounded'><option>PRIVATE</option><option>SHARED</option><option>PUBLIC</option><option>EROTICA</option><option>FRIENDS</option><option>CONSTELLATION</option></select>
  <p class='text-gray-500 text-sm mb-2'>Slug: {formData.slug}</p>
  <button on:click={submit} class='px-4 py-2 bg-blue-600 rounded' disabled={loading}>{loading ? 'Uploading...' : 'Upload & Post'}</button>
</PostForm>
