/**
 * Calculate donor reliability metrics based on trust score
 * These metrics are only visible to hospitals and blood banks
 */

export interface DonorMetrics {
  responseProbability: number // 0-100%
  fulfillmentConfidence: string // Low, Medium, High, Very High
  expectedETA: string // e.g., "Within 2 hours", "Same day"
  trustScore: number
}

/**
 * Calculate response probability based on trust score
 * Trust score ranges from 0-100
 */
function calculateResponseProbability(trustScore: number): number {
  // Linear mapping: trust score directly correlates to response probability
  // 0-30: Low probability (30-50%)
  // 31-60: Medium probability (50-75%)
  // 61-85: High probability (75-90%)
  // 86-100: Very high probability (90-98%)
  
  if (trustScore <= 30) {
    return 30 + (trustScore / 30) * 20 // 30-50%
  } else if (trustScore <= 60) {
    return 50 + ((trustScore - 30) / 30) * 25 // 50-75%
  } else if (trustScore <= 85) {
    return 75 + ((trustScore - 60) / 25) * 15 // 75-90%
  } else {
    return 90 + ((trustScore - 85) / 15) * 8 // 90-98%
  }
}

/**
 * Calculate fulfillment confidence level based on trust score
 */
function calculateFulfillmentConfidence(trustScore: number): string {
  if (trustScore >= 80) return "Very High"
  if (trustScore >= 60) return "High"
  if (trustScore >= 40) return "Medium"
  return "Low"
}

/**
 * Calculate expected ETA based on trust score and response probability
 */
function calculateExpectedETA(trustScore: number, responseProbability: number): string {
  // Higher trust score = faster response
  if (trustScore >= 80 && responseProbability >= 85) {
    return "Within 1-2 hours"
  } else if (trustScore >= 60 && responseProbability >= 70) {
    return "Within 2-4 hours"
  } else if (trustScore >= 40 && responseProbability >= 55) {
    return "Within 4-8 hours"
  } else if (trustScore >= 20) {
    return "Same day"
  } else {
    return "1-2 days"
  }
}

/**
 * Calculate all donor metrics based on trust score
 */
export function calculateDonorMetrics(trustScore: number): DonorMetrics {
  const responseProbability = calculateResponseProbability(trustScore)
  const fulfillmentConfidence = calculateFulfillmentConfidence(trustScore)
  const expectedETA = calculateExpectedETA(trustScore, responseProbability)

  return {
    responseProbability: Math.round(responseProbability),
    fulfillmentConfidence,
    expectedETA,
    trustScore,
  }
}
