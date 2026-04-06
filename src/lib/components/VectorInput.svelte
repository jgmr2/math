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
  <h2>Ingrese los valores del Vector</h2>
  
  <div class="input-group">
    <label>
      <span>X (Factor de Carga)</span>
      <input
        type="number"
        bind:value={x}
        step="0.1"
        onchange={handleUpdate}
      />
    </label>
  </div>

  <div class="input-group">
    <label>
      <span>Y (Tiempo de Procesamiento en segundos)</span>
      <input
        type="number"
        bind:value={y}
        step="0.01"
        onchange={handleUpdate}
      />
    </label>
  </div>

  <div class="input-group">
    <label>
      <span>Z (Latencia en ms)</span>
      <input
        type="number"
        bind:value={z}
        step="0.1"
        onchange={handleUpdate}
      />
    </label>
  </div>

  <button onclick={handleUpdate} class="update-btn">
    Actualizar Cálculos
  </button>
</div>

<style>
  .vector-input {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    padding: 2rem;
    border-radius: 12px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    color: white;
    margin-bottom: 2rem;
  }

  h2 {
    margin: 0 0 1.5rem 0;
    font-size: 1.5rem;
    text-align: center;
  }

  .input-group {
    margin-bottom: 1.5rem;
  }

  label {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  span {
    font-weight: 500;
    font-size: 0.95rem;
  }

  input {
    padding: 0.75rem;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.1);
    color: white;
    font-size: 1rem;
    transition: all 0.3s ease;
  }

  input:focus {
    outline: none;
    border-color: rgba(255, 255, 255, 0.8);
    background: rgba(255, 255, 255, 0.2);
  }

  input::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }

  .update-btn {
    width: 100%;
    padding: 1rem;
    background: rgba(255, 255, 255, 0.2);
    border: 2px solid white;
    color: white;
    border-radius: 8px;
    font-weight: 600;
    font-size: 1rem;
    cursor: pointer;
    transition: all 0.3s ease;
    margin-top: 1rem;
  }

  .update-btn:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  .update-btn:active {
    transform: translateY(0);
  }
</style>
