<script lang="ts">

  export let y: number;
  export let magnitude: number;
  export let angle: number;
  export let cosAngle: number;

  let displayedAngle = 0;
  let displayedCosAngle = 0;

  $: if (typeof window !== 'undefined' && angle !== undefined && cosAngle !== undefined) {
    const duration = 800;
    const start = Date.now();

    const animate = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      displayedAngle = angle * progress;
      displayedCosAngle = cosAngle * progress;

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    animate();
  }
</script>

<div class="step-card">
  <div class="step-header">
    <h3>Paso 2: Ángulo</h3>
    <span>📏</span>
  </div>

  <p class="description">
    Dirección del vector respecto al eje Y: sin⁻¹(y / |F|)
  </p>

  <div class="formula">
    θ = sin⁻¹({y.toFixed(2)} / {magnitude.toFixed(2)})
  </div>

  <div class="result-box">
    <div class="result-label">Ángulo</div>
    <div class="result-value">{displayedAngle.toFixed(2)}°</div>
  </div>

  <div class="result-box secondary">
    <div class="result-label">cos(θ)</div>
    <div class="result-value">{displayedCosAngle.toFixed(4)}</div>
  </div>
</div>

<style>
  .step-card {
    background: white;
    border-left: 3px solid #f57c00;
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
    background: #fff3e0;
    padding: 0.5rem;
    border-radius: 4px;
    margin: 0.6rem 0;
    font-family: 'Courier New', monospace;
    font-size: 0.8rem;
    color: #f57c00;
    font-weight: 600;
    border: 1px solid #ffe0b2;
  }

  .result-box {
    background: #fff3e0;
    padding: 0.6rem;
    border-radius: 4px;
    border-left: 3px solid #f57c00;
    text-align: center;
    margin-bottom: 0.4rem;
  }

  .result-box.secondary {
    border-left-color: #ff9500;
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
    color: #f57c00;
    font-family: 'Courier New', monospace;
    margin: 0;
  }
</style>
