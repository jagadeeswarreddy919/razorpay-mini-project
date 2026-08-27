import { NextRequest } from 'next/server';
import { PaymentService } from '@/lib/services/payment.service';
import { paymentIdSchema } from '@/lib/validation/payment';
import { getSession } from '@/lib/auth/session';
import { successResponse, errorResponse } from '@/lib/utils/api-response';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const validation = paymentIdSchema.safeParse(params);
    if (!validation.success) {
      const errorMessage = validation.error.errors[0]?.message || 'Invalid payment ID.';
      return errorResponse('INVALID_IDENTIFIER', errorMessage, 400);
    }

    const session = await getSession();

    if (!session) {
      return errorResponse('UNAUTHORIZED', 'Please login to access transaction details.', 401);
    }

    // Verify payment ownership against session customerId
    const payment = await PaymentService.getPaymentByIdForCustomer(params.id, session.customerId);

    if (!payment) {
      // Do not leak existence of another customer's payment
      return errorResponse(
        'PAYMENT_NOT_FOUND',
        'No payment was found for the provided identifier.',
        404
      );
    }

    return successResponse(payment);
  } catch (error) {
    console.error('Error fetching payment by ID:', error);
    return errorResponse(
      'INTERNAL_SERVER_ERROR',
      'An unexpected error occurred while processing your request.',
      500
    );
  }
}
