<script lang="ts">
  import ProfileOverview from "@/components/ProfileOverview.svelte";
  import { page } from "$app/stores";
  $: username = $page.params.username;
</script>

<ProfileOverview {username} />
