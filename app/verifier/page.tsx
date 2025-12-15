"use client"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Search, Shield, CheckCircle, XCircle, Loader2, FileText, AlertCircle } from "lucide-react"

interface ProofMetadata {
  cid: string
  proofReference: string
  timestamp: string
  issuer: string
  status: string
}

interface VerificationResult {
  isValid: boolean
  reason?: string
  failedChecks?: string[]
  passedChecks?: string[]
  publicSignals: string[]
  claimType: string
  claimValue?: number
  verifiedAt: string
  verifierEntity: string
}

export default function VerifierPage() {
  const [cidInput, setCidInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [metadata, setMetadata] = useState<ProofMetadata | null>(null)
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null)
  const [consentGranted, setConsentGranted] = useState(false)
  const [showConsentDialog, setShowConsentDialog] = useState(false)

  const handleFetchMetadata = async () => {
    if (!cidInput) return

    setLoading(true)
    setVerificationResult(null)

    try {
      const response = await fetch(`/api/proofs/${cidInput}`)
      const data = await response.json()
      setMetadata(data)
    } catch (error) {
      console.error("Error fetching metadata:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyProof = async () => {
    if (!cidInput || !consentGranted) {
      setShowConsentDialog(true)
      return
    }

    setLoading(true)

    try {
      const response = await fetch(`/api/proofs/${cidInput}/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ consent: true }),
      })

      const data = await response.json()

      if (!response.ok) {
        // Handle error responses with proper JSON parsing
        throw new Error(data.message || data.error || `Verification failed: ${response.status}`)
      }

      setVerificationResult(data)
    } catch (error) {
      console.error("[v0] Error verifying proof:", error)
      alert(error instanceof Error ? error.message : "Failed to verify proof")
    } finally {
      setLoading(false)
    }
  }

  const handleGrantConsent = () => {
    setConsentGranted(true)
    setShowConsentDialog(false)
    handleVerifyProof()
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container py-12">
        <div className="mx-auto max-w-5xl">
          {/* Header */}
          <div className="mb-8">
            <Badge className="mb-4" variant="outline">
              <Search className="mr-1 h-3 w-3" />
              Verifier Portal
            </Badge>
            <h1 className="mb-4 text-4xl font-bold tracking-tight">Verify Financial Identity</h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Banks, fintechs, and DeFi platforms can verify user credentials without accessing sensitive information.
              Enter a CID or wallet ID to request verification.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Left Column - Query Interface */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Search className="h-5 w-5" />
                    Query Identity
                  </CardTitle>
                  <CardDescription>Enter a Content Identifier (CID) to fetch proof metadata</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="cid-input">Content Identifier (CID)</Label>
                    <Input
                      id="cid-input"
                      placeholder="Qm..."
                      value={cidInput}
                      onChange={(e) => setCidInput(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                      Example: QmX7k3j9mL2pQ5vR8nT4wY6cH1sD9fB3gA5eN2xV4zM8uI7o
                    </p>
                  </div>

                  <Button className="w-full" onClick={handleFetchMetadata} disabled={!cidInput || loading}>
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Fetching...
                      </>
                    ) : (
                      <>
                        <Search className="mr-2 h-4 w-4" />
                        Fetch Metadata
                      </>
                    )}
                  </Button>

                  {!cidInput && (
                    <Button
                      variant="outline"
                      className="w-full bg-transparent"
                      onClick={() => setCidInput("QmX7k3j9mL2pQ5vR8nT4wY6cH1sD9fB3gA5eN2xV4zM8uI7o")}
                    >
                      Use Sample CID
                    </Button>
                  )}
                </CardContent>
              </Card>

              {metadata && (
                <>
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Proof Metadata</CardTitle>
                      <CardDescription>Information retrieved from blockchain</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid gap-2">
                        <Label className="text-xs text-muted-foreground">CID</Label>
                        <p className="font-mono text-sm break-all">{metadata.cid}</p>
                      </div>
                      <div className="grid gap-2">
                        <Label className="text-xs text-muted-foreground">Proof Reference</Label>
                        <p className="font-mono text-sm">{metadata.proofReference}</p>
                      </div>
                      <div className="grid gap-2">
                        <Label className="text-xs text-muted-foreground">Issued By</Label>
                        <p className="text-sm">{metadata.issuer}</p>
                      </div>
                      <div className="grid gap-2">
                        <Label className="text-xs text-muted-foreground">Timestamp</Label>
                        <p className="text-sm">{metadata.timestamp}</p>
                      </div>
                      <div className="grid gap-2">
                        <Label className="text-xs text-muted-foreground">Status</Label>
                        <Badge variant="outline" className="w-fit">
                          {metadata.status}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Shield className="h-4 w-4" />
                        Verify Proof
                      </CardTitle>
                      <CardDescription>Request user consent and verify the cryptographic proof</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <Alert>
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                          User consent is required before verification. A signature request will be sent.
                        </AlertDescription>
                      </Alert>

                      <Dialog open={showConsentDialog} onOpenChange={setShowConsentDialog}>
                        <DialogTrigger asChild>
                          <Button className="w-full" onClick={handleVerifyProof} disabled={loading}>
                            {loading ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Verifying...
                              </>
                            ) : (
                              <>
                                <Shield className="mr-2 h-4 w-4" />
                                Verify Proof
                              </>
                            )}
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>User Consent Required</DialogTitle>
                            <DialogDescription>
                              The user must grant permission for you to verify their financial identity proof.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4 py-4">
                            <Alert>
                              <Shield className="h-4 w-4" />
                              <AlertDescription>
                                This is a simulated consent flow. In production, this would trigger a wallet signature
                                request.
                              </AlertDescription>
                            </Alert>
                            <div className="space-y-2">
                              <p className="text-sm font-medium">Requested Access:</p>
                              <ul className="space-y-1 text-sm text-muted-foreground">
                                <li className="flex items-start gap-2">
                                  <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                                  <span>Verify proof validity</span>
                                </li>
                                <li className="flex items-start gap-2">
                                  <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                                  <span>Access public signals only</span>
                                </li>
                                <li className="flex items-start gap-2">
                                  <XCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-muted-foreground" />
                                  <span>No access to private financial data</span>
                                </li>
                              </ul>
                            </div>
                          </div>
                          <div className="flex gap-3">
                            <Button variant="outline" onClick={() => setShowConsentDialog(false)} className="flex-1">
                              Decline
                            </Button>
                            <Button onClick={handleGrantConsent} className="flex-1">
                              Grant Consent
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </CardContent>
                  </Card>
                </>
              )}

              {/* Info Sidebar */}
              <Card className="border-primary/50 bg-primary/5">
                <CardHeader>
                  <CardTitle className="text-lg">Privacy-Preserving Verification</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-muted-foreground">
                  <p className="flex items-start gap-2">
                    <Shield className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                    <span>Verification happens without accessing raw financial data</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <Shield className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                    <span>Only cryptographic proofs and public signals are examined</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <Shield className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                    <span>User maintains complete control through consent requirements</span>
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Verification Results */}
            <div className="space-y-6">
              {verificationResult ? (
                <>
                  <Card className={verificationResult.isValid ? "border-primary/50" : "border-destructive/50"}>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        {verificationResult.isValid ? (
                          <>
                            <CheckCircle className="h-5 w-5 text-primary" />
                            <span className="text-primary">Proof Valid</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="h-5 w-5 text-destructive" />
                            <span className="text-destructive">Proof Invalid</span>
                          </>
                        )}
                      </CardTitle>
                      <CardDescription>
                        Verification completed at {new Date(verificationResult.verifiedAt).toLocaleString()}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {verificationResult.isValid ? (
                        <Alert className="border-primary/50 bg-primary/5">
                          <CheckCircle className="h-4 w-4 text-primary" />
                          <AlertDescription className="text-foreground">
                            {verificationResult.reason ||
                              "The cryptographic proof is mathematically valid. The user's claim has been verified."}
                          </AlertDescription>
                        </Alert>
                      ) : (
                        <Alert className="border-destructive/50 bg-destructive/5">
                          <XCircle className="h-4 w-4 text-destructive" />
                          <AlertDescription className="text-foreground">
                            {verificationResult.reason || "The proof failed validation requirements."}
                          </AlertDescription>
                        </Alert>
                      )}

                      <div className="grid gap-2">
                        <Label className="text-xs text-muted-foreground">Claim Type</Label>
                        <Badge variant="outline" className="w-fit">
                          {verificationResult.claimType}
                        </Badge>
                      </div>

                      {verificationResult.claimValue !== undefined && (
                        <div className="grid gap-2">
                          <Label className="text-xs text-muted-foreground">Claim Value</Label>
                          <p className="text-sm font-medium">
                            {verificationResult.claimType === "credit_score" && verificationResult.claimValue}
                            {verificationResult.claimType === "account_balance" &&
                              `$${verificationResult.claimValue.toLocaleString()}`}
                            {verificationResult.claimType === "income_verification" &&
                              `$${verificationResult.claimValue.toLocaleString()}`}
                          </p>
                        </div>
                      )}

                      <div className="grid gap-2">
                        <Label className="text-xs text-muted-foreground">Verified By</Label>
                        <p className="text-sm">{verificationResult.verifierEntity}</p>
                      </div>

                      {verificationResult.passedChecks && verificationResult.passedChecks.length > 0 && (
                        <div className="rounded-md border border-primary/50 bg-primary/5 p-4">
                          <Label className="mb-2 block text-xs font-semibold text-primary">Passed Checks</Label>
                          <ul className="space-y-1">
                            {verificationResult.passedChecks.map((check, index) => (
                              <li key={index} className="flex items-start gap-2 text-sm">
                                <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                                <span>{check}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {verificationResult.failedChecks && verificationResult.failedChecks.length > 0 && (
                        <div className="rounded-md border border-destructive/50 bg-destructive/5 p-4">
                          <Label className="mb-2 block text-xs font-semibold text-destructive">Failed Checks</Label>
                          <ul className="space-y-1">
                            {verificationResult.failedChecks.map((check, index) => (
                              <li key={index} className="flex items-start gap-2 text-sm">
                                <XCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-destructive" />
                                <span>{check}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        Public Signals
                      </CardTitle>
                      <CardDescription>Non-sensitive data revealed by the proof</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {verificationResult.publicSignals.map((signal, index) => (
                        <div key={index} className="rounded-md bg-muted p-3">
                          <Label className="mb-1 block text-xs text-muted-foreground">Signal {index + 1}</Label>
                          <code className="block break-all text-xs font-mono">{signal}</code>
                        </div>
                      ))}

                      <Alert>
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription className="text-xs">
                          Public signals contain no personally identifiable information or raw financial data.
                        </AlertDescription>
                      </Alert>
                    </CardContent>
                  </Card>

                  <Card className="border-accent/50 bg-accent/5">
                    <CardHeader>
                      <CardTitle className="text-lg">What You Can Trust</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm text-muted-foreground">
                      <p className="flex items-start gap-2">
                        <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-accent" />
                        <span>The claim statement is cryptographically proven to be true</span>
                      </p>
                      <p className="flex items-start gap-2">
                        <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-accent" />
                        <span>The proof was issued by a trusted authority</span>
                      </p>
                      <p className="flex items-start gap-2">
                        <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-accent" />
                        <span>The user provided explicit consent for verification</span>
                      </p>
                      <p className="flex items-start gap-2">
                        <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-accent" />
                        <span>No sensitive information was disclosed in the process</span>
                      </p>
                    </CardContent>
                  </Card>
                </>
              ) : (
                <Card className="border-dashed">
                  <CardContent className="flex min-h-[500px] items-center justify-center p-12">
                    <div className="text-center">
                      <Shield className="mx-auto mb-4 h-12 w-12 text-muted-foreground/50" />
                      <p className="text-sm text-muted-foreground mb-2">No verification results yet</p>
                      <p className="text-xs text-muted-foreground">Enter a CID and verify a proof to see results</p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Use Cases */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Verifier Use Cases</CardTitle>
              <CardDescription>How different organizations use DeFi-DX for verification</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-3">
                <div>
                  <h4 className="mb-2 font-semibold text-sm">Banks</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Verify customer creditworthiness for loan applications without requesting sensitive documents or
                    running credit checks.
                  </p>
                </div>
                <div>
                  <h4 className="mb-2 font-semibold text-sm">Fintechs</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Onboard users with instant identity verification while maintaining compliance with KYC regulations.
                  </p>
                </div>
                <div>
                  <h4 className="mb-2 font-semibold text-sm">DeFi Platforms</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Enable trust-based lending with collateral-free loans based on verified credit history.
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
