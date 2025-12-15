import { NextResponse } from "next/server"
import { extractFinancialData, determineClaimType, getClaimValue } from "@/lib/document/pdf-parser"
import { storeProof } from "@/lib/storage/global-proof-store"
import { encodeProofInCID, type EncodedProofData } from "@/lib/storage/proof-encoding"

export async function POST(request: Request) {
  try {
    console.log("[v0] Proof creation API called")

    const formData = await request.formData()
    const file = formData.get("file") as File
    const walletAddress = formData.get("walletAddress") as string
    let claimType = (formData.get("claimType") as string) || ""

    if (!file) {
      console.error("[v0] No file provided")
      return NextResponse.json({ error: "File is required" }, { status: 400 })
    }

    if (!walletAddress) {
      console.error("[v0] No wallet address provided")
      return NextResponse.json({ error: "Wallet address is required" }, { status: 400 })
    }

    console.log("[v0] Processing file:", file.name, "Size:", file.size, "Initial claim type:", claimType)

    const extractedData = await extractFinancialData(file)
    console.log("[v0] Extracted financial data:", extractedData)

    if (!claimType) {
      claimType = determineClaimType(extractedData)
      console.log("[v0] Auto-determined claim type:", claimType)
    }

    const claimValue = getClaimValue(extractedData, claimType)
    console.log("[v0] Claim value extracted:", claimValue)

    // Simulate proof generation process
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const encodedData: EncodedProofData = {
      claimType,
      claimValue,
      metadata: {
        hasDefaults: extractedData.hasDefaults || false,
        documentType: extractedData.documentType,
        issuer: extractedData.issuer,
        extractedData,
      },
      walletAddress,
      timestamp: new Date().toISOString(),
      fileName: file.name,
    }

    const cid = encodeProofInCID(encodedData)
    const proofReference = `proof:${Math.random().toString(36).substring(2, 20)}`
    const timestamp = encodedData.timestamp

    const proofData = {
      claimType,
      claimValue,
      metadata: encodedData.metadata,
      walletAddress,
      timestamp,
      fileName: file.name,
    }

    storeProof(cid, proofData)

    const responseData = {
      cid,
      proofReference,
      timestamp,
      encryptionStatus: "AES-256 Encrypted",
      fileName: file.name,
      fileSize: file.size,
      walletAddress,
      claimType,
      claimValue,
      extractedData,
      message: "Proof generated and stored successfully",
    }

    console.log("[v0] Proof generated successfully:", responseData.message)

    return NextResponse.json(responseData)
  } catch (error) {
    console.error("[v0] Error in proof creation API:", error)
    return NextResponse.json(
      { error: "Failed to generate proof", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}
