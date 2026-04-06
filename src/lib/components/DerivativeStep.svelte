<script lang="ts">
  import { onMount } from 'svelte';

  export let x: number;
  export let y: number;
  export let z: number;
  export let magnitude: number;
  export let cosAngle: number;
  export let derivative: number;

  let displayedDerivative = 0;

  onMount(() => {
    const duration = 1500;
    const start = Date.now();

    const animate = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      displayedDerivative = derivative * progress;

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    animate();
  });

  const sum = x + y + z;
</script>

<div class="step-card derivative-card">
  <div class="step-header">
    <h3>Paso 3: Cálculo de la Derivada</h3>
    <span class="step-number">📈</span>
  </div>

  <div class="step-content">
    <div class="description">
      <p>
        La derivada representa la tasa de cambio instantánea del vector. Muestra cómo cambia la función vectorial respecto
        al tiempo.
      </p>
    </div>

    <div class="formula-container">
      <p class="formula">d/dt = (x + y + z) × |F| × cos(θ)</p>
    </div>

    <div class="calculation">
      <p>d/dt = ({x} + {y} + {z}) × {magnitude.toFixed(2)} × {cosAngle.toFixed(4)}</p>
      <p class="intermediate">d/dt = {sum.toFixed(2)} × {magnitude.toFixed(2)} × {cosAngle.toFixed(4)}</p>
      <p class="intermediate">
        d/dt = {(sum * magnitude).toFixed(2)} × {cosAngle.toFixed(4)}
      </p>
    </div>

    <div class="result-box">
      <p class="result-label">Tasa de Cambio (Derivada):</p>
      <p class="result-value">{displayedDerivative.toFixed(2)} u</p>
    </div>

    <div class="interpretation">
      <p>
        <strong>Interpretación:</strong> La derivada de {derivative.toFixed(2)} u indica la velocidad con la que el vector
        cambia en el espacio. Un valor positivo significa un cambio creciente en la magnitud del sistema.
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
    border-left: 5px solid #4caf50;
    animation: slideIn 0.6s ease-out 0.4s both;
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
    color: #4caf50;
    font-size: 1.3rem;
  }

  .step-number {
    font-size: 1.8rem;
  }

  .description {
    background: #e8f5e9;
    padding: 1rem;
    border-radius: 8px;
    margin-bottom: 1.5rem;
    border-left: 3px solid #4caf50;
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
    background: linear-gradient(135deg, #4caf5015 0%, #8bc34a15 100%);
    border-radius: 8px;
  }

  .formula {
    margin: 0;
    font-size: 1.2rem;
    font-weight: 600;
    color: #4caf50;
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
    background: linear-gradient(135deg, #4caf50 0%, #8bc34a 100%);
    color: white;
    padding: 1.5rem;
    border-radius: 8px;
    text-align: center;
    margin: 1.5rem 0;
    animation: pulse 2s ease-in-out infinite;
  }

  @keyframes pulse {
    0%, 100% {
      box-shadow: 0 0 0 0 rgba(76, 175, 80, 0.4);
    }
    50% {
      box-shadow: 0 0 0 10px rgba(76, 175, 80, 0);
    }
  }

  .result-label {
    margin: 0 0 0.5rem 0;
    font-size: 0.9rem;
    opacity: 0.9;
  }

  .result-value {
    margin: 0;
    font-size: 2rem;
    font-weight: 700;
  }

  .interpretation {
    background: #e0f2f1;
    padding: 1rem;
    border-radius: 8px;
    border-left: 3px solid #009688;
    margin-top: 1.5rem;
  }

  .interpretation p {
    margin: 0;
    color: #00695c;
    line-height: 1.6;
  }
</style>
