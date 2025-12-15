// Shared global proof storage using Node.js global object
// This provides better persistence across serverless function invocations

interface GlobalWithProofStore {
  __proofStore?: Map<string, any>
}

function getGlobalProofStore(): Map<string, any> {
  const globalWithStore = globalThis as GlobalWithProofStore

  if (!globalWithStore.__proofStore) {
    globalWithStore.__proofStore = new Map()
    console.log("[v0] Initialized global proof storage")
  }

  return globalWithStore.__proofStore
}

export function storeProof(cid: string, data: any) {
  const store = getGlobalProofStore()
  store.set(cid, data)
  console.log("[v0] Stored proof. CID:", cid, "Total proofs:", store.size)
}

export function getProof(cid: string) {
  const store = getGlobalProofStore()
  const proof = store.get(cid)
  console.log("[v0] Retrieved proof. CID:", cid, "Found:", !!proof, "Total proofs:", store.size)
  return proof
}

export function getAllProofs() {
  const store = getGlobalProofStore()
  return Array.from(store.entries())
}
