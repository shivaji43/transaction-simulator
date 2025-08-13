'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { ArrowUpDown, ArrowDown, ArrowUp, Loader2 } from 'lucide-react'
import { FaGithub } from 'react-icons/fa'

interface TokenAsset {
  mint: string
  balanceChange: number
  amount: number
  logouri: string
  decimals: number
  symbol?: string
  name?: string
  isNft?: boolean
}

interface WalletBalanceChange {
  wallet: string
  buying: TokenAsset[]
  selling: TokenAsset[]
}

interface SimulationResult {
  walletBalanceChange: WalletBalanceChange
  success: boolean
}

const TokenCard = ({ token, isBuying }: { token: TokenAsset; isBuying: boolean }) => {
  const formatAmount = (amount: number) => {
    if (token.isNft) {
      return Math.abs(amount).toString()
    }
    return Math.abs(amount).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 6
    })
  }

  return (
    <div className="flex items-center gap-3 p-4 rounded-lg border bg-card">
      <div className="relative">
        {token.logouri ? (
          <img
            src={token.logouri}
            alt={token.symbol || 'Token'}
            width={40}
            height={40}
            className="rounded-full"
            onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
              const target = e.target as HTMLImageElement
              target.style.display = 'none'
              target.nextElementSibling?.classList.remove('hidden')
            }}
          />
        ) : null}
        <div className={`w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center text-white text-sm font-semibold ${token.logouri ? 'hidden' : ''}`}>
          {token.symbol?.[0] || '?'}
        </div>
        <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center ${isBuying ? 'bg-green-500' : 'bg-red-500'}`}>
          {isBuying ? (
            <ArrowDown className="w-3 h-3 text-white" />
          ) : (
            <ArrowUp className="w-3 h-3 text-white" />
          )}
        </div>
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="font-semibold text-foreground truncate">
            {token.name || token.symbol || 'Unknown Token'}
          </p>
          {token.isNft && (
            <span className="px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded-full">
              NFT
            </span>
          )}
        </div>
        <p className="text-sm text-muted-foreground truncate">
          {token.symbol || 'Unknown'}
        </p>
        <p className="text-xs text-muted-foreground font-mono truncate">
          {token.mint.slice(0, 8)}...{token.mint.slice(-8)}
        </p>
      </div>
      
      <div className="text-right">
        <p className={`font-semibold ${isBuying ? 'text-green-600' : 'text-red-600'}`}>
          {isBuying ? '+' : ''}{formatAmount(token.amount)}
        </p>
        <p className="text-sm text-muted-foreground">
          {token.symbol || 'tokens'}
        </p>
      </div>
    </div>
  )
}

export default function TransactionSimulator() {
  const [serializedTransaction, setSerializedTransaction] = useState('')
  const [result, setResult] = useState<SimulationResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSimulate = async () => {
    if (!serializedTransaction.trim()) {
      setError('Please enter a serialized transaction')
      return
    }

    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const response = await fetch('/api/simulate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          serializedTransaction: serializedTransaction.trim(),
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to simulate transaction')
      }

      setResult(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-6 max-w-full">
      <div className="space-y-6">
        <div className="text-center relative">
          <h1 className="text-3xl font-bold tracking-tight">Solana Transaction Simulator</h1>
          <p className="text-muted-foreground mt-2">
            Simulate Solana transactions and see balance changes before execution
          </p>
          <a
            href="https://github.com/shivaji43/transaction-simulator"
            target="_blank"
            rel="noopener noreferrer"
            className="absolute top-0 right-0 p-2 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="View on GitHub"
          >
            <FaGithub className="w-8 h-8" />
          </a>
        </div>

        <div className="flex gap-6 h-[calc(100vh-200px)]">
          {/* Left Panel - Input */}
          <div className="w-1/2 flex flex-col">
            <Card className="flex-1 flex flex-col">
              <CardHeader>
                <CardTitle>Transaction Input</CardTitle>
                <CardDescription>
                  Paste your base64-encoded serialized transaction below
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 flex-1 flex flex-col">
                <Textarea
                  placeholder="Enter your serialized transaction (base64)..."
                  value={serializedTransaction}
                  onChange={(e) => setSerializedTransaction(e.target.value)}
                  className="flex-1 font-mono text-sm resize-none"
                />
                <Button 
                  onClick={handleSimulate} 
                  disabled={loading || !serializedTransaction.trim()}
                  className="w-full"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Simulating...
                    </>
                  ) : (
                    <>
                      <ArrowUpDown className="w-4 h-4" />
                      Simulate Transaction
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {error && (
              <Card className="border-red-200 bg-red-50 mt-4">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 text-red-600">
                    <p className="font-medium">Error</p>
                  </div>
                  <p className="text-red-700 mt-1">{error}</p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Panel - Results */}
          <div className="w-1/2 flex flex-col">
            <div className="flex-1 overflow-y-auto">
              {result ? (
                <div className="space-y-4">
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle>Simulation Results</CardTitle>
                          <CardDescription>
                            Wallet: <span className="font-mono">{result.walletBalanceChange.wallet}</span>
                          </CardDescription>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                          result.success 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {result.success ? 'Success' : 'Failed'}
                        </div>
                      </div>
                    </CardHeader>
                  </Card>

                  {result.walletBalanceChange.buying.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-green-600">
                          <ArrowDown className="w-5 h-5" />
                          Buying ({result.walletBalanceChange.buying.length})
                        </CardTitle>
                        <CardDescription>
                          Tokens being acquired in this transaction
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {result.walletBalanceChange.buying.map((token, index) => (
                          <TokenCard key={`buy-${token.mint}-${index}`} token={token} isBuying={true} />
                        ))}
                      </CardContent>
                    </Card>
                  )}

                  {result.walletBalanceChange.selling.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-red-600">
                          <ArrowUp className="w-5 h-5" />
                          Selling ({result.walletBalanceChange.selling.length})
                        </CardTitle>
                        <CardDescription>
                          Tokens being sold/spent in this transaction
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {result.walletBalanceChange.selling.map((token, index) => (
                          <TokenCard key={`sell-${token.mint}-${index}`} token={token} isBuying={false} />
                        ))}
                      </CardContent>
                    </Card>
                  )}

                  {result.walletBalanceChange.buying.length === 0 && result.walletBalanceChange.selling.length === 0 && (
                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-center text-muted-foreground">
                          <p>No balance changes detected in this transaction.</p>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              ) : (
                <Card className="h-full flex items-center justify-center">
                  <CardContent>
                    <div className="text-center text-muted-foreground">
                        <p>Enter a transaction above and click &apos;Simulate Transaction&apos; to see results here.</p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 