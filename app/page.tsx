import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Shield, Lock, Globe, Zap, CheckCircle, ArrowRight } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Hero Section */}
      <section className="container mx-auto py-24 md:py-32 lg:py-40">
        <div className="mx-auto max-w-4xl text-center">
          <Badge className="mb-4" variant="secondary">
            Privacy-First Financial Identity
          </Badge>
          <h1 className="mb-6 text-4xl font-bold tracking-tight text-balance md:text-6xl lg:text-7xl">
            Decentralized Financial Identity for a Global Economy
          </h1>
          <p className="mb-8 text-lg text-muted-foreground text-pretty md:text-xl leading-relaxed">
            Prove your financial trustworthiness globally without compromising sensitive data. 
            Powered by blockchain technology and zero-knowledge proofs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/identity">
                Launch Demo
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="#architecture">Explore Architecture</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Problem Statement */}
      <section className="border-t border-border bg-muted/30 py-24">
        <div className="container mx-auto">
          <div className="mx-auto max-w-4xl">
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-balance md:text-4xl">
              The Problem
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Existing credit verification systems are fragmented, region-specific, and vulnerable to breaches, 
              making it difficult for users to carry financial credibility internationally. Current systems expose 
              sensitive personal information and lack interoperability across borders.
            </p>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="container mx-auto py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-balance md:text-4xl">
              Core Components
            </h2>
            <p className="text-lg text-muted-foreground">
              Four integrated modules that enable privacy-preserving financial verification
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Identity Creation Module</CardTitle>
                <CardDescription>
                  Self-sovereign digital identity with blockchain wallet integration
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Users create a financial passport by linking verified data sources through cryptographic 
                  commitments. Only metadata is stored on-chain, ensuring privacy from the start.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
                  <Lock className="h-6 w-6 text-accent" />
                </div>
                <CardTitle>Zero-Knowledge Proof Engine</CardTitle>
                <CardDescription>
                  Privacy-preserving verification without exposing raw data
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Generate compact cryptographic proofs for specific claims using zk-SNARKs. 
                  Verifiers validate claims without accessing sensitive financial information.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-chart-1/10">
                  <Globe className="h-6 w-6 text-chart-1" />
                </div>
                <CardTitle>Blockchain Storage Layer</CardTitle>
                <CardDescription>
                  Immutable, tamper-resistant proof registry
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Records proof references, timestamps, and issuer signatures on-chain. 
                  Full credentials remain encrypted off-chain for maximum privacy and scalability.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-chart-2/10">
                  <Zap className="h-6 w-6 text-chart-2" />
                </div>
                <CardTitle>Integration APIs</CardTitle>
                <CardDescription>
                  Seamless verification for banks, fintechs, and DeFi platforms
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  RESTful and Web3 APIs with wallet-based authorization. 
                  User consent required for all data access, ensuring complete control over identity.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* System Architecture */}
      <section id="architecture" className="border-t border-border bg-muted/30 py-24">
        <div className="container mx-auto">
          <div className="mx-auto max-w-6xl">
            <div className="mb-16 text-center">
              <h2 className="mb-4 text-3xl font-bold tracking-tight text-balance md:text-4xl">
                System Architecture
              </h2>
              <p className="text-lg text-muted-foreground">
                Enterprise-grade infrastructure built for security and scalability
              </p>
            </div>

            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <img 
                  src="/blockchain-architecture-diagram-with-user-issuer-v.jpg" 
                  alt="DeFi-DX System Architecture"
                  className="w-full"
                />
              </CardContent>
            </Card>

            <div className="mt-12 grid gap-6 md:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Blockchain Layer</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Ethereum/Polygon smart contracts for immutable proof storage and verification logic
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Cryptography Layer</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Circom circuits and snarkjs for generating and verifying zero-knowledge proofs
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Storage Layer</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    IPFS/Filecoin for decentralized encrypted credential storage with CID references
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Applications */}
      <section className="container mx-auto py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-balance md:text-4xl">
              Real-World Applications
            </h2>
            <p className="text-lg text-muted-foreground">
              Transforming financial services across multiple industries
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "Global Credit Portability",
                description: "Financial trust scores recognized internationally without re-verification"
              },
              {
                title: "Privacy-Preserving KYC",
                description: "Banks verify compliance without accessing private customer data"
              },
              {
                title: "Cross-Border Lending",
                description: "Lenders assess risk for international clients with confidence"
              },
              {
                title: "Decentralized Finance",
                description: "Trust-based crypto lending and borrowing without intermediaries"
              },
              {
                title: "Fraud Prevention",
                description: "Reduce identity theft through cryptographic verification"
              },
              {
                title: "Financial Inclusion",
                description: "Unbanked populations gain globally recognized credentials"
              }
            ].map((app, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="mb-2">
                    <CheckCircle className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{app.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {app.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Stack */}
      <section className="border-t border-border bg-muted/30 py-24">
        <div className="container mx-auto">
          <div className="mx-auto max-w-4xl">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-3xl font-bold tracking-tight text-balance md:text-4xl">
                Technology Stack
              </h2>
            </div>

            <div className="grid gap-8 md:grid-cols-2">
              <div>
                <h3 className="mb-4 text-xl font-semibold">Blockchain & Crypto</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    Ethereum / Polygon
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    Solidity Smart Contracts
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    Circom & SnarkJS (zk-SNARKs)
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    Web3.js Integration
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="mb-4 text-xl font-semibold">Backend & Storage</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    Next.js API Routes
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    PostgreSQL (Encrypted)
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    IPFS/Filecoin Storage
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    OpenZeppelin Security
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto py-24">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mb-6 text-3xl font-bold tracking-tight text-balance md:text-4xl">
            Ready to Experience the Future of Financial Identity?
          </h2>
          <p className="mb-8 text-lg text-muted-foreground">
            Explore our interactive demo and see how zero-knowledge proofs enable 
            privacy-preserving verification.
          </p>
          <Button size="lg" asChild>
            <Link href="/identity">
              Launch Demo
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12">
        <div className="container mx-auto">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded bg-primary">
                <span className="text-sm font-bold text-primary-foreground">D</span>
              </div>
              <span className="font-semibold">DeFi-DX</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2025 DeFi-DX. Privacy-preserving financial identity verification.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
