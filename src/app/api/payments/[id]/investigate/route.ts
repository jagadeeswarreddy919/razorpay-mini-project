import { NextRequest, NextResponse } from 'next/server';
import { PaymentService } from '@/lib/services/payment.service';
import { PaymentInvestigationService } from '@/lib/services/payment-investigation.service';
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
      return errorResponse('UNAUTHORIZED', 'Please login to investigate payment.', 401);
    }

    // Verify payment ownership strictly
    const payment = await PaymentService.getPaymentByIdForCustomer(params.id, session.customerId);

    if (!payment) {
      return errorResponse('PAYMENT_NOT_FOUND', 'No payment was found for the provided identifier.', 404);
    }

    const investigation = PaymentInvestigationService.investigate(payment);

    return successResponse({
      paymentId: payment.id,
      investigation,
    });
  } catch (error) {
    console.error('Error running payment investigation:', error);
    return errorResponse('INTERNAL_SERVER_ERROR', 'Unable to investigate payment at this time.', 500);
  }
}
