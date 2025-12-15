import { NextResponse } from 'next/server'
import { generateMockProof } from '@/lib/mock/zkp'

export async function POST(request: Request) {
  try {
    const { claimType } = await request.json()

    if (!claimType) {
      return NextResponse.json(
        { error: 'Claim type is required' },
        { status: 400 }
      )
    }

    // Simulate circuit execution time
    const computationStart = Date.now()
    await new Promise(resolve => setTimeout(resolve, 2000))
    const computationTime = Date.now() - computationStart

    const proof = generateMockProof({ type: claimType, value: 'true' })

    return NextResponse.json({
      ...proof,
      circuitName: `${claimType}_verifier.circom`,
      claimType,
      computationTime,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to generate proof' },
      { status: 500 }
    )
  }
}
