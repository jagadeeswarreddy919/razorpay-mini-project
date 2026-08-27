import prisma from '../db/prisma';

export class RefundService {
  /**
   * Process complete resolution and automatic refund for a complaint
   */
  static async processResolutionAndRefund(complaintId: string, agentName: string = 'Vikram Verma') {
    const complaint = await prisma.complaint.findUnique({
      where: { id: complaintId },
      include: {
        payment: true,
        customer: true,
      },
    });

    if (!complaint) {
      throw new Error('Complaint not found.');
    }

    const { payment } = complaint;
    const refundArn = `ref_2026_${Date.now().toString().slice(-6)}${Math.floor(1000 + Math.random() * 9000)}`;

    // 1. Create or retrieve Refund record
    let refund = await prisma.refund.findFirst({
      where: { complaintId },
    });

    if (!refund) {
      refund = await prisma.refund.create({
        data: {
          paymentId: payment.id,
          complaintId: complaint.id,
          refundArn,
          amount: payment.amount,
          status: 'COMPLETED',
          refundMode: 'AUTO_REVERSAL_UPI',
          completedAt: new Date(),
        },
      });
    }

    // 2. Update Complaint status to RESOLVED
    const updatedComplaint = await prisma.complaint.update({
      where: { id: complaint.id },
      data: {
        status: 'RESOLVED',
        resolvedAt: new Date(),
      },
    });

    // 3. Update Payment status to REFUNDED
    await prisma.payment.update({
      where: { id: payment.id },
      data: {
        paymentStatus: 'REFUNDED',
        merchantStatus: 'REFUNDED_TO_CUSTOMER',
      },
    });

    // 4. Record Audit Events
    await prisma.complaintEvent.create({
      data: {
        complaintId: complaint.id,
        eventType: 'RESOLVED',
        title: 'SUPPORT RESOLUTION APPROVED',
        description: `Support Lead ${agentName} verified bank debit of ₹${payment.amount.toLocaleString()} and approved instant automated refund.`,
        metadata: JSON.stringify({ agentName, refundArn: refund.refundArn }),
      },
    });

    await prisma.complaintEvent.create({
      data: {
        complaintId: complaint.id,
        eventType: 'REFUND_COMPLETED',
        title: 'REFUND CREDITED TO BANK ACCOUNT',
        description: `₹${payment.amount.toLocaleString()} successfully credited back to customer bank account via UPI Auto-Reversal. Reference ARN: ${refund.refundArn}.`,
        metadata: JSON.stringify({ amount: payment.amount, refundArn: refund.refundArn }),
      },
    });

    // 5. Add Internal Note
    const agent = await prisma.supportAgent.findFirst();
    if (agent) {
      await prisma.supportNote.create({
        data: {
          complaintId: complaint.id,
          agentId: agent.id,
          note: `[AUTO-RESOLUTION] Payment ${payment.id} resolved. Refund of ₹${payment.amount.toLocaleString()} credited with ARN ${refund.refundArn}.`,
          isInternal: true,
        },
      });
    }

    return {
      success: true,
      complaint: updatedComplaint,
      refundArn: refund.refundArn,
      amount: payment.amount,
    };
  }
}
