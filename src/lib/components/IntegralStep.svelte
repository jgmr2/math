<script lang="ts">
  import { onMount } from 'svelte';

  export let magnitude: number;
  export let cosAngle: number;
  export let integral: number;

  let displayedIntegral = 0;

  onMount(() => {
    const duration = 1500;
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

  const coefficients = 0.3 + 275.195 + 78.5;
  const integralCoeff = -magnitude * cosAngle;
</script>

<div class="step-card integral-card">
  <div class="step-header">
    <h3>Paso 4: Cálculo de la Integral</h3>
    <span class="step-number">∫</span>
  </div>

  <div class="step-content">
    <div class="description">
      <p>
        La integral acumula el efecto del vector en el tiempo. Representa el área bajo la curva de la función vectorial
        desde t=0 hasta t=1.
      </p>
    </div>

    <div class="formula-container">
      <p class="formula">∫ F(t)dt = (-|F| × cos(θ)) × (suma de coeficientes) × t²</p>
    </div>

    <div class="calculation">
      <p>∫ F(t)dt = ({integralCoeff.toFixed(4)}) × ({coefficients.toFixed(2)}) × t²</p>
      <p class="intermediate">Evaluando en t = 1:</p>
      <p class="intermediate">∫ F(t)dt = ({integralCoeff.toFixed(4)}) × ({coefficients.toFixed(2)}) × 1²</p>
      <p class="intermediate">∫ F(t)dt = ({integralCoeff.toFixed(4)}) × ({coefficients.toFixed(2)})</p>
    </div>

    <div class="result-box">
      <p class="result-label">Integral (Acumulado):</p>
      <p class="result-value">{displayedIntegral.toFixed(2)} u</p>
    </div>

    <div class="interpretation">
      <p>
        <strong>Interpretación:</strong> La integral de {integral.toFixed(2)} u representa el acumulado del vector en el
        intervalo de tiempo de 0 a 1 segundo. El valor negativo indica una disminución neta en la dirección del vector.
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
    border-left: 5px solid #e91e63;
    animation: slideIn 0.6s ease-out 0.6s both;
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
    color: #e91e63;
    font-size: 1.3rem;
  }

  .step-number {
    font-size: 1.8rem;
  }

  .description {
    background: #fce4ec;
    padding: 1rem;
    border-radius: 8px;
    margin-bottom: 1.5rem;
    border-left: 3px solid #e91e63;
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
    background: linear-gradient(135deg, #e91e6315 0%, #c2185b15 100%);
    border-radius: 8px;
  }

  .formula {
    margin: 0;
    font-size: 1.2rem;
    font-weight: 600;
    color: #e91e63;
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
    background: linear-gradient(135deg, #e91e63 0%, #c2185b 100%);
    color: white;
    padding: 1.5rem;
    border-radius: 8px;
    text-align: center;
    margin: 1.5rem 0;
    animation: pulse 2s ease-in-out infinite;
  }

  @keyframes pulse {
    0%, 100% {
      box-shadow: 0 0 0 0 rgba(233, 30, 99, 0.4);
    }
    50% {
      box-shadow: 0 0 0 10px rgba(233, 30, 99, 0);
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
    background: #f3e5f5;
    padding: 1rem;
    border-radius: 8px;
    border-left: 3px solid #9c27b0;
    margin-top: 1.5rem;
  }

  .interpretation p {
    margin: 0;
    color: #6a1b9a;
    line-height: 1.6;
  }
</style>
