<script lang="ts">
  import { onMount } from 'svelte';

  export let magnitude: number;
  export let cosAngle: number;
  export let integral: number;

  let displayedIntegral = 0;

  onMount(() => {
    const duration = 800;
    const start = Date.now();

    const animate = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      displayedIntegral = integral * progress;

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    animate();
  });

  const coefficient = -magnitude * cosAngle;
</script>

<div class="step-card">
  <div class="step-header">
    <h3>Paso 4: Integral</h3>
    <span>∫</span>
  </div>

  <p class="description">
    Acumulación del vector en el tiempo: ∫ F(t)dt
  </p>

  <div class="formula">
    ∫ F(t)dt = {coefficient.toFixed(4)} × t²
  </div>

  <div class="result-box">
    <div class="result-label">Integral</div>
    <div class="result-value">{displayedIntegral.toFixed(2)} u</div>
  </div>
</div>

<style>
  .step-card {
    background: white;
    border-left: 3px solid #9c27b0;
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
    background: #f3e5f5;
    padding: 0.5rem;
    border-radius: 4px;
    margin: 0.6rem 0;
    font-family: 'Courier New', monospace;
    font-size: 0.8rem;
    color: #9c27b0;
    font-weight: 600;
    border: 1px solid #e1bee7;
  }

  .result-box {
    background: #f3e5f5;
    padding: 0.6rem;
    border-radius: 4px;
    border-left: 3px solid #9c27b0;
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
    color: #9c27b0;
    font-family: 'Courier New', monospace;
    margin: 0;
  }
</style>
