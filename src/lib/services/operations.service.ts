import prisma from '../db/prisma';

export interface OperationsMetrics {
  totalCases: number;
  openCases: number;
  failedDebitedCases: number;
  pendingDebitedCases: number;
  refundProcessingCount: number;
  resolvedCount: number;
  slaBreachedCount: number;
  totalDisputedVolume: number;
  totalRefundedVolume: number;
}

export class OperationsService {
  /**
   * Get system-wide operations metrics & active cases with SLA risk status
   */
  static async getDashboardMetrics(): Promise<{ metrics: OperationsMetrics; cases: any[] }> {
    const allComplaints = await prisma.complaint.findMany({
      include: {
        customer: true,
        payment: {
          include: {
            merchant: true,
          },
        },
        assignment: {
          include: {
            agent: true,
          },
        },
        refunds: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    const openCases = allComplaints.filter((c) => c.status !== 'RESOLVED' && c.status !== 'CLOSED');
    const failedDebitedCases = allComplaints.filter((c) => c.category === 'FAILED_DEBITED' && c.status !== 'RESOLVED');
    const pendingDebitedCases = allComplaints.filter((c) => c.payment.paymentStatus === 'PENDING' && c.payment.bankDebitStatus === 'DEBITED');
    const refundProcessingCount = allComplaints.filter((c) => c.status === 'RESOLUTION_REQUIRED');
    const resolvedCount = allComplaints.filter((c) => c.status === 'RESOLVED');

    const totalDisputedVolume = allComplaints.reduce((acc, curr) => acc + curr.payment.amount, 0);
    const totalRefundedVolume = resolvedCount.reduce((acc, curr) => acc + curr.payment.amount, 0);

    // Map SLA risk status (ON TRACK vs AT RISK) based on prototype time threshold (e.g. > 15 mins)
    const casesWithSla = allComplaints.map((c) => {
      const ageInMinutes = (Date.now() - new Date(c.createdAt).getTime()) / (1000 * 60);
      let slaStatus = 'ON_TRACK';
      if (c.status !== 'RESOLVED' && ageInMinutes > 20) {
        slaStatus = 'AT_RISK';
      }
      return {
        ...c,
        slaStatus,
        ageInMinutes: Math.floor(ageInMinutes),
      };
    });

    const slaBreachedCount = casesWithSla.filter((c) => c.slaStatus === 'AT_RISK').length;

    return {
      metrics: {
        totalCases: allComplaints.length,
        openCases: openCases.length,
        failedDebitedCases: failedDebitedCases.length,
        pendingDebitedCases: pendingDebitedCases.length,
        refundProcessingCount: refundProcessingCount.length,
        resolvedCount: resolvedCount.length,
        slaBreachedCount,
        totalDisputedVolume,
        totalRefundedVolume,
      },
      cases: casesWithSla,
    };
  }
}
