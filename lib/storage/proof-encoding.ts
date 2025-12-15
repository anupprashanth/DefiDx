// Stateless proof encoding - simulates blockchain/IPFS storage
// In production, this would be replaced with actual blockchain queries

export interface EncodedProofData {
  claimType: string
  claimValue: number | boolean | undefined
  metadata: {
    hasDefaults?: boolean
    documentType?: string
    issuer?: string
    extractedData?: any
  }
  walletAddress: string
  timestamp: string
  fileName: string
}

export function encodeProofInCID(data: EncodedProofData): string {
  // Base64 encode the proof data
  const jsonString = JSON.stringify(data)
  const encoded = Buffer.from(jsonString).toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "")

  // Create a CID-like identifier with embedded data
  return `Qm${encoded.substring(0, 20)}.${encoded}`
}

export function decodeProofFromCID(cid: string): EncodedProofData | null {
  try {
    // Extract the encoded portion after the dot
    const parts = cid.split(".")
    if (parts.length !== 2) {
      console.log("[v0] CID format invalid, falling back to mock data")
      return null
    }

    const encoded = parts[1]
    const base64 = encoded.replace(/-/g, "+").replace(/_/g, "/")

    // Add padding if needed
    const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4)

    const jsonString = Buffer.from(padded, "base64").toString("utf-8")
    return JSON.parse(jsonString)
  } catch (error) {
    console.error("[v0] Error decoding CID:", error)
    return null
  }
}
