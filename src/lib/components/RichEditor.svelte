<script lang="ts">
  // TipTap (or similar) rich-text editor integration
  import { onMount } from 'svelte';
  let editor;
  onMount(async () => {
    const { Editor } = await import('@tiptap/core');
    editor = new Editor({ content: '' });
  });
</script>
<div bind:this={editor}></div>
