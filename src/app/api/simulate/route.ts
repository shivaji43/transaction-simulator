import { Connection } from '@solana/web3.js';
import { simulateVersionedTransactionWithBalanceChanges } from './versioned';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { serializedTransaction } = await request.json();

    if (!serializedTransaction) {
      return NextResponse.json(
        { error: 'Serialized transaction is required' },
        { status: 400 }
      );
    }

    const connection = new Connection(process.env.RPC_URL!);
    
    const result = await simulateVersionedTransactionWithBalanceChanges(
      serializedTransaction,
      connection
    );

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error simulating transaction:', error);
    return NextResponse.json(
      { error: 'Failed to simulate transaction', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
