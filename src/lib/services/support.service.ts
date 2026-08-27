import prisma from '../db/prisma';

export class SupportService {
  /**
   * Returns Support Dashboard high-level metrics
   */
  static async getSupportMetrics() {
    const totalComplaints = await prisma.complaint.count();
    const openCases = await prisma.complaint.count({
      where: { status: { in: ['OPEN', 'INVESTIGATING', 'RESOLUTION_REQUIRED'] } },
    });
    const highPriority = await prisma.complaint.count({
      where: { priority: { in: ['HIGH', 'CRITICAL'] }, status: { not: 'CLOSED' } },
    });
    const investigating = await prisma.complaint.count({
      where: { status: 'INVESTIGATING' },
    });
    const slaRisk = await prisma.complaint.count({
      where: {
        category: 'FAILED_DEBITED',
        status: { notIn: ['RESOLVED', 'CLOSED'] },
      },
    });
    const resolved = await prisma.complaint.count({
      where: { status: { in: ['RESOLVED', 'CLOSED'] } },
    });

    return {
      totalComplaints,
      openCases,
      highPriority,
      investigating,
      slaRisk,
      resolved,
    };
  }

  /**
   * Fetches the support case queue with filters
   */
  static async getCaseQueue(filter?: string) {
    let whereClause: any = {};

    if (filter === 'HIGH_PRIORITY') {
      whereClause.priority = { in: ['HIGH', 'CRITICAL'] };
    } else if (filter === 'FAILED_DEBITED') {
      whereClause.category = 'FAILED_DEBITED';
    } else if (filter === 'INVESTIGATING') {
      whereClause.status = 'INVESTIGATING';
    } else if (filter === 'RESOLVED') {
      whereClause.status = { in: ['RESOLVED', 'CLOSED'] };
    }

    return prisma.complaint.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      include: {
        customer: true,
        payment: {
          include: { merchant: true },
        },
        assignment: {
          include: { agent: true },
        },
      },
    });
  }

  /**
   * Gets complaint detail by acknowledgement number for support agents
   */
  static async getCaseByAckNumber(acknowledgementNumber: string) {
    return prisma.complaint.findUnique({
      where: { acknowledgementNumber: acknowledgementNumber.trim() },
      include: {
        customer: true,
        payment: {
          include: { merchant: true },
        },
        assignment: {
          include: { agent: true },
        },
        events: {
          orderBy: { createdAt: 'asc' },
        },
        notes: {
          include: { agent: true },
          orderBy: { createdAt: 'desc' },
        },
      },
    });
  }

  /**
   * Assigns a case to a support agent
   */
  static async assignCase(complaintId: string, agentId: string, notes?: string) {
    const agent = await prisma.supportAgent.findUnique({ where: { id: agentId } });
    if (!agent) throw new Error('Agent not found');

    const assignment = await prisma.supportAssignment.upsert({
      where: { complaintId },
      update: {
        agentId,
        status: 'ASSIGNED',
        notes,
        assignedAt: new Date(),
      },
      create: {
        complaintId,
        agentId,
        status: 'ASSIGNED',
        notes,
      },
    });

    // Record ComplaintEvent for audit timeline
    await prisma.complaintEvent.create({
      data: {
        complaintId,
        eventType: 'CASE_ASSIGNED',
        title: `Assigned to ${agent.name}`,
        description: `Case assigned to support lead ${agent.name} (${agent.role}).`,
      },
    });

    return assignment;
  }

  /**
   * Updates complaint status
   */
  static async updateStatus(complaintId: string, agentId: string, newStatus: string) {
    const complaint = await prisma.complaint.update({
      where: { id: complaintId },
      data: {
        status: newStatus,
        resolvedAt: newStatus === 'RESOLVED' || newStatus === 'CLOSED' ? new Date() : null,
      },
    });

    await prisma.complaintEvent.create({
      data: {
        complaintId,
        eventType: 'STATUS_UPDATED',
        title: `Status changed to ${newStatus}`,
        description: `Support agent updated case resolution status to ${newStatus}.`,
      },
    });

    return complaint;
  }

  /**
   * Adds an internal support note
   */
  static async addInternalNote(complaintId: string, agentId: string, note: string) {
    return prisma.supportNote.create({
      data: {
        complaintId,
        agentId,
        note,
        isInternal: true,
      },
      include: { agent: true },
    });
  }

  /**
   * Escalates case priority
   */
  static async escalateCase(complaintId: string, agentId: string, newPriority: string = 'CRITICAL') {
    const complaint = await prisma.complaint.update({
      where: { id: complaintId },
      data: { priority: newPriority },
    });

    await prisma.complaintEvent.create({
      data: {
        complaintId,
        eventType: 'CASE_ESCALATED',
        title: `Case Escalated to ${newPriority}`,
        description: `Support lead escalated resolution priority to ${newPriority}.`,
      },
    });

    return complaint;
  }
}
