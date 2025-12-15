"use client"

import { useState } from 'react'
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Lock, Play, CheckCircle, Loader2, ArrowRight, Code2, Shield } from 'lucide-react'
import { mockClaims } from '@/lib/mock/zkp'

interface ZKPResult {
  proof: string
  publicSignals: string[]
  verificationKey: string
  circuitName: string
  claimType: string
  computationTime: number
}

export default function ZKPEnginePage() {
  const [selectedClaim, setSelectedClaim] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [zkpResult, setZkpResult] = useState<ZKPResult | null>(null)

  const handleRunCircuit = async () => {
    if (!selectedClaim) return
    
    setLoading(true)
    
    try {
      const response = await fetch('/api/zkp/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ claimType: selectedClaim })
      })
      
      const data = await response.json()
      setZkpResult(data)
    } catch (error) {
      console.error('Error generating proof:', error)
    } finally {
      setLoading(false)
    }
  }

  const claimsList = Object.entries(mockClaims).map(([key, value]) => ({
    id: key,
    ...value
  }))

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container py-12">
        <div className="mx-auto max-w-5xl">
          {/* Header */}
          <div className="mb-8">
            <Badge className="mb-4" variant="outline">
              <Lock className="mr-1 h-3 w-3" />
              Zero-Knowledge Proof Engine
            </Badge>
            <h1 className="mb-4 text-4xl font-bold tracking-tight">
              Privacy-Preserving Verification
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Generate cryptographic proofs that verify financial claims without exposing sensitive data. 
              Select a claim type to see the ZKP generation process in action.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Left Column - Input & Controls */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Code2 className="h-5 w-5" />
                    Circuit Configuration
                  </CardTitle>
                  <CardDescription>
                    Select a financial claim to generate a zero-knowledge proof
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label>Claim Type</Label>
                    <Select value={selectedClaim} onValueChange={setSelectedClaim}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a claim to prove" />
                      </SelectTrigger>
                      <SelectContent>
                        {claimsList.map((claim) => (
                          <SelectItem key={claim.id} value={claim.id}>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs">
                                {claim.category}
                              </Badge>
                              <span>{claim.description}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {selectedClaim && (
                    <Alert>
                      <Shield className="h-4 w-4" />
                      <AlertDescription>
                        This will generate a zk-SNARK proof using Circom circuits. 
                        No private data will be revealed in the proof.
                      </AlertDescription>
                    </Alert>
                  )}

                  <Button 
                    size="lg" 
                    className="w-full"
                    onClick={handleRunCircuit}
                    disabled={!selectedClaim || loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Running Circuit...
                      </>
                    ) : (
                      <>
                        <Play className="mr-2 h-4 w-4" />
                        Generate Proof
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>

              {/* ZKP Process Flow */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Proof Generation Flow</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    { step: 1, label: 'Load Private Inputs', desc: 'Encrypted financial data' },
                    { step: 2, label: 'Execute Circuit', desc: 'Circom/snarkjs computation' },
                    { step: 3, label: 'Generate Proof', desc: 'zk-SNARK proof generation' },
                    { step: 4, label: 'Extract Public Signals', desc: 'Minimal public outputs' },
                    { step: 5, label: 'Return Proof', desc: 'Verifiable cryptographic proof' }
                  ].map((item) => (
                    <div key={item.step} className="flex items-start gap-3">
                      <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                        {item.step}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{item.label}</p>
                        <p className="text-xs text-muted-foreground">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Results */}
            <div className="space-y-6">
              {zkpResult ? (
                <>
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-primary" />
                        Proof Generated
                      </CardTitle>
                      <CardDescription>
                        Zero-knowledge proof successfully created
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid gap-2">
                        <Label className="text-xs text-muted-foreground">Circuit</Label>
                        <p className="font-mono text-sm">{zkpResult.circuitName}</p>
                      </div>
                      <div className="grid gap-2">
                        <Label className="text-xs text-muted-foreground">Claim Type</Label>
                        <Badge variant="outline" className="w-fit">
                          {zkpResult.claimType}
                        </Badge>
                      </div>
                      <div className="grid gap-2">
                        <Label className="text-xs text-muted-foreground">Computation Time</Label>
                        <p className="text-sm">{zkpResult.computationTime}ms</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Proof Data</CardTitle>
                      <CardDescription>Cryptographic proof output</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid gap-2">
                        <Label className="text-xs text-muted-foreground">zk-SNARK Proof</Label>
                        <div className="rounded-md bg-muted p-3">
                          <code className="block break-all text-xs font-mono text-muted-foreground">
                            {zkpResult.proof}
                          </code>
                        </div>
                      </div>
                      
                      <div className="grid gap-2">
                        <Label className="text-xs text-muted-foreground">Verification Key</Label>
                        <div className="rounded-md bg-muted p-3">
                          <code className="block break-all text-xs font-mono text-muted-foreground">
                            {zkpResult.verificationKey}
                          </code>
                        </div>
                      </div>

                      <div className="grid gap-2">
                        <Label className="text-xs text-muted-foreground">
                          Public Signals ({zkpResult.publicSignals.length})
                        </Label>
                        <div className="space-y-2">
                          {zkpResult.publicSignals.map((signal, index) => (
                            <div key={index} className="rounded-md bg-muted p-2">
                              <code className="block break-all text-xs font-mono text-muted-foreground">
                                {signal}
                              </code>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-accent/50 bg-accent/5">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Shield className="h-4 w-4 text-accent" />
                        Privacy Guarantee
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm text-muted-foreground">
                      <p className="flex items-start gap-2">
                        <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-accent" />
                        <span>Proof is mathematically valid without revealing inputs</span>
                      </p>
                      <p className="flex items-start gap-2">
                        <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-accent" />
                        <span>Public signals contain no personally identifiable information</span>
                      </p>
                      <p className="flex items-start gap-2">
                        <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-accent" />
                        <span>Computationally infeasible to reverse-engineer private data</span>
                      </p>
                    </CardContent>
                  </Card>

                  <Button className="w-full" variant="outline" asChild>
                    <a href="/verifier">
                      Continue to Verifier Portal
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                </>
              ) : (
                <Card className="border-dashed">
                  <CardContent className="flex min-h-[400px] items-center justify-center p-12">
                    <div className="text-center">
                      <Lock className="mx-auto mb-4 h-12 w-12 text-muted-foreground/50" />
                      <p className="text-sm text-muted-foreground">
                        Select a claim and generate a proof to see results
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Technical Details */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>How Zero-Knowledge Proofs Work</CardTitle>
              <CardDescription>
                Understanding the cryptographic primitives behind DeFi-DX
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-6 md:grid-cols-3">
                <div>
                  <h4 className="mb-2 font-semibold text-sm">Inputs</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Private financial data (bank statements, credit history) remains encrypted and off-chain. 
                    Only the user has access.
                  </p>
                </div>
                <div>
                  <h4 className="mb-2 font-semibold text-sm">Circuit</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Circom circuits define the mathematical constraints that must be satisfied. 
                    The circuit verifies claims without exposing data.
                  </p>
                </div>
                <div>
                  <h4 className="mb-2 font-semibold text-sm">Proof</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    zk-SNARK produces a compact proof and minimal public signals. 
                    Verifiers can validate claims without seeing private inputs.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
