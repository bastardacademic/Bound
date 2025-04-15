<script>
  let orientation = "";
  let intents = [];
  const options = ["Exploring", "Looking for events", "Seeking partners", "Learning a kink", "New to community"];
</script>

<h2>?? Intent & Orientation</h2>

<label>
  Relationship Orientation:
  <select bind:value={orientation}>
    <option value="" disabled selected>Select an orientation</option>
    <option value="Monogamous">Monogamous</option>
    <option value="Polyamorous">Polyamorous</option>
    <option value="Solo Poly">Solo Poly</option>
    <option value="Relationship Anarchist">Relationship Anarchist</option>
    <option value="Undecided">Undecided</option>
  </select>
</label>

<div class="intents">
  <p>What brings you here?</p>
  {#each options as opt}
    <label><input type="checkbox" value={opt} on:change={(e) => {
      if (e.target.checked) intents = [...intents, opt];
      else intents = intents.filter(i => i !== opt);
    }} /> {opt}</label>
  {/each}
</div>

<style>
  label, .intents { margin: 1rem 0; display: block; }
  select { margin-left: 0.5rem; }
</style>
