// Mock ZKP utilities for demonstration purposes

export interface ZKProof {
  proof: string
  publicSignals: string[]
  verificationKey: string
}

export interface Claim {
  type: string
  value: string
  threshold?: number
}

export function generateMockProof(claim: Claim): ZKProof {
  return {
    proof: `zkp:${Math.random().toString(36).substring(2, 50)}`,
    publicSignals: [
      `signal:${Math.random().toString(36).substring(2, 20)}`,
      `signal:${Math.random().toString(36).substring(2, 20)}`
    ],
    verificationKey: `vk:${Math.random().toString(36).substring(2, 40)}`
  }
}

export function verifyMockProof(proof: ZKProof): boolean {
  // Mock verification always returns true for demo
  return proof.proof.startsWith('zkp:')
}

export const mockClaims = {
  noDefault: {
    type: 'credit_history',
    description: 'User has never defaulted on a loan',
    category: 'Credit'
  },
  minBalance: {
    type: 'account_balance',
    description: 'Average monthly balance ≥ $5000',
    category: 'Banking'
  },
  incomeVerified: {
    type: 'income_verification',
    description: 'Annual income ≥ $50,000',
    category: 'Employment'
  },
  creditScore: {
    type: 'credit_score',
    description: 'Credit score ≥ 700',
    category: 'Credit'
  }
}
