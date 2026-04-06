export interface VectorValues {
  x: number;
  y: number;
  z: number;
}

export interface VectorAnalysis {
  vector: VectorValues;
  magnitude: number;
  angle: number;
  angleRad: number;
  cosAngle: number;
  sinAngle: number;
  derivative: number;
  integral: number;
}

export function calculateMagnitude(x: number, y: number, z: number): number {
  return Math.sqrt(x * x + y * y + z * z);
}

export function calculateAngle(y: number, magnitude: number): number {
  const sinTheta = y / magnitude;
  const radians = Math.asin(Math.min(1, sinTheta));
  return radians;
}

export function analyzeVector(x: number, y: number, z: number): VectorAnalysis {
  const magnitude = calculateMagnitude(x, y, z);
  const angleRad = calculateAngle(y, magnitude);
  const angleDeg = (angleRad * 180) / Math.PI;
  const cosAngle = Math.cos(angleRad);
  const sinAngle = Math.sin(angleRad);

  // Derivada: d/dt = suma de (componente * magnitud * cosAngle)
  const derivative =
    (x + y + z) * magnitude * cosAngle;

  // Integral con t=1
  const integralCoeff = -(magnitude * cosAngle);
  const integral = integralCoeff * (0.3 + 275.195 + 78.5);

  return {
    vector: { x, y, z },
    magnitude,
    angle: angleDeg,
    angleRad,
    cosAngle,
    sinAngle,
    derivative,
    integral
  };
}

export function getVectorSteps(analysis: VectorAnalysis) {
  const { vector, magnitude, angle, angleRad, cosAngle, sinAngle } = analysis;

  return {
    step1: {
      title: "Cálculo de la Magnitud del Vector",
      formula: `√(${vector.x}² + ${vector.y}² + ${vector.z}²)`,
      calculation: `√(${(vector.x * vector.x).toFixed(2)} + ${(vector.y * vector.y).toFixed(2)} + ${(vector.z * vector.z).toFixed(2)})`,
      result: `√${(vector.x * vector.x + vector.y * vector.y + vector.z * vector.z).toFixed(2)} = ${magnitude.toFixed(2)} u`,
      description: "La magnitud es la longitud del vector en el espacio 3D"
    },
    step2: {
      title: "Cálculo del Ángulo",
      formula: `θ = sin⁻¹(${vector.y} / ${magnitude.toFixed(2)})`,
      calculation: `θ = sin⁻¹(${(vector.y / magnitude).toFixed(4)})`,
      result: `θ = ${angle.toFixed(2)}°`,
      cosResult: `cos(${angle.toFixed(2)}°) = ${cosAngle.toFixed(4)}`,
      description: "El ángulo define la dirección del vector respecto al eje Y"
    },
    step3: {
      title: "Cálculo de la Derivada",
      formula: `d/dt = (x + y + z) × |F| × cos(θ)`,
      calculation: `d/dt = (${vector.x} + ${vector.y} + ${vector.z}) × ${magnitude.toFixed(2)} × ${cosAngle.toFixed(4)}`,
      result: `d/dt = ${(analysis.derivative).toFixed(2)} u`,
      description: "La derivada representa la tasa de cambio del vector"
    },
    step4: {
      title: "Cálculo de la Integral",
      formula: `∫ F(t)dt = (-|F| × cos(θ)) × (0.3t² + 275.195t² + 78.5t²)`,
      calculation: `∫ F(t)dt = ${(-magnitude * cosAngle).toFixed(4)} × ${(0.3 + 275.195 + 78.5).toFixed(2)} (con t=1)`,
      result: `∫ F(t)dt = ${(analysis.integral).toFixed(2)} u`,
      description: "La integral acumula el efecto del vector en el tiempo"
    }
  };
}
