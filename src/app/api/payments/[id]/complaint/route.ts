import { NextRequest, NextResponse } from 'next/server';
import { ComplaintService } from '@/lib/services/complaint.service';
import { getSession } from '@/lib/auth/session';
import { successResponse, errorResponse } from '@/lib/utils/api-response';

export const dynamic = 'force-dynamic';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();

    if (!session) {
      return errorResponse('UNAUTHORIZED', 'Please login to create a resolution case.', 401);
    }

    const result = await ComplaintService.createOrGetComplaint(params.id, session.customerId);

    if (result.error === 'PAYMENT_NOT_FOUND') {
      return errorResponse('PAYMENT_NOT_FOUND', result.message || 'Payment not found.', 404);
    }

    return NextResponse.json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error('Error creating complaint:', error);
    return errorResponse('INTERNAL_SERVER_ERROR', 'Unable to process resolution case at this time.', 500);
  }
}
