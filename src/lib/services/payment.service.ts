import prisma from '../db/prisma';

export class PaymentService {
  /**
   * Retrieve recent payments ordered by creation date descending
   * Includes customer and merchant relation data
   */
  static async getRecentPayments(limit: number = 20) {
    return prisma.payment.findMany({
      take: limit,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        customer: true,
        merchant: true,
      },
    });
  }

  /**
   * Retrieve recent payments strictly scoped to a specific customer ID
   */
  static async getRecentPaymentsForCustomer(customerId: string, limit: number = 10) {
    return prisma.payment.findMany({
      where: {
        customerId,
      },
      take: limit,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        customer: true,
        merchant: true,
      },
    });
  }

  /**
   * Find a single payment by its primary database ID
   */
  static async getPaymentById(id: string) {
    return prisma.payment.findUnique({
      where: { id },
      include: {
        customer: true,
        merchant: true,
      },
    });
  }

  /**
   * Find a single payment by ID strictly verifying customer ownership
   */
  static async getPaymentByIdForCustomer(id: string, customerId: string) {
    return prisma.payment.findFirst({
      where: {
        id,
        customerId,
      },
      include: {
        customer: true,
        merchant: true,
      },
    });
  }

  /**
   * Search for a payment by identifier: UTR, Razorpay Payment ID, or Order ID
   */
  static async findPaymentByIdentifier(identifier: string) {
    const trimmed = identifier.trim();

    // 1. Direct ACK Number lookup (e.g. RX-2026-001847)
    if (trimmed.toUpperCase().startsWith('RX-')) {
      const complaint = await prisma.complaint.findUnique({
        where: { acknowledgementNumber: trimmed },
        include: {
          payment: {
            include: {
              customer: true,
              merchant: true,
            },
          },
        },
      });
      if (complaint) return complaint.payment;
    }

    // 2. Lookup by UTR, Razorpay Payment ID, or Order ID
    return prisma.payment.findFirst({
      where: {
        OR: [
          { utr: trimmed },
          { razorpayPaymentId: trimmed },
          { orderId: trimmed },
        ],
      },
      include: {
        customer: true,
        merchant: true,
      },
    });
  }
}
