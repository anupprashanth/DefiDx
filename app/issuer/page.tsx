"use client"

import { useState } from 'react'
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { FileText, Upload, Key, CheckCircle, Loader2, AlertCircle, Clock } from 'lucide-react'

interface IssuedCredential {
  cid: string
  credentialType: string
  issuedTo: string
  timestamp: string
  status: string
}

export default function IssuerPage() {
  const [file, setFile] = useState<File | null>(null)
  const [walletAddress, setWalletAddress] = useState('')
  const [loading, setLoading] = useState(false)
  const [issuedCredentials, setIssuedCredentials] = useState<IssuedCredential[]>([])
  const [newCredential, setNewCredential] = useState<IssuedCredential | null>(null)

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0]
    if (uploadedFile) {
      setFile(uploadedFile)
    }
  }

  const handleIssueCredential = async () => {
    if (!file || !walletAddress) return
    
    setLoading(true)
    setNewCredential(null)
    
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('walletAddress', walletAddress)
      
      const response = await fetch('/api/issuer/issue', {
        method: 'POST',
        body: formData,
      })
      
      const data = await response.json()
      setNewCredential(data)
      setIssuedCredentials(prev => [data, ...prev])
      
      // Reset form
      setFile(null)
      setWalletAddress('')
    } catch (error) {
      console.error('Error issuing credential:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container py-12">
        <div className="mx-auto max-w-6xl">
          {/* Header */}
          <div className="mb-8">
            <Badge className="mb-4" variant="outline">
              <Key className="mr-1 h-3 w-3" />
              Issuer Panel
            </Badge>
            <h1 className="mb-4 text-4xl font-bold tracking-tight">
              Credential Issuance Portal
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Banks and financial institutions can issue signed credentials to users. 
              Upload verified documents, sign with your issuer key, and register credentials on-chain.
            </p>
          </div>

          <Tabs defaultValue="issue" className="space-y-6">
            <TabsList>
              <TabsTrigger value="issue">Issue Credential</TabsTrigger>
              <TabsTrigger value="logs">Issuance Logs</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            {/* Issue Credential Tab */}
            <TabsContent value="issue" className="space-y-6">
              <div className="grid gap-6 lg:grid-cols-2">
                {/* Left Column - Issue Form */}
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Upload className="h-5 w-5" />
                        Upload Verified Document
                      </CardTitle>
                      <CardDescription>
                        Upload bank statements, credit reports, or employment records
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="issuer-file">Financial Document</Label>
                        <Input
                          id="issuer-file"
                          type="file"
                          accept=".json,.csv,.pdf"
                          onChange={handleFileUpload}
                        />
                        {file && (
                          <p className="text-sm text-muted-foreground">
                            Selected: {file.name} ({(file.size / 1024).toFixed(2)} KB)
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="wallet-address">User Wallet Address</Label>
                        <Input
                          id="wallet-address"
                          placeholder="0x..."
                          value={walletAddress}
                          onChange={(e) => setWalletAddress(e.target.value)}
                        />
                        <p className="text-xs text-muted-foreground">
                          The wallet address of the credential recipient
                        </p>
                      </div>

                      <Alert>
                        <Key className="h-4 w-4" />
                        <AlertDescription>
                          This credential will be signed with your issuer private key and 
                          registered on the blockchain with an immutable timestamp.
                        </AlertDescription>
                      </Alert>

                      <Button 
                        size="lg" 
                        className="w-full"
                        onClick={handleIssueCredential}
                        disabled={!file || !walletAddress || loading}
                      >
                        {loading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Issuing Credential...
                          </>
                        ) : (
                          <>
                            <FileText className="mr-2 h-4 w-4" />
                            Issue & Sign Credential
                          </>
                        )}
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="border-primary/50 bg-primary/5">
                    <CardHeader>
                      <CardTitle className="text-lg">Issuance Process</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                          1
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">Document Verification</p>
                          <p className="text-xs text-muted-foreground">Validate authenticity of uploaded documents</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                          2
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">Digital Signature</p>
                          <p className="text-xs text-muted-foreground">Sign credential with issuer private key</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                          3
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">Encrypt & Store</p>
                          <p className="text-xs text-muted-foreground">Encrypt credential and upload to IPFS</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                          4
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">Blockchain Registry</p>
                          <p className="text-xs text-muted-foreground">Register CID and metadata on-chain</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Right Column - Result */}
                <div className="space-y-6">
                  {newCredential ? (
                    <>
                      <Card className="border-primary/50">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <CheckCircle className="h-5 w-5 text-primary" />
                            Credential Issued Successfully
                          </CardTitle>
                          <CardDescription>
                            The credential has been signed and registered
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <Alert className="border-primary/50 bg-primary/5">
                            <CheckCircle className="h-4 w-4 text-primary" />
                            <AlertDescription className="text-foreground">
                              Credential successfully issued and stored on blockchain!
                            </AlertDescription>
                          </Alert>

                          <div className="rounded-lg border bg-muted/30 p-6 space-y-4">
                            <div className="grid gap-2">
                              <Label className="text-xs text-muted-foreground">Content Identifier (CID)</Label>
                              <p className="font-mono text-sm break-all">{newCredential.cid}</p>
                            </div>
                            <div className="grid gap-2">
                              <Label className="text-xs text-muted-foreground">Credential Type</Label>
                              <Badge variant="outline" className="w-fit">
                                {newCredential.credentialType}
                              </Badge>
                            </div>
                            <div className="grid gap-2">
                              <Label className="text-xs text-muted-foreground">Issued To</Label>
                              <p className="font-mono text-sm break-all">{newCredential.issuedTo}</p>
                            </div>
                            <div className="grid gap-2">
                              <Label className="text-xs text-muted-foreground">Issued At</Label>
                              <p className="text-sm">{new Date(newCredential.timestamp).toLocaleString()}</p>
                            </div>
                            <div className="grid gap-2">
                              <Label className="text-xs text-muted-foreground">Status</Label>
                              <Badge variant="outline" className="w-fit">
                                {newCredential.status}
                              </Badge>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="border-accent/50 bg-accent/5">
                        <CardHeader>
                          <CardTitle className="text-lg">Next Steps</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2 text-sm text-muted-foreground">
                          <p className="flex items-start gap-2">
                            <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-accent" />
                            <span>User can now generate zero-knowledge proofs using this credential</span>
                          </p>
                          <p className="flex items-start gap-2">
                            <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-accent" />
                            <span>Verifiers can validate claims without accessing raw data</span>
                          </p>
                          <p className="flex items-start gap-2">
                            <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-accent" />
                            <span>Credential is globally portable and recognized</span>
                          </p>
                        </CardContent>
                      </Card>
                    </>
                  ) : (
                    <Card className="border-dashed">
                      <CardContent className="flex min-h-[400px] items-center justify-center p-12">
                        <div className="text-center">
                          <FileText className="mx-auto mb-4 h-12 w-12 text-muted-foreground/50" />
                          <p className="text-sm text-muted-foreground mb-2">
                            No credential issued yet
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Upload a document and issue a credential to see results
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            </TabsContent>

            {/* Issuance Logs Tab */}
            <TabsContent value="logs" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Issuance History
                  </CardTitle>
                  <CardDescription>
                    Complete log of all credentials issued by your organization
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {issuedCredentials.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>CID</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Issued To</TableHead>
                          <TableHead>Timestamp</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {issuedCredentials.map((credential) => (
                          <TableRow key={credential.cid}>
                            <TableCell className="font-mono text-xs">
                              {credential.cid.substring(0, 20)}...
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className="text-xs">
                                {credential.credentialType}
                              </Badge>
                            </TableCell>
                            <TableCell className="font-mono text-xs">
                              {credential.issuedTo.substring(0, 10)}...
                            </TableCell>
                            <TableCell className="text-xs">
                              {new Date(credential.timestamp).toLocaleDateString()}
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className="text-xs">
                                {credential.status}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="flex min-h-[300px] items-center justify-center">
                      <div className="text-center">
                        <Clock className="mx-auto mb-4 h-12 w-12 text-muted-foreground/50" />
                        <p className="text-sm text-muted-foreground">
                          No credentials issued yet
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Issuer Configuration</CardTitle>
                  <CardDescription>
                    Manage your organization's issuer credentials and settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label>Organization Name</Label>
                    <Input defaultValue="DeFi-DX Credential Authority" disabled />
                  </div>

                  <div className="space-y-2">
                    <Label>Issuer Public Key</Label>
                    <div className="rounded-md bg-muted p-3">
                      <code className="block break-all text-xs font-mono text-muted-foreground">
                        0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb
                      </code>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      This public key is registered on the blockchain for credential verification
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label>Supported Credential Types</Label>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline">Bank Statement</Badge>
                      <Badge variant="outline">Credit Report</Badge>
                      <Badge variant="outline">Employment Verification</Badge>
                      <Badge variant="outline">Income Statement</Badge>
                      <Badge variant="outline">Tax Return</Badge>
                    </div>
                  </div>

                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Your issuer private key is stored securely in an HSM (Hardware Security Module). 
                      This demo simulates key management for demonstration purposes.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Security Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Multi-signature Requirement</p>
                      <p className="text-xs text-muted-foreground">Require multiple approvers for credential issuance</p>
                    </div>
                    <Badge variant="outline">Enabled</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Audit Logging</p>
                      <p className="text-xs text-muted-foreground">Log all issuance activities to immutable storage</p>
                    </div>
                    <Badge variant="outline">Enabled</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Automatic Expiration</p>
                      <p className="text-xs text-muted-foreground">Credentials expire after 365 days</p>
                    </div>
                    <Badge variant="outline">Enabled</Badge>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
