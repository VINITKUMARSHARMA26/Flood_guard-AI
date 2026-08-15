import type {
  RiskLevel,
  RiskResult,
  SimulationInput,
  RiskFactors,
} from '../types';

/**
 * FloodRiskEngine — prototype explainable weighted risk model.
 *
 * This is a computational prototype, NOT a scientifically validated
 * flood-prediction model. It combines normalized sub-scores for
 * rainfall, elevation, slope and drainage into a single 0–100 risk
 * score using fixed weights. The architecture is designed so a real
 * hydrological model or ML model can replace this module later.
 *
 * Sub-scores (each 0–100, higher = worse):
 *  - rainfall:   higher rainfall → higher score
 *  - elevation:  lower elevation → higher score
 *  - slope:      lower slope → higher score (flat terrain drains poorly)
 *  - drainage:   lower drainage capacity → higher score
 */

const WEIGHTS = {
  rainfall: 0.4,
  elevation: 0.25,
  slope: 0.2,
  drainage: 0.15,
} as const;

function clamp(v: number, min = 0, max = 100): number {
  return Math.min(max, Math.max(min, v));
}

/** Rainfall sub-score: 0 mm → 0, 250 mm+ → ~100 */
function rainfallScore(rainfall: number): number {
  return clamp((rainfall / 250) * 100);
}

/**
 * Elevation sub-score: sea-level (0 m) → 100,
 * 500 m → 0, linear between.
 */
function elevationScore(elevation: number): number {
  return clamp(100 - (elevation / 500) * 100);
}

/**
 * Slope sub-score: flat terrain (0°) → 100,
 * steep terrain (20°+) → 0. Flat areas retain water.
 */
function slopeScore(slope: number): number {
  return clamp(100 - (slope / 20) * 100);
}

/** Drainage sub-score: 0 capacity → 100, 100 capacity → 0 */
function drainageScore(drainage: number): number {
  return clamp(100 - drainage);
}

function levelFromScore(score: number): RiskLevel {
  if (score >= 65) return 'HIGH';
  if (score >= 40) return 'MEDIUM';
  return 'LOW';
}

/** Estimated flood depth in meters, derived from the risk score. */
function estimateDepth(score: number): number {
  // 0 score → 0 m, 100 score → 3 m, with a slight curve.
  return Math.round((score / 100) ** 1.3 * 3 * 10) / 10;
}

function buildExplanation(
  input: SimulationInput,
  factors: RiskFactors,
  level: RiskLevel,
): string {
  const parts: string[] = [];

  if (factors.rainfall >= 70) {
    parts.push(
      `Heavy rainfall (${input.rainfall} mm) is the dominant contributor to elevated risk`,
    );
  } else if (factors.rainfall >= 40) {
    parts.push(`Moderate rainfall (${input.rainfall} mm) is adding to flood pressure`);
  } else {
    parts.push(`Low rainfall (${input.rainfall} mm) limits immediate flooding potential`);
  }

  if (factors.elevation >= 70) {
    parts.push('the low elevation makes the area prone to water accumulation');
  } else if (factors.elevation >= 40) {
    parts.push('the moderate elevation offers partial natural drainage');
  } else {
    parts.push('the higher elevation naturally reduces pooling');
  }

  if (factors.slope >= 70) {
    parts.push('flat terrain slows surface runoff');
  } else if (factors.slope >= 40) {
    parts.push('the gentle slope allows some runoff');
  } else {
    parts.push('the steeper slope accelerates runoff');
  }

  if (factors.drainage >= 70) {
    parts.push('and drainage capacity is well below the demand');
  } else if (factors.drainage >= 40) {
    parts.push('and drainage capacity is only moderately adequate');
  } else {
    parts.push('and drainage capacity is sufficient for current conditions');
  }

  return `${parts.join(', ')}. Overall risk is classified as ${level}.`;
}

export function calculateRisk(input: SimulationInput): RiskResult {
  const rainfall = rainfallScore(input.rainfall);
  const elevation = elevationScore(input.elevation);
  const slope = slopeScore(input.slope);
  const drainage = drainageScore(input.drainage);

  const factors: RiskFactors = {
    rainfall: Math.round(rainfall),
    elevation: Math.round(elevation),
    slope: Math.round(slope),
    drainage: Math.round(drainage),
  };

  const riskScore = Math.round(
    rainfall * WEIGHTS.rainfall +
      elevation * WEIGHTS.elevation +
      slope * WEIGHTS.slope +
      drainage * WEIGHTS.drainage,
  );

  const riskLevel = levelFromScore(riskScore);
  const estimatedDepth = estimateDepth(riskScore);
  const explanation = buildExplanation(input, factors, riskLevel);

  return { riskScore, riskLevel, estimatedDepth, factors, explanation };
}
