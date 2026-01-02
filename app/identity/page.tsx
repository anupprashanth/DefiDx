"use client"

import type React from "react"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Wallet, Upload, Shield, CheckCircle, Loader2, AlertCircle } from "lucide-react"

interface IdentityResponse {
  walletAddress: string
  identityId: string
  timestamp: string
  status: string
}

interface ProofResponse {
  cid: string
  proofReference: string
  timestamp: string
  encryptionStatus: string
  extractedData?: {
    creditScore?: number
    accountBalance?: number
    income?: number
    documentType?: string
  }
}

export default function IdentityCreationPage() {
  const [activeTab, setActiveTab] = useState("connect")
  const [walletConnected, setWalletConnected] = useState(false)
  const [walletAddress, setWalletAddress] = useState("")
  const [loading, setLoading] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [identityData, setIdentityData] = useState<IdentityResponse | null>(null)
  const [proofData, setProofData] = useState<ProofResponse | null>(null)
  const [claimType, setClaimType] = useState<string>("credit_score")
  const [manualValue, setManualValue] = useState<string>("")

  const handleConnectWallet = async () => {
    setLoading(true)

    try {
      const response = await fetch("/api/identity/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      })

      const data = await response.json()
      setWalletAddress(data.walletAddress)
      setIdentityData(data)
      setWalletConnected(true)
    } catch (error) {
      console.error("Error connecting wallet:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0]
    if (uploadedFile) {
      setFile(uploadedFile)
    }
  }

  const handleGenerateProof = async () => {
    if (!file || !walletAddress) return

    setLoading(true)

    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("walletAddress", walletAddress)
      formData.append("claimType", claimType)
      if (manualValue) {
        formData.append("manualValue", manualValue)
      }

      console.log("[v0] Sending proof generation request")

      const response = await fetch("/api/proofs/create", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const contentType = response.headers.get("content-type")
        let errorMessage = "Failed to generate proof"

        if (contentType?.includes("application/json")) {
          const errorData = await response.json()
          errorMessage = errorData.error || errorMessage
        } else {
          const text = await response.text()
          console.error("[v0] Non-JSON response:", text.substring(0, 100))
          errorMessage = `Server error: ${response.statusText || "Internal server error"}`
        }

        throw new Error(errorMessage)
      }

      const data = await response.json()
      console.log("[v0] Proof generated successfully:", data)
      setProofData(data)
      setActiveTab("proof")
    } catch (error) {
      console.error("[v0] Error generating proof:", error)
      alert(`Error generating proof: ${error instanceof Error ? error.message : "Unknown error"}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container py-12">
        <div className="mx-auto max-w-4xl">
          {/* Header */}
          <div className="mb-8">
            <Badge className="mb-4" variant="outline">
              <Shield className="mr-1 h-3 w-3" />
              Identity Creation Module
            </Badge>
            <h1 className="mb-4 text-4xl font-bold tracking-tight">Create Your Financial Identity</h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Generate a self-sovereign digital identity by connecting your wallet and uploading verified financial
              credentials. Your data is encrypted and never exposed.
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="connect">1. Connect Wallet</TabsTrigger>
              <TabsTrigger value="upload" disabled={!walletConnected}>
                2. Upload Credentials
              </TabsTrigger>
              <TabsTrigger value="proof" disabled={!proofData}>
                3. View Proof
              </TabsTrigger>
            </TabsList>

            {/* Step 1: Connect Wallet */}
            <TabsContent value="connect" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Wallet className="h-5 w-5" />
                    Connect Your Wallet
                  </CardTitle>
                  <CardDescription>Create a blockchain wallet to establish your decentralized identity</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {!walletConnected ? (
                    <>
                      <Alert>
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                          This demo simulates wallet creation. In production, this would connect to MetaMask or
                          WalletConnect.
                        </AlertDescription>
                      </Alert>

                      <Button size="lg" className="w-full" onClick={handleConnectWallet} disabled={loading}>
                        {loading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Connecting...
                          </>
                        ) : (
                          <>
                            <Wallet className="mr-2 h-4 w-4" />
                            Connect Wallet
                          </>
                        )}
                      </Button>
                    </>
                  ) : (
                    <div className="space-y-4">
                      <Alert className="border-primary/50 bg-primary/5">
                        <CheckCircle className="h-4 w-4 text-primary" />
                        <AlertDescription className="text-foreground">Wallet successfully connected!</AlertDescription>
                      </Alert>

                      <div className="rounded-lg border bg-muted/30 p-6 space-y-4">
                        <div className="grid gap-2">
                          <Label className="text-xs text-muted-foreground">Wallet Address</Label>
                          <p className="font-mono text-sm break-all">{identityData?.walletAddress}</p>
                        </div>
                        <div className="grid gap-2">
                          <Label className="text-xs text-muted-foreground">Identity ID</Label>
                          <p className="font-mono text-sm">{identityData?.identityId}</p>
                        </div>
                        <div className="grid gap-2">
                          <Label className="text-xs text-muted-foreground">Created At</Label>
                          <p className="text-sm">{identityData?.timestamp}</p>
                        </div>
                        <div className="grid gap-2">
                          <Label className="text-xs text-muted-foreground">Status</Label>
                          <Badge variant="outline" className="w-fit">
                            {identityData?.status}
                          </Badge>
                        </div>
                      </div>

                      <div className="pt-4">
                        <Button className="w-full" onClick={() => setActiveTab("upload")}>
                          Continue to Upload Credentials
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Privacy Notice */}
              <Card className="border-accent/50 bg-accent/5">
                <CardHeader>
                  <CardTitle className="text-lg">Privacy Notice</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-muted-foreground">
                  <p className="flex items-start gap-2">
                    <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-accent" />
                    <span>Only your wallet address is stored on-chain</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-accent" />
                    <span>Financial credentials are encrypted before storage</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-accent" />
                    <span>You maintain full control over your data</span>
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Step 2: Upload Credentials */}
            <TabsContent value="upload" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Upload className="h-5 w-5" />
                    Upload Financial Credentials
                  </CardTitle>
                  <CardDescription>
                    Upload bank statements, credit reports, or payroll records in JSON or CSV format
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="credential-file">Financial Document (PDF, JSON, or CSV)</Label>
                    <Input id="credential-file" type="file" accept=".json,.csv,.pdf" onChange={handleFileUpload} />
                    {file && (
                      <p className="text-sm text-muted-foreground">
                        Selected: {file.name} ({(file.size / 1024).toFixed(2)} KB)
                      </p>
                    )}
                  </div>

                  <div className="space-y-4 rounded-lg border bg-muted/30 p-4">
                    <h4 className="font-medium text-sm">Specify Claim Details (for accurate verification)</h4>

                    <div className="space-y-2">
                      <Label htmlFor="claim-type">Claim Type</Label>
                      <select
                        id="claim-type"
                        value={claimType}
                        onChange={(e) => setClaimType(e.target.value)}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        <option value="credit_score">Credit Score</option>
                        <option value="account_balance">Account Balance</option>
                        <option value="income_verification">Income Verification</option>
                        <option value="credit_history">Credit History</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="manual-value">
                        Exact Value from PDF
                        {claimType === "credit_score" && " (e.g., 645, 720)"}
                        {claimType === "account_balance" && " (e.g., 45000, 75000)"}
                        {claimType === "income_verification" && " (e.g., 60000, 85000)"}
                      </Label>
                      <Input
                        id="manual-value"
                        type="number"
                        placeholder={
                          claimType === "credit_score"
                            ? "Enter credit score (300-850)"
                            : claimType === "account_balance"
                              ? "Enter account balance"
                              : "Enter annual income"
                        }
                        value={manualValue}
                        onChange={(e) => setManualValue(e.target.value)}
                      />
                      <p className="text-xs text-muted-foreground">
                        Enter the exact value shown in your PDF to ensure accurate verification
                      </p>
                    </div>
                  </div>

                  <Alert>
                    <Shield className="h-4 w-4" />
                    <AlertDescription>
                      Your file will be encrypted using AES-256 before being processed. Raw data is never stored or
                      transmitted in plain text.
                    </AlertDescription>
                  </Alert>

                  {file && (
                    <div className="rounded-lg border bg-muted/30 p-4 space-y-3">
                      <h4 className="font-medium text-sm">Encryption Process</h4>
                      <div className="space-y-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-primary" />
                          <span>File uploaded to secure enclave</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-primary" />
                          <span>AES-256 encryption applied</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-primary" />
                          <span>Cryptographic commitment generated</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-primary" />
                          <span>Stored in IPFS with CID reference</span>
                        </div>
                      </div>
                    </div>
                  )}

                  <Button size="lg" className="w-full" onClick={handleGenerateProof} disabled={!file || loading}>
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating Proof...
                      </>
                    ) : (
                      "Generate Proof"
                    )}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Step 3: View Proof */}
            <TabsContent value="proof" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-primary" />
                    Proof Generated Successfully
                  </CardTitle>
                  <CardDescription>Your financial identity proof has been created and stored securely</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {proofData && (
                    <>
                      <Alert className="border-primary/50 bg-primary/5">
                        <CheckCircle className="h-4 w-4 text-primary" />
                        <AlertDescription className="text-foreground">
                          Proof successfully generated and registered on-chain!
                        </AlertDescription>
                      </Alert>

                      <div className="rounded-lg border bg-muted/30 p-6 space-y-4">
                        <div className="grid gap-2">
                          <Label className="text-xs text-muted-foreground">Content Identifier (CID)</Label>
                          <p className="font-mono text-sm break-all">{proofData.cid}</p>
                        </div>
                        <div className="grid gap-2">
                          <Label className="text-xs text-muted-foreground">Proof Reference</Label>
                          <p className="font-mono text-sm">{proofData.proofReference}</p>
                        </div>
                        <div className="grid gap-2">
                          <Label className="text-xs text-muted-foreground">Timestamp</Label>
                          <p className="text-sm">{proofData.timestamp}</p>
                        </div>
                        <div className="grid gap-2">
                          <Label className="text-xs text-muted-foreground">Encryption Status</Label>
                          <Badge variant="outline" className="w-fit">
                            <Shield className="mr-1 h-3 w-3" />
                            {proofData.encryptionStatus}
                          </Badge>
                        </div>
                        {proofData.extractedData && (
                          <div className="grid gap-2">
                            <Label className="text-xs text-muted-foreground">Extracted Data</Label>
                            <div className="rounded border bg-background p-3 space-y-1 text-xs font-mono">
                              {proofData.extractedData.creditScore && (
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Credit Score:</span>
                                  <span className="font-semibold">{proofData.extractedData.creditScore}</span>
                                </div>
                              )}
                              {proofData.extractedData.accountBalance && (
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Account Balance:</span>
                                  <span className="font-semibold">
                                    ${proofData.extractedData.accountBalance.toLocaleString()}
                                  </span>
                                </div>
                              )}
                              {proofData.extractedData.income && (
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Annual Income:</span>
                                  <span className="font-semibold">
                                    ${proofData.extractedData.income.toLocaleString()}
                                  </span>
                                </div>
                              )}
                              {proofData.extractedData.documentType && (
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Document Type:</span>
                                  <span className="capitalize">
                                    {proofData.extractedData.documentType.replace("_", " ")}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="rounded-lg border border-accent/50 bg-accent/5 p-6">
                        <h4 className="mb-3 font-semibold flex items-center gap-2">
                          <Shield className="h-4 w-4 text-accent" />
                          Privacy Protection
                        </h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                          <li className="flex items-start gap-2">
                            <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-accent" />
                            <span>Raw financial data is never exposed on-chain</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-accent" />
                            <span>Only cryptographic commitments are stored publicly</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-accent" />
                            <span>Encrypted credentials accessible only with your private key</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-accent" />
                            <span>Zero-knowledge proofs enable verification without disclosure</span>
                          </li>
                        </ul>
                      </div>

                      <div className="pt-4">
                        <Button className="w-full bg-transparent" variant="outline" asChild>
                          <a href="/zkp-engine">Continue to ZKP Engine</a>
                        </Button>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
