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
  let currentStep = 0;
  let showGraphic = true;

  const steps = ['Magnitud', 'Ángulo', 'Derivada', 'Integral'];

  function handleUpdate(values: { x: number; y: number; z: number }) {
    x = values.x;
    y = values.y;
    z = values.z;
    analysis = analyzeVector(x, y, z);
  }

  function nextStep() {
    if (currentStep < steps.length - 1) {
      currentStep++;
    }
  }

  function prevStep() {
    if (currentStep > 0) {
      currentStep--;
    }
  }

  function toggleGraphic() {
    showGraphic = !showGraphic;
  }
</script>

<div class="analyzer-container">
  <header class="header">
    <h1>Analizador de Vectores 3D</h1>
  </header>

  <VectorInput {x} {y} {z} onUpdate={handleUpdate} />

  <div class="main-content">
    {#if showGraphic}
      <div class="graphic-panel">
        <Vector3DVisualization {x} {y} {z} />
      </div>
    {/if}

    <div class="steps-panel" class:full-width={!showGraphic}>
      <div class="step-header">
        <div class="step-nav">
          <div class="step-indicator">
            {#each steps as step, i}
              <div class="dot" class:active={i === currentStep}></div>
            {/each}
          </div>
          <p class="step-title">Paso {currentStep + 1}: {steps[currentStep]}</p>
        </div>
        <button class="toggle-btn" on:click={toggleGraphic} title={showGraphic ? 'Ocultar gráfica' : 'Mostrar gráfica'}>
          {showGraphic ? '◀' : '▶'}
        </button>
      </div>

      <div class="steps-content">
        {#if currentStep === 0}
          <MagnitudeStep {x} {y} {z} magnitude={analysis.magnitude} />
        {/if}

        {#if currentStep === 1}
          <AngleStep {y} magnitude={analysis.magnitude} angle={analysis.angle} cosAngle={analysis.cosAngle} />
        {/if}

        {#if currentStep === 2}
          <DerivativeStep {x} {y} {z} magnitude={analysis.magnitude} cosAngle={analysis.cosAngle} derivative={analysis.derivative} />
        {/if}

        {#if currentStep === 3}
          <IntegralStep magnitude={analysis.magnitude} cosAngle={analysis.cosAngle} integral={analysis.integral} />
        {/if}
      </div>

      <div class="navigation-buttons">
        <button class="btn btn-prev" on:click={prevStep} disabled={currentStep === 0}>
          ← Anterior
        </button>
        <div class="step-counter">{currentStep + 1} / {steps.length}</div>
        <button class="btn btn-next" on:click={nextStep} disabled={currentStep === steps.length - 1}>
          Siguiente →
        </button>
      </div>
    </div>
  </div>

  <footer class="footer">
    <p>© 2026 Vector Analysis</p>
  </footer>
</div>

<style>
  :global(body) {
    margin: 0;
    padding: 0;
    background: #ffffff;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    min-height: 100vh;
    color: #1a1a1a;
  }

  .analyzer-container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 1rem 1.5rem;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }

  .header {
    text-align: center;
    margin-bottom: 0.8rem;
  }

  h1 {
    margin: 0;
    font-size: 1.6rem;
    font-weight: 700;
    color: #1a1a1a;
  }

  .main-content {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.2rem;
    flex: 1;
    min-height: 0;
  }

  .graphic-panel {
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  }

  .steps-panel {
    background: white;
    border-radius: 8px;
    border: 1px solid #e0e0e0;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  }

  .steps-panel.full-width {
    grid-column: 1 / -1;
    max-width: 100%;
  }

  .step-header {
    padding: 1rem;
    border-bottom: 1px solid #e0e0e0;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .step-nav {
    flex: 1;
  }

  .step-indicator {
    display: flex;
    gap: 6px;
    margin-bottom: 0.6rem;
  }

  .dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #e0e0e0;
    transition: all 0.2s ease;
    cursor: pointer;
  }

  .dot.active {
    background: #2196f3;
    transform: scale(1.3);
  }

  .step-title {
    margin: 0;
    font-size: 1rem;
    font-weight: 600;
    color: #2196f3;
  }

  .toggle-btn {
    background: white;
    border: 1px solid #d0d0d0;
    border-radius: 4px;
    width: 32px;
    height: 32px;
    cursor: pointer;
    font-size: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
    color: #666;
  }

  .toggle-btn:hover {
    background: #f5f5f5;
    border-color: #2196f3;
    color: #2196f3;
  }

  .steps-content {
    padding: 1rem;
    flex: 1;
    overflow-y: auto;
    scroll-behavior: smooth;
  }

  .navigation-buttons {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 1rem;
    padding: 0.8rem 1rem;
    border-top: 1px solid #e0e0e0;
  }

  .btn {
    padding: 8px 18px;
    font-size: 0.85rem;
    font-weight: 600;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.2s ease;
    background: #2196f3;
    color: white;
  }

  .btn:hover:not(:disabled) {
    background: #1976d2;
    box-shadow: 0 2px 6px rgba(33, 150, 243, 0.3);
  }

  .btn:disabled {
    background: #ccc;
    cursor: not-allowed;
    opacity: 0.6;
  }

  .step-counter {
    font-weight: 600;
    color: #666;
    font-size: 0.8rem;
    min-width: 45px;
    text-align: center;
  }

  .footer {
    text-align: center;
    color: #999;
    margin-top: 1rem;
    padding-top: 0.8rem;
    border-top: 1px solid #e0e0e0;
    font-size: 0.75rem;
  }

  .footer p {
    margin: 0;
  }

  @media (max-width: 1024px) {
    .main-content {
      grid-template-columns: 1fr;
      gap: 1rem;
    }

    .graphic-panel {
      order: 2;
    }

    .steps-panel {
      order: 1;
    }
  }

  @media (max-width: 768px) {
    .analyzer-container {
      padding: 0.8rem 1rem;
    }

    h1 {
      font-size: 1.3rem;
    }

    .main-content {
      gap: 0.8rem;
    }
  }
</style>
