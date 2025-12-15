// Proof validation logic with configurable requirements

export interface ValidationRequirements {
  creditScore?: {
    minimum: number
    required: boolean
  }
  accountBalance?: {
    minimum: number
    required: boolean
  }
  income?: {
    minimum: number
    required: boolean
  }
  creditHistory?: {
    noDefaults: boolean
    required: boolean
  }
}

export interface ProofData {
  cid: string
  claimType: string
  claimValue?: number
  metadata?: Record<string, any>
  timestamp: string
  walletAddress: string
}

export interface ValidationResult {
  isValid: boolean
  reason?: string
  failedChecks?: string[]
  passedChecks?: string[]
  claimType: string
}

// Default validation requirements
const DEFAULT_REQUIREMENTS: ValidationRequirements = {
  creditScore: {
    minimum: 700,
    required: true,
  },
  accountBalance: {
    minimum: 5000,
    required: true,
  },
  income: {
    minimum: 50000,
    required: true,
  },
  creditHistory: {
    noDefaults: true,
    required: true,
  },
}

export function validateProof(
  proofData: ProofData,
  requirements: ValidationRequirements = DEFAULT_REQUIREMENTS,
): ValidationResult {
  const failedChecks: string[] = []
  const passedChecks: string[] = []

  console.log("[v0] Validating proof:", proofData)

  // Validate based on claim type
  switch (proofData.claimType) {
    case "credit_score": {
      const requirement = requirements.creditScore
      if (requirement && requirement.required) {
        if (proofData.claimValue === undefined || proofData.claimValue === null) {
          failedChecks.push("Credit score value is missing from proof")
        } else if (proofData.claimValue >= requirement.minimum) {
          passedChecks.push(`Credit score ${proofData.claimValue} meets minimum requirement of ${requirement.minimum}`)
        } else {
          failedChecks.push(`Credit score ${proofData.claimValue} is below minimum of ${requirement.minimum}`)
        }
      }
      break
    }

    case "account_balance": {
      const requirement = requirements.accountBalance
      if (requirement && requirement.required) {
        if (proofData.claimValue === undefined || proofData.claimValue === null) {
          failedChecks.push("Account balance value is missing from proof")
        } else if (proofData.claimValue >= requirement.minimum) {
          passedChecks.push(
            `Account balance $${proofData.claimValue} meets minimum requirement of $${requirement.minimum}`,
          )
        } else {
          failedChecks.push(`Account balance $${proofData.claimValue} is below minimum of $${requirement.minimum}`)
        }
      }
      break
    }

    case "income_verification": {
      const requirement = requirements.income
      if (requirement && requirement.required) {
        if (proofData.claimValue === undefined || proofData.claimValue === null) {
          failedChecks.push("Income value is missing from proof")
        } else if (proofData.claimValue >= requirement.minimum) {
          passedChecks.push(`Income $${proofData.claimValue} meets minimum requirement of $${requirement.minimum}`)
        } else {
          failedChecks.push(`Income $${proofData.claimValue} is below minimum of $${requirement.minimum}`)
        }
      }
      break
    }

    case "credit_history": {
      const requirement = requirements.creditHistory
      if (requirement && requirement.required && requirement.noDefaults) {
        if (proofData.metadata?.hasDefaults === false) {
          passedChecks.push("Credit history shows no defaults")
        } else if (proofData.metadata?.hasDefaults === true) {
          failedChecks.push("Credit history contains defaults or late payments")
        } else {
          failedChecks.push("Credit history status is unverified")
        }
      }
      break
    }

    default:
      failedChecks.push(`Unknown claim type: ${proofData.claimType}`)
  }

  const isValid = failedChecks.length === 0 && passedChecks.length > 0

  return {
    isValid,
    reason: isValid ? "All validation requirements passed" : failedChecks.join("; "),
    failedChecks: failedChecks.length > 0 ? failedChecks : undefined,
    passedChecks: passedChecks.length > 0 ? passedChecks : undefined,
    claimType: proofData.claimType,
  }
}

// Generate mock proof data for demonstration
export function generateMockProofData(claimType: string, shouldPass = true): ProofData {
  const baseData = {
    cid: `Qm${Math.random().toString(36).substring(2, 30)}`,
    claimType,
    timestamp: new Date().toISOString(),
    walletAddress: `0x${Math.random().toString(16).substring(2, 42)}`,
  }

  switch (claimType) {
    case "credit_score":
      return {
        ...baseData,
        claimValue: shouldPass ? 750 : 650,
      }

    case "account_balance":
      return {
        ...baseData,
        claimValue: shouldPass ? 10000 : 3000,
      }

    case "income_verification":
      return {
        ...baseData,
        claimValue: shouldPass ? 75000 : 35000,
      }

    case "credit_history":
      return {
        ...baseData,
        metadata: {
          hasDefaults: !shouldPass,
        },
      }

    default:
      return baseData
  }
}
