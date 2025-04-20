<script lang="ts">
  import PostForm from '$lib/components/PostForm.svelte';
  import { goto } from '$app/navigation';
  const initialData = { text: '', tags: [], privacy: 'PRIVATE', category: 'Private' };
  function validate(data) {
    const errs = {};
    if (!data.text.trim()) errs.text = 'Required';
    if (!data.category) errs.category = 'Pick a category';
    return errs;
  }
</script>

<PostForm
  endpoint='/api/posts/journal'
  initialData={initialData}
  validate={validate}
  onSuccess={() => goto('/feed')}
  let:formData
  let:errors
  let:loading
  let:submit
>
  <textarea bind:value={formData.text} placeholder='Write your entry...' class='w-full p-2 mb-2 rounded'/>
  {#if errors.text}<p class='text-red-500'>{errors.text}</p>{/if}
  <input bind:value={formData.tags} placeholder='tags (comma-separated)' class='w-full p-2 mb-2 rounded' on:input={() => formData.tags = formData.tags.split(',').map(t=>t.trim())}/>
  <select bind:value={formData.privacy} class='w-full p-2 mb-2 rounded'>
    <option>PRIVATE</option><option>SHARED</option><option>PUBLIC</option><option>EROTICA</option><option>FRIENDS</option><option>CONSTELLATION</option>
  </select>
  <select bind:value={formData.category} class='w-full p-2 mb-2 rounded'>
    <option>Private</option><option>Shared</option><option>Erotica</option><option>Public</option>
  </select>
  <p class='text-gray-500 text-sm mb-2'>Slug: {formData.slug}</p>
  <button on:click={submit} class='px-4 py-2 bg-blue-600 rounded' disabled={loading}>{loading ? 'Posting...' : 'Post'}</button>
</PostForm>
