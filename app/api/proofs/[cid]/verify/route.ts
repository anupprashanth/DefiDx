import { NextResponse } from "next/server"
import { validateProof, type ProofData } from "@/lib/validation/proof-validator"
import { getProof } from "@/lib/storage/global-proof-store"
import { decodeProofFromCID } from "@/lib/storage/proof-encoding"

export async function POST(request: Request, { params }: { params: Promise<{ cid: string }> }) {
  const { cid } = await params
  const body = await request.json()

  console.log("[v0] Verification request for CID:", cid)

  if (!body.consent) {
    return NextResponse.json({ error: "User consent required" }, { status: 403 })
  }

  await new Promise((resolve) => setTimeout(resolve, 1500))

  let storedProof = getProof(cid)

  if (!storedProof) {
    console.log("[v0] Proof not in memory, decoding from CID (simulating blockchain lookup)")
    const decodedProof = decodeProofFromCID(cid)

    if (decodedProof) {
      storedProof = decodedProof
      console.log("[v0] Successfully decoded proof from CID")
    }
  }

  if (!storedProof) {
    console.log("[v0] Proof not found in storage or CID")
    return NextResponse.json(
      {
        error: "Proof not found",
        message: "The specified proof CID does not exist or has expired. Please generate a new proof.",
      },
      { status: 404 },
    )
  }

  const proofData: ProofData = {
    cid,
    claimType: storedProof.claimType,
    claimValue: storedProof.claimValue,
    metadata: storedProof.metadata,
    timestamp: storedProof.timestamp,
    walletAddress: storedProof.walletAddress,
  }

  console.log("[v0] Validating proof with real extracted data:", proofData)

  const validation = validateProof(proofData)
  console.log("[v0] Validation result:", validation)

  return NextResponse.json({
    isValid: validation.isValid,
    reason: validation.reason,
    failedChecks: validation.failedChecks,
    passedChecks: validation.passedChecks,
    publicSignals: [
      `signal:${Math.random().toString(36).substring(2, 20)}`,
      `signal:${Math.random().toString(36).substring(2, 20)}`,
      `signal:${Math.random().toString(36).substring(2, 20)}`,
    ],
    claimType: validation.claimType,
    claimValue: proofData.claimValue,
    extractedData: storedProof.metadata?.extractedData,
    documentType: storedProof.metadata?.documentType,
    verifiedAt: new Date().toISOString(),
    verifierEntity: "DeFi-DX Verification Service",
    cid,
  })
}
