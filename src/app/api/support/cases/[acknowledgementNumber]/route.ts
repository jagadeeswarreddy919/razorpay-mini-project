import { NextRequest } from 'next/server';
import { SupportService } from '@/lib/services/support.service';
import { getSupportSession } from '@/lib/auth/support-session';
import { successResponse, errorResponse } from '@/lib/utils/api-response';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: { acknowledgementNumber: string } }
) {
  try {
    const session = await getSupportSession();

    if (!session) {
      return errorResponse('UNAUTHORIZED', 'Access denied. Support agent session required.', 401);
    }

    const complaint = await SupportService.getCaseByAckNumber(params.acknowledgementNumber);

    if (!complaint) {
      return errorResponse('CASE_NOT_FOUND', 'Support case not found for provided ACK number.', 404);
    }

    return successResponse(complaint);
  } catch (error) {
    console.error('Error fetching support case detail:', error);
    return errorResponse('INTERNAL_SERVER_ERROR', 'Unable to retrieve case details.', 500);
  }
}
