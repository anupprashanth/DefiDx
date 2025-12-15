import { NextResponse } from 'next/server'

const credentialTypes = ['Bank Statement', 'Credit Report', 'Employment Verification', 'Income Statement']

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const walletAddress = formData.get('walletAddress') as string

    if (!file || !walletAddress) {
      return NextResponse.json(
        { error: 'File and wallet address are required' },
        { status: 400 }
      )
    }

    // Simulate credential issuance process
    await new Promise(resolve => setTimeout(resolve, 2500))

    const cid = `Qm${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`
    const credentialType = credentialTypes[Math.floor(Math.random() * credentialTypes.length)]

    return NextResponse.json({
      cid,
      credentialType,
      issuedTo: walletAddress,
      timestamp: new Date().toISOString(),
      status: 'Active',
      issuerSignature: `sig:${Math.random().toString(36).substring(2, 40)}`,
      blockchainTx: `0x${Math.random().toString(16).substring(2, 66)}`,
      fileName: file.name,
      fileSize: file.size
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to issue credential' },
      { status: 500 }
    )
  }
}
