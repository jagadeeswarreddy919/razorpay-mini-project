import prisma from '../db/prisma';

export class MerchantService {
  /**
   * Get merchant transaction dashboard details
   */
  static async getMerchantDashboard(merchantName: string = 'Apollo Emergency Medicine') {
    const merchant = await prisma.merchant.findFirst({
      where: {
        name: {
          contains: merchantName,
        },
      },
    });

    if (!merchant) {
      // Fallback to first merchant
      const fallbackMerchant = await prisma.merchant.findFirst();
      if (!fallbackMerchant) throw new Error('No merchants found in database.');
      return this.getMerchantDashboardById(fallbackMerchant.id);
    }

    return this.getMerchantDashboardById(merchant.id);
  }

  static async getMerchantDashboardById(merchantId: string) {
    const merchant = await prisma.merchant.findUnique({
      where: { id: merchantId },
    });

    if (!merchant) throw new Error('Merchant not found.');

    const payments = await prisma.payment.findMany({
      where: { merchantId },
      include: {
        complaints: true,
        refunds: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    const totalVolume = payments.reduce((acc, p) => acc + p.amount, 0);
    const successfulPayments = payments.filter((p) => p.paymentStatus === 'SUCCESS');
    const failedPayments = payments.filter((p) => p.paymentStatus === 'FAILED');
    const pendingPayments = payments.filter((p) => p.paymentStatus === 'PENDING');
    const refundedPayments = payments.filter((p) => p.paymentStatus === 'REFUNDED');

    return {
      merchant,
      metrics: {
        totalPayments: payments.length,
        totalVolume,
        successfulCount: successfulPayments.length,
        failedCount: failedPayments.length,
        pendingCount: pendingPayments.length,
        refundedCount: refundedPayments.length,
      },
      transactions: payments.map((p) => ({
        id: p.id,
        amount: p.amount,
        currency: p.currency,
        paymentStatus: p.paymentStatus,
        bankDebitStatus: p.bankDebitStatus,
        merchantStatus: p.merchantStatus,
        utr: p.utr,
        orderId: p.orderId,
        createdAt: p.createdAt,
        complaint: p.complaints[0]
          ? {
              acknowledgementNumber: p.complaints[0].acknowledgementNumber,
              status: p.complaints[0].status,
            }
          : null,
      })),
    };
  }
}
