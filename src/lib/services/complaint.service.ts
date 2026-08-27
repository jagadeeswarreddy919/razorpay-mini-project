import prisma from '../db/prisma';
import { PaymentInvestigationService, InvestigationResult } from './payment-investigation.service';

export class ComplaintService {
  /**
   * Generates a unique human-readable acknowledgement number in RX-2026-XXXXXX format
   */
  static async generateAcknowledgementNumber(): Promise<string> {
    let unique = false;
    let ackNumber = '';

    while (!unique) {
      const randomNum = Math.floor(100000 + Math.random() * 900000);
      ackNumber = `RX-2026-${randomNum}`;

      const existing = await prisma.complaint.findUnique({
        where: { acknowledgementNumber: ackNumber },
      });

      if (!existing) {
        unique = true;
      }
    }

    return ackNumber;
  }

  /**
   * Creates an automatic resolution complaint or returns an existing active case (Duplicate Protection)
   */
  static async createOrGetComplaint(paymentId: string, customerId: string) {
    // 1. Fetch payment and verify ownership
    const payment = await prisma.payment.findFirst({
      where: {
        id: paymentId,
        customerId,
      },
      include: {
        merchant: true,
        customer: true,
      },
    });

    if (!payment) {
      return { error: 'PAYMENT_NOT_FOUND', message: 'No payment found for customer.' };
    }

    // 2. Run investigation rule engine
    const investigation: InvestigationResult = PaymentInvestigationService.investigate(payment);

    if (!investigation.resolutionRequired) {
      return {
        resolutionRequired: false,
        investigation,
        message: investigation.reason,
      };
    }

    // 3. Duplicate Complaint Protection: Check for active existing complaint
    const existingComplaint = await prisma.complaint.findFirst({
      where: {
        paymentId,
        customerId,
        status: { not: 'CLOSED' },
      },
      include: {
        payment: { include: { merchant: true } },
        events: { orderBy: { createdAt: 'asc' } },
      },
    });

    if (existingComplaint) {
      return {
        existingCase: true,
        resolutionRequired: true,
        complaint: existingComplaint,
        acknowledgementNumber: existingComplaint.acknowledgementNumber,
        message: 'An active resolution case already exists for this payment.',
      };
    }

    // 4. Generate unique ACK number
    const acknowledgementNumber = await this.generateAcknowledgementNumber();

    // 5. Create Complaint & Timeline Events
    const newComplaint = await prisma.complaint.create({
      data: {
        acknowledgementNumber,
        paymentId: payment.id,
        customerId,
        status: 'INVESTIGATING',
        priority: investigation.priority,
        category: investigation.category,
        reason: investigation.reason,
        events: {
          create: [
            {
              eventType: 'PAYMENT_DETECTED',
              title: 'Payment failure detected',
              description: `Payment attempt of ₹${payment.amount.toLocaleString()} to ${payment.merchant.name} received.`,
            },
            {
              eventType: 'BANK_DEBIT_CONFIRMED',
              title: 'Bank debit confirmed',
              description: `Customer bank debit verified (UTR: ${payment.utr || 'N/A'}).`,
            },
            {
              eventType: 'INVESTIGATION_STARTED',
              title: 'Payment investigation started',
              description: 'ResolveX rules engine triggered automated settlement review.',
            },
            {
              eventType: 'COMPLAINT_CREATED',
              title: 'Resolution case created',
              description: `Case ${acknowledgementNumber} generated for tracking and support routing.`,
            },
          ],
        },
      },
      include: {
        payment: { include: { merchant: true } },
        events: { orderBy: { createdAt: 'asc' } },
      },
    });

    return {
      existingCase: false,
      resolutionRequired: true,
      complaint: newComplaint,
      acknowledgementNumber: newComplaint.acknowledgementNumber,
      message: 'Resolution case created successfully.',
    };
  }

  /**
   * Retrieves complaint by acknowledgement number enforcing customer ownership
   */
  static async getComplaintByAckNumber(acknowledgementNumber: string, customerId: string) {
    return prisma.complaint.findFirst({
      where: {
        acknowledgementNumber: acknowledgementNumber.trim(),
        customerId,
      },
      include: {
        payment: {
          include: {
            merchant: true,
            customer: true,
          },
        },
        events: {
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
    });
  }
}
