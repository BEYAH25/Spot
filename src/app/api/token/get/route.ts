import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const source = req.cookies.get('spotify_source_token')?.value;
  const destination = req.cookies.get('spotify_destination_token')?.value;
  // Example: Check user info for each token

  return NextResponse.json({
    source: source ? JSON.parse(source) : null,
    destination: destination ? JSON.parse(destination) : null,
  });
  
} 
