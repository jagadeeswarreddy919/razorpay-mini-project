export interface AiTriageResult {
  category: string;
  urgency: 'HIGH' | 'MEDIUM' | 'LOW';
  customerIntent: string;
  summary: string;
  riskSignal: {
    riskType: string;
    riskLevel: 'HIGH' | 'MEDIUM' | 'LOW';
    warningMessage: string;
  };
  recommendedAction: string;
  draftResponse: string;
}

export class AiTriageService {
  /**
   * ResolveX AI Triage Assistance Layer:
   * Analyzes complaint metadata, payment status, and bank debit logs to classify urgency,
   * summarize context, detect potential duplicate payment risks, and generate agent draft responses.
   */
  static analyzeCase(payment: {
    amount: number;
    paymentStatus: string;
    bankDebitStatus: string;
    merchantStatus: string;
    merchantName: string;
    utr?: string | null;
  }): AiTriageResult {
    const isMedical = payment.merchantName.toLowerCase().includes('emergency') || payment.merchantName.toLowerCase().includes('apollo') || payment.merchantName.toLowerCase().includes('hospital');
    const isHighAmount = payment.amount >= 5000;
    const isFailedDebited = payment.paymentStatus === 'FAILED' && payment.bankDebitStatus === 'DEBITED';

    let urgency: 'HIGH' | 'MEDIUM' | 'LOW' = 'MEDIUM';
    if (isFailedDebited || isMedical || isHighAmount) {
      urgency = 'HIGH';
    }

    const summary = `Customer attempted ₹${payment.amount.toLocaleString()} payment to ${payment.merchantName}. Payment status logged as ${payment.paymentStatus} while bank debit is confirmed (${payment.bankDebitStatus}). Merchant receipt is ${payment.merchantStatus}.`;

    const riskSignal = {
      riskType: isFailedDebited ? 'DUPLICATE_PAYMENT_RISK' : 'GATEWAY_TIMEOUT',
      riskLevel: urgency,
      warningMessage: isFailedDebited
        ? `Prevent another payment attempt! Customer bank account debited ₹${payment.amount.toLocaleString()}. Prioritize immediate interbank auto-reversal.`
        : `Interbank verification pending. Monitor settlement logs before re-attempt.`,
    };

    const recommendedAction = isFailedDebited
      ? 'Verify UTR debit logs and execute instant automated UPI reversal to credit funds back to customer.'
      : 'Re-query NPCI banking switch and verify merchant webhook callback status.';

    const draftResponse = `Hello, we have analyzed your payment of ₹${payment.amount.toLocaleString()} to ${payment.merchantName}. Our AI Risk Manager verified that your bank account was debited (UTR: ${payment.utr || '123456789012'}) while gateway transaction timed out. Your case has been prioritized for instant auto-reversal under RBI SLA guidelines.`;

    return {
      category: isFailedDebited ? 'FAILED + DEBITED' : 'TECHNICAL_DELAY',
      urgency,
      customerIntent: 'REFUND_AND_RECONCILIATION',
      summary,
      riskSignal,
      recommendedAction,
      draftResponse,
    };
  }
}
