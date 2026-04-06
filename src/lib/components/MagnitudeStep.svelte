<script lang="ts">

  export let x: number;
  export let y: number;
  export let z: number;
  export let magnitude: number;

  let displayedMagnitude = 0;

  $: if (magnitude !== undefined) {
    const duration = 800;
    const start = Date.now();

    const animate = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      displayedMagnitude = magnitude * progress;

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    animate();
  }
</script>

<div class="step-card">
  <div class="step-header">
    <h3>Paso 1: Magnitud</h3>
    <span>📐</span>
  </div>

  <p class="description">
    Longitud del vector: √(x² + y² + z²)
  </p>

  <div class="formula">
    |F| = √({x}² + {y}² + {z}²)
  </div>

  <div class="result-box">
    <div class="result-label">Resultado</div>
    <div class="result-value">{displayedMagnitude.toFixed(2)} u</div>
  </div>
</div>

<style>
  .step-card {
    background: white;
    border-left: 3px solid #2196f3;
    padding: 0.8rem;
  }

  .step-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.5rem;
    padding-bottom: 0.4rem;
    border-bottom: 1px solid #f0f0f0;
  }

  h3 {
    margin: 0;
    color: #1a1a1a;
    font-size: 0.9rem;
    font-weight: 600;
  }

  .description {
    margin: 0 0 0.6rem 0;
    color: #666;
    font-size: 0.8rem;
    line-height: 1.3;
  }

  .formula {
    background: #f5f5f5;
    padding: 0.5rem;
    border-radius: 4px;
    margin: 0.6rem 0;
    font-family: 'Courier New', monospace;
    font-size: 0.8rem;
    color: #2196f3;
    font-weight: 600;
    border: 1px solid #e0e0e0;
  }

  .result-box {
    background: #e3f2fd;
    padding: 0.6rem;
    border-radius: 4px;
    border-left: 3px solid #2196f3;
    text-align: center;
  }

  .result-label {
    font-size: 0.65rem;
    font-weight: 700;
    color: #666;
    text-transform: uppercase;
    letter-spacing: 0.3px;
    margin-bottom: 0.2rem;
  }

  .result-value {
    font-size: 1.4rem;
    font-weight: 700;
    color: #2196f3;
    font-family: 'Courier New', monospace;
    margin: 0;
  }
</style>
