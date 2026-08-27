import { NextRequest, NextResponse } from 'next/server';
import { OperationsService } from '@/lib/services/operations.service';
import { errorResponse } from '@/lib/utils/api-response';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const data = await OperationsService.getDashboardMetrics();
    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    return errorResponse('SERVER_ERROR', error?.message || 'Failed to load operations metrics.', 500);
  }
}
