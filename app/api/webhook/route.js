import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();

    // Handle different webhook events from Base
    console.log('Webhook received:', body);

    // In a real implementation, you would:
    // - Verify webhook signature
    // - Handle transaction confirmations
    // - Update user balances
    // - Send notifications

    if (body.event === 'transaction_confirmed') {
      console.log('Transaction confirmed:', body.transactionId);
      // Update user's NFT ownership status
    }

    if (body.event === 'nft_minted') {
      console.log('NFT minted:', body.nftId);
      // Send notification to user
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

export async function GET() {
  // Health check endpoint
  return NextResponse.json({ status: 'ok' });
}
