<script lang="ts">
  import { analyzeVector } from '../utils/vectorCalculations';
  import VectorInput from './VectorInput.svelte';
  import MagnitudeStep from './MagnitudeStep.svelte';
  import AngleStep from './AngleStep.svelte';
  import DerivativeStep from './DerivativeStep.svelte';
  import IntegralStep from './IntegralStep.svelte';
  import Vector3DVisualization from './Vector3DVisualization.svelte';

  let x = 0.6;
  let y = 550.39;
  let z = 157;

  let analysis = analyzeVector(x, y, z);

  function handleUpdate(values: { x: number; y: number; z: number }) {
    x = values.x;
    y = values.y;
    z = values.z;
    analysis = analyzeVector(x, y, z);
  }
</script>

<div class="analyzer-container">
  <header class="header">
    <h1>🧮 Analizador de Vectores 3D</h1>
    <p>Análisis paso a paso de funciones vectoriales con visualización interactiva</p>
  </header>

  <VectorInput {x} {y} {z} onUpdate={handleUpdate} />

  <div class="visualization-section">
    <Vector3DVisualization {x} {y} {z} />
  </div>

  <div class="steps-section">
    <div class="step-container">
      <MagnitudeStep
        {x}
        {y}
        {z}
        magnitude={analysis.magnitude}
      />
    </div>

    <div class="step-container">
      <AngleStep
        {y}
        magnitude={analysis.magnitude}
        angle={analysis.angle}
        cosAngle={analysis.cosAngle}
      />
    </div>

    <div class="step-container">
      <DerivativeStep
        {x}
        {y}
        {z}
        magnitude={analysis.magnitude}
        cosAngle={analysis.cosAngle}
        derivative={analysis.derivative}
      />
    </div>

    <div class="step-container">
      <IntegralStep
        magnitude={analysis.magnitude}
        cosAngle={analysis.cosAngle}
        integral={analysis.integral}
      />
    </div>
  </div>

  <footer class="footer">
    <p>© 2026 Vector Analysis Project - IDGS7B</p>
  </footer>
</div>

<style>
  :global(body) {
    margin: 0;
    padding: 0;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    min-height: 100vh;
  }

  .analyzer-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
    min-height: 100vh;
  }

  .header {
    text-align: center;
    color: white;
    margin-bottom: 3rem;
    animation: fadeInDown 0.8s ease-out;
  }

  @keyframes fadeInDown {
    from {
      opacity: 0;
      transform: translateY(-30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  h1 {
    margin: 0 0 0.5rem 0;
    font-size: 2.5rem;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }

  .header p {
    margin: 0;
    font-size: 1.1rem;
    opacity: 0.9;
  }

  .visualization-section {
    margin-bottom: 2rem;
  }

  .steps-section {
    display: grid;
    gap: 1.5rem;
  }

  .step-container {
    animation: fadeIn 0.6s ease-out;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  .footer {
    text-align: center;
    color: white;
    margin-top: 3rem;
    padding-top: 2rem;
    border-top: 1px solid rgba(255, 255, 255, 0.2);
    opacity: 0.8;
  }

  .footer p {
    margin: 0;
  }

  @media (max-width: 768px) {
    .analyzer-container {
      padding: 1rem;
    }

    h1 {
      font-size: 1.8rem;
    }

    .header {
      margin-bottom: 2rem;
    }
  }
</style>
