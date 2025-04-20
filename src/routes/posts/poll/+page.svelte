<script lang="ts">
  import PostForm from '$lib/components/PostForm.svelte';
  import { goto } from '$app/navigation';
  let initialData = { question: '', options: ['', ''], tags: [], expiresAt: '', privacy: 'PRIVATE' };
  function validate(data) {
    const errs = {};
    if (!data.question.trim()) errs.question = 'Required';
    if (data.options.filter(o=>o.trim()).length < 2) errs.options = 'Two options required';
    if (!Date.parse(data.expiresAt)) errs.expiresAt = 'Valid date required';
    return errs;
  }
</script>

<PostForm
  endpoint='/api/posts/poll'
  initialData={initialData}
  validate={validate}
  onSuccess={() => goto('/feed')}
  let:formData
  let:errors
  let:loading
  let:submit
>
  <input bind:value={formData.question} placeholder='Your question' class='w-full p-2 mb-2 rounded'/>
  {#if errors.question}<p class='text-red-500'>{errors.question}</p>{/if}
  {#each formData.options as opt, i}
    <input bind:value={formData.options[i]} placeholder={`Option ${i+1}`} class='w-full p-2 mb-2 rounded' />
  {/each}
  {#if errors.options}<p class='text-red-500'>{errors.options}</p>{/if}
  <button on:click={() => formData.options = [...formData.options, '']} class='mb-2 text-sm underline'>+ Add option</button>
  <input bind:value={formData.tags} placeholder='tags' class='w-full p-2 mb-2 rounded' on:input={() => formData.tags = formData.tags.split(',').map(t=>t.trim())}/>
  <input bind:value={formData.expiresAt} type='datetime-local' class='w-full p-2 mb-2 rounded'/>
  {#if errors.expiresAt}<p class='text-red-500'>{errors.expiresAt}</p>{/if}
  <select bind:value={formData.privacy} class='w-full p-2 mb-2 rounded'><option>PRIVATE</option><option>SHARED</option><option>PUBLIC</option><option>EROTICA</option><option>FRIENDS</option><option>CONSTELLATION</option></select>
  <p class='text-gray-500 text-sm mb-2'>Slug: {formData.slug}</p>
  <button on:click={submit} class='px-4 py-2 bg-blue-600 rounded' disabled={loading}>{loading ? 'Creating...' : 'Create Poll'}</button>
</PostForm>
