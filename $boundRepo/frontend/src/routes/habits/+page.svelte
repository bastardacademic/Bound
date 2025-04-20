<script lang='ts'>
  import { onMount } from 'svelte';
  import HabitList from '/components/HabitList.svelte';
  let habits = [];
  let newName = '';
  onMount(async()=>{ habits = await fetch('/api/habits').then(r=>r.json()); });
  async function add() { await fetch('/api/habits',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name:newName})}); habits = await fetch('/api/habits').then(r=>r.json()); newName=''; }
</script>
<div class='p-4'>
  <h1>My Habits</h1>
  <input bind:value={newName} placeholder='New habit name'/>
  <button on:click={add}>Add Habit</button>
  <HabitList {habits} />
</div>
