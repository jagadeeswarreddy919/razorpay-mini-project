import prisma from '../db/prisma';

export class AuditService {
  /**
   * Log a security or business action in the audit log
   */
  static async log(
    actor: string,
    action: 'LOGIN' | 'PAYMENT_VIEWED' | 'PAYMENT_INVESTIGATED' | 'CASE_CREATED' | 'CASE_ASSIGNED' | 'CASE_UPDATED' | 'CASE_ESCALATED' | 'REFUND_INITIATED' | 'REFUND_COMPLETED' | 'CASE_RESOLVED',
    entity: 'Payment' | 'Complaint' | 'Refund' | 'User',
    entityId?: string,
    metadata?: string
  ) {
    return prisma.auditLog.create({
      data: {
        actor,
        action,
        entity,
        entityId,
        metadata,
      },
    });
  }

  /**
   * Fetch recent audit logs for operations monitoring
   */
  static async getRecentLogs(limit: number = 30) {
    return prisma.auditLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }
}
