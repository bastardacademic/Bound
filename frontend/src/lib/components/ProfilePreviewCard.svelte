<script lang="ts">
  export let username: string;
  export let displayName: string = username;
  export let pronouns: string = "";
  export let flair: string = "";
  export let mutualGroups: string[] = [];
</script>

<div class="profile-preview-card">
  <strong>{displayName}</strong>
  <span class="username">@{username}</span>
  {#if pronouns}<span class="pronouns">({pronouns})</span>{/if}
  {#if flair}<div class="flair">{flair}</div>{/if}
  {#if mutualGroups.length}
    <div class="mutual-groups">Mutual groups: {mutualGroups.join(", ")}</div>
  {/if}
</div>

<style>
  .profile-preview-card {
    background: #222;
    color: #fff;
    border: 1px solid #444;
    border-radius: 6px;
    padding: 0.75rem;
    max-width: 240px;
    font-size: 0.85rem;
  }
  .username {
    color: #aaa;
    margin-left: 0.25rem;
  }
  .pronouns {
    color: #888;
    margin-left: 0.25rem;
  }
  .flair {
    margin-top: 0.25rem;
    font-style: italic;
  }
  .mutual-groups {
    margin-top: 0.25rem;
    font-size: 0.75rem;
    color: #999;
  }
</style>
