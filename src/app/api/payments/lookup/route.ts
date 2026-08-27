import { NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';
import { PaymentService } from '@/lib/services/payment.service';
import { paymentLookupSchema } from '@/lib/validation/payment';
import { successResponse, errorResponse } from '@/lib/utils/api-response';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const rawIdentifier = searchParams.get('identifier');

    const validation = paymentLookupSchema.safeParse({ identifier: rawIdentifier });

    if (!validation.success) {
      return errorResponse(
        'INVALID_IDENTIFIER',
        'Please provide a valid UTR, Payment ID, or Order ID.',
        400
      );
    }

    const { identifier } = validation.data;
    const payment = await PaymentService.findPaymentByIdentifier(identifier);

    if (!payment) {
      return errorResponse(
        'PAYMENT_NOT_FOUND',
        'No payment was found for the provided identifier.',
        404
      );
    }

    return successResponse(payment);
  } catch (error) {
    console.error('Error during payment lookup:', error);
    return errorResponse(
      'INTERNAL_SERVER_ERROR',
      'An unexpected error occurred during payment lookup.',
      500
    );
  }
}
