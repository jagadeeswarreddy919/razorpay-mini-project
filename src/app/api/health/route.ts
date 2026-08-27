import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    service: 'PayRescue',
    environment: process.env.NODE_ENV || 'development',
  });
}
