import { NextRequest } from 'next/server';
import { PaymentService } from '@/lib/services/payment.service';
import { getSession } from '@/lib/auth/session';
import { successResponse, errorResponse } from '@/lib/utils/api-response';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();

    if (!session) {
      return errorResponse('UNAUTHORIZED', 'Please login to access your recent transactions.', 401);
    }

    const recentPayments = await PaymentService.getRecentPaymentsForCustomer(session.customerId, 10);
    return successResponse(recentPayments);
  } catch (error) {
    console.error('Error fetching recent payments:', error);
    return errorResponse(
      'INTERNAL_SERVER_ERROR',
      'An unexpected error occurred while fetching recent payments.',
      500
    );
  }
}
