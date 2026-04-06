<script lang="ts">
  import { onMount } from 'svelte';

  export let x: number;
  export let y: number;
  export let z: number;
  export let magnitude: number;

  let isAnimating = false;
  let displayedMagnitude = 0;

  onMount(() => {
    isAnimating = true;
    const duration = 1500;
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
  });
</script>

<div class="step-card magnitude-card">
  <div class="step-header">
    <h3>Paso 1: Magnitud del Vector</h3>
    <span class="step-number">📐</span>
  </div>

  <div class="step-content">
    <div class="description">
      <p>
        La magnitud es la longitud del vector en el espacio 3D. Se calcula usando la fórmula euclidiana.
      </p>
    </div>

    <div class="formula-container">
      <p class="formula">|F| = √(x² + y² + z²)</p>
    </div>

    <div class="calculation">
      <p>|F| = √({x}² + {y}² + {z}²)</p>
      <p class="intermediate">
        |F| = √({(x * x).toFixed(2)} + {(y * y).toFixed(2)} + {(z * z).toFixed(2)})
      </p>
      <p class="intermediate">
        |F| = √{(x * x + y * y + z * z).toFixed(2)}
      </p>
    </div>

    <div class="result-box">
      <p class="result-label">Resultado:</p>
      <p class="result-value">{displayedMagnitude.toFixed(2)} u</p>
    </div>

    <div class="interpretation">
      <p>
        <strong>Interpretación:</strong> La magnitud de {magnitude.toFixed(2)} unidades representa la longitud total del
        vector en el espacio tridimensional.
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
    border-left: 5px solid #667eea;
    animation: slideIn 0.6s ease-out;
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
    color: #667eea;
    font-size: 1.3rem;
  }

  .step-number {
    font-size: 1.8rem;
  }

  .description {
    background: #f8f9ff;
    padding: 1rem;
    border-radius: 8px;
    margin-bottom: 1.5rem;
    border-left: 3px solid #667eea;
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
    background: linear-gradient(135deg, #667eea15 0%, #764ba215 100%);
    border-radius: 8px;
  }

  .formula {
    margin: 0;
    font-size: 1.2rem;
    font-weight: 600;
    color: #667eea;
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
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 1.5rem;
    border-radius: 8px;
    text-align: center;
    margin: 1.5rem 0;
    animation: pulse 2s ease-in-out infinite;
  }

  @keyframes pulse {
    0%, 100% {
      box-shadow: 0 0 0 0 rgba(102, 126, 234, 0.4);
    }
    50% {
      box-shadow: 0 0 0 10px rgba(102, 126, 234, 0);
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
    background: #e8f5e9;
    padding: 1rem;
    border-radius: 8px;
    border-left: 3px solid #4caf50;
    margin-top: 1.5rem;
  }

  .interpretation p {
    margin: 0;
    color: #2e7d32;
    line-height: 1.6;
  }
</style>
