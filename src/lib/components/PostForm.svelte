<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  export let endpoint: string;
  export let initialData: Record<string, any>;
  export let validate: (data: Record<string, any>) => Record<string, string>;
  export let onSuccess: () => void;

  let formData = { ...initialData };
  let errors: Record<string, string> = {};
  let loading = false;
  const dispatch = createEventDispatcher();

  $: formData.slug = (formData.text || formData.question || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

  async function submit() {
    errors = validate(formData);
    if (Object.keys(errors).length) return;
    loading = true;
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.error || 'Unknown error');
      }
      onSuccess();
    } catch (e) {
      dispatch('error', e);
    } finally {
      loading = false;
    }
  }
</script>

<slot {formData} {errors} {loading} {submit} />
