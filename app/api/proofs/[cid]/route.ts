import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ cid: string }> }
) {
  const { cid } = await params
  
  // Simulate fetching metadata from blockchain
  await new Promise(resolve => setTimeout(resolve, 800))

  return NextResponse.json({
    cid,
    proofReference: `proof:${Math.random().toString(36).substring(2, 20)}`,
    timestamp: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
    issuer: 'DeFi-DX Credential Authority',
    status: 'Active',
    blockchainTx: `0x${Math.random().toString(16).substring(2, 66)}`
  })
}
