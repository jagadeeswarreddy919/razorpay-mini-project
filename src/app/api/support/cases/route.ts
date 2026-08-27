import { NextRequest } from 'next/server';
import { SupportService } from '@/lib/services/support.service';
import { getSupportSession } from '@/lib/auth/support-session';
import { successResponse, errorResponse } from '@/lib/utils/api-response';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const session = await getSupportSession();

    if (!session) {
      return errorResponse('UNAUTHORIZED', 'Access denied. Support agent session required.', 401);
    }

    const { searchParams } = new URL(request.url);
    const filter = searchParams.get('filter') || undefined;

    const metrics = await SupportService.getSupportMetrics();
    const cases = await SupportService.getCaseQueue(filter);

    return successResponse({
      metrics,
      cases,
    });
  } catch (error) {
    console.error('Error fetching support cases:', error);
    return errorResponse('INTERNAL_SERVER_ERROR', 'Unable to fetch support cases.', 500);
  }
}
