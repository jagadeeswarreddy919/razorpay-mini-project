import { NextRequest } from 'next/server';
import { ComplaintService } from '@/lib/services/complaint.service';
import { getSession } from '@/lib/auth/session';
import { successResponse, errorResponse } from '@/lib/utils/api-response';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: { acknowledgementNumber: string } }
) {
  try {
    const session = await getSession();

    if (!session) {
      return errorResponse('UNAUTHORIZED', 'Please login to view resolution case details.', 401);
    }

    const ackNumber = params.acknowledgementNumber;
    const complaint = await ComplaintService.getComplaintByAckNumber(ackNumber, session.customerId);

    if (!complaint) {
      return errorResponse('COMPLAINT_NOT_FOUND', 'No active resolution case found for this acknowledgement number.', 404);
    }

    return successResponse(complaint);
  } catch (error) {
    console.error('Error fetching complaint details:', error);
    return errorResponse('INTERNAL_SERVER_ERROR', 'Unable to retrieve case details.', 500);
  }
}
