import { Payment } from '@prisma/client';

export type ComplaintCategory =
  | 'NONE'
  | 'FAILED_DEBITED'
  | 'PENDING_DEBITED'
  | 'FAILED_NOT_DEBITED'
  | 'PAYMENT_NOT_FOUND'
  | 'OTHER';

export type ComplaintPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface InvestigationResult {
  paymentStatus: string;
  bankDebitStatus: string;
  merchantStatus: string;
  resolutionRequired: boolean;
  category: ComplaintCategory;
  priority: ComplaintPriority;
  reason: string;
  recommendedAction: string;
}

export class PaymentInvestigationService {
  /**
   * Deterministic Rule Engine evaluating Payment state
   */
  static investigate(payment: Payment): InvestigationResult {
    const { paymentStatus, bankDebitStatus, merchantStatus } = payment;

    // RULE 1: SUCCESS + DEBITED + CONFIRMED
    if (
      paymentStatus === 'SUCCESS' &&
      bankDebitStatus === 'DEBITED' &&
      merchantStatus === 'CONFIRMED'
    ) {
      return {
        paymentStatus,
        bankDebitStatus,
        merchantStatus,
        resolutionRequired: false,
        category: 'NONE',
        priority: 'LOW',
        reason: 'Payment completed successfully and merchant confirmed receipt.',
        recommendedAction: 'No dispute resolution action required.',
      };
    }

    // RULE 2: FAILED + DEBITED + NOT_CONFIRMED
    if (
      paymentStatus === 'FAILED' &&
      bankDebitStatus === 'DEBITED' &&
      merchantStatus === 'NOT_CONFIRMED'
    ) {
      return {
        paymentStatus,
        bankDebitStatus,
        merchantStatus,
        resolutionRequired: true,
        category: 'FAILED_DEBITED',
        priority: 'HIGH',
        reason: 'Payment failed while the customer bank debit was confirmed and merchant confirmation was not received.',
        recommendedAction: 'Create a payment resolution case.',
      };
    }

    // RULE 3: PENDING + DEBITED
    if (paymentStatus === 'PENDING' && bankDebitStatus === 'DEBITED') {
      return {
        paymentStatus,
        bankDebitStatus,
        merchantStatus,
        resolutionRequired: true,
        category: 'PENDING_DEBITED',
        priority: 'MEDIUM',
        reason: 'Payment status is pending while bank debit is confirmed.',
        recommendedAction: 'Monitor settlement progress and create tracking case.',
      };
    }

    // RULE 4: FAILED + NOT_DEBITED
    if (paymentStatus === 'FAILED' && bankDebitStatus === 'NOT_DEBITED') {
      return {
        paymentStatus,
        bankDebitStatus,
        merchantStatus,
        resolutionRequired: false,
        category: 'FAILED_NOT_DEBITED',
        priority: 'LOW',
        reason: 'Payment failed and no bank debit was detected.',
        recommendedAction: 'Customer may safely retry transaction if payment is still required.',
      };
    }

    // RULE 5: UNKNOWN / DEFAULT
    return {
      paymentStatus,
      bankDebitStatus,
      merchantStatus,
      resolutionRequired: true,
      category: 'OTHER',
      priority: 'MEDIUM',
      reason: 'Payment state requires further investigation.',
      recommendedAction: 'Initiate resolution case for manual review.',
    };
  }
}
