<script lang="ts">
  import { onMount } from 'svelte';

  export let y: number;
  export let magnitude: number;
  export let angle: number;
  export let cosAngle: number;

  let isAnimating = false;
  let displayedAngle = 0;
  let displayedCosAngle = 0;

  onMount(() => {
    isAnimating = true;
    const duration = 1500;
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
  });
</script>

<div class="step-card angle-card">
  <div class="step-header">
    <h3>Paso 2: Cálculo del Ángulo</h3>
    <span class="step-number">📏</span>
  </div>

  <div class="step-content">
    <div class="description">
      <p>
        El ángulo define la dirección del vector en relación con el eje Y. Se calcula utilizando la función
        inversa de seno.
      </p>
    </div>

    <div class="formula-container">
      <p class="formula">θ = sin⁻¹(y / |F|)</p>
    </div>

    <div class="calculation">
      <p>θ = sin⁻¹({y} / {magnitude.toFixed(2)})</p>
      <p class="intermediate">θ = sin⁻¹({(y / magnitude).toFixed(4)})</p>
      <p class="intermediate">
        Recordando que sin⁻¹ da resultado en radianes, convertimos a grados:
      </p>
    </div>

    <div class="result-box">
      <div class="result-item">
        <p class="result-label">Ángulo:</p>
        <p class="result-value">{displayedAngle.toFixed(2)}°</p>
      </div>
      <div class="divider"></div>
      <div class="result-item">
        <p class="result-label">cos(θ):</p>
        <p class="result-value">{displayedCosAngle.toFixed(4)}</p>
      </div>
    </div>

    <div class="interpretation">
      <p>
        <strong>Interpretación:</strong> Un ángulo de {angle.toFixed(2)}° indica que el vector está fuertemente
        alineado con el eje Y. El coseno del ángulo ({cosAngle.toFixed(4)}) será utilizado en cálculos posteriores
        como la derivada e integral.
      </p>
    </div>
  </div>
</div>

<style>
  .step-card {
    background: white;
    border-radius: 12px;
    padding: 2rem;
    margin-bottom: 1.5rem;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
    border-left: 5px solid #f57c00;
    animation: slideIn 0.6s ease-out 0.2s both;
  }

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .step-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
    padding-bottom: 1rem;
    border-bottom: 2px solid #f0f0f0;
  }

  h3 {
    margin: 0;
    color: #f57c00;
    font-size: 1.3rem;
  }

  .step-number {
    font-size: 1.8rem;
  }

  .description {
    background: #fff3e0;
    padding: 1rem;
    border-radius: 8px;
    margin-bottom: 1.5rem;
    border-left: 3px solid #f57c00;
  }

  .description p {
    margin: 0;
    color: #555;
    line-height: 1.6;
  }

  .formula-container {
    text-align: center;
    margin: 1.5rem 0;
    padding: 1rem;
    background: linear-gradient(135deg, #f57c0015 0%, #ff9800 15 100%);
    border-radius: 8px;
  }

  .formula {
    margin: 0;
    font-size: 1.2rem;
    font-weight: 600;
    color: #f57c00;
  }

  .calculation {
    background: #fafafa;
    padding: 1.5rem;
    border-radius: 8px;
    margin: 1.5rem 0;
    font-family: 'Courier New', monospace;
    line-height: 1.8;
  }

  .calculation p {
    margin: 0.5rem 0;
    color: #333;
  }

  .intermediate {
    color: #666;
    font-size: 0.95rem;
  }

  .result-box {
    background: linear-gradient(135deg, #f57c00 0%, #ff9800 100%);
    color: white;
    padding: 1.5rem;
    border-radius: 8px;
    margin: 1.5rem 0;
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    align-items: center;
    gap: 1rem;
    animation: pulse 2s ease-in-out infinite;
  }

  @keyframes pulse {
    0%, 100% {
      box-shadow: 0 0 0 0 rgba(245, 124, 0, 0.4);
    }
    50% {
      box-shadow: 0 0 0 10px rgba(245, 124, 0, 0);
    }
  }

  .result-item {
    text-align: center;
  }

  .result-label {
    margin: 0 0 0.5rem 0;
    font-size: 0.9rem;
    opacity: 0.9;
  }

  .result-value {
    margin: 0;
    font-size: 1.5rem;
    font-weight: 700;
  }

  .divider {
    width: 2px;
    height: 50px;
    background: rgba(255, 255, 255, 0.3);
  }

  .interpretation {
    background: #e3f2fd;
    padding: 1rem;
    border-radius: 8px;
    border-left: 3px solid #2196f3;
    margin-top: 1.5rem;
  }

  .interpretation p {
    margin: 0;
    color: #1565c0;
    line-height: 1.6;
  }
</style>
