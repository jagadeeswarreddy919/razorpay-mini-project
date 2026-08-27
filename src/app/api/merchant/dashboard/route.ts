import { NextRequest, NextResponse } from 'next/server';
import { MerchantService } from '@/lib/services/merchant.service';
import { errorResponse } from '@/lib/utils/api-response';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const merchantName = searchParams.get('merchant') || 'Apollo Emergency Medicine';
    const data = await MerchantService.getMerchantDashboard(merchantName);
    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    return errorResponse('SERVER_ERROR', error?.message || 'Failed to load merchant dashboard.', 500);
  }
}
