<script lang="ts">
  export let x: number = 0.6;
  export let y: number = 550.39;
  export let z: number = 157;
  export let onUpdate: (values: { x: number; y: number; z: number }) => void;

  function handleUpdate() {
    onUpdate({ x, y, z });
  }
</script>

<div class="vector-input">
  <label class="comp-label">X</label>
  <input type="number" bind:value={x} step="0.1" on:input={handleUpdate} />
  
  <label class="comp-label">Y</label>
  <input type="number" bind:value={y} step="0.01" on:input={handleUpdate} />
  
  <label class="comp-label">Z</label>
  <input type="number" bind:value={z} step="0.1" on:input={handleUpdate} />
</div>

<style>
  .vector-input {
    background: white;
    padding: 0.6rem;
    border-radius: 6px;
    border: 1px solid #e0e0e0;
    margin-bottom: 0.8rem;
    display: grid;
    grid-template-columns: auto 1fr auto 1fr auto 1fr;
    gap: 0.4rem 0.5rem;
    align-items: center;
  }

  .comp-label {
    font-size: 0.75rem;
    font-weight: 700;
    color: #333;
    text-transform: uppercase;
    letter-spacing: 0.4px;
  }

  input {
    padding: 0.35rem 0.4rem;
    border: 1px solid #d0d0d0;
    border-radius: 4px;
    background: white;
    color: #1a1a1a;
    font-size: 0.8rem;
    font-family: 'Courier New', monospace;
    transition: border-color 0.2s ease;
  }

  input:focus {
    outline: none;
    border-color: #2196f3;
    box-shadow: 0 0 0 2px rgba(33, 150, 243, 0.1);
  }

  @media (max-width: 768px) {
    .vector-input {
      grid-template-columns: auto 1fr;
    }
  }
</style>
