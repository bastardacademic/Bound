<script lang="ts">
  import ChatView from "@/components/ChatView.svelte";
  import { page } from "$app/stores";
  $: threadId = $page.params.threadId;
</script>

<ChatView {threadId} />
