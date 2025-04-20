<script lang='ts'>
  export let habits = [];
</script>
<ul>
  {#each habits as h}
    <li class='flex justify-between items-center'>
      <span>{h.name} (Streak: {calculateStreak(h.checkins)})</span>
      <button on:click={()=> onCheckin(h.id)}>Check In</button>
    </li>
  {/each}
</ul>
<script lang='ts'>
  import { calculateStreak, onCheckin } from '/utils/habitUtils';
</script>
