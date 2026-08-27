import prisma from '../db/prisma';

export interface CreateMessageInput {
  acknowledgementNumber: string;
  senderType: 'CUSTOMER' | 'SUPPORT_AGENT';
  senderName: string;
  message: string;
}

export class ChatService {
  /**
   * Get all chat messages for a complaint case by ACK number
   */
  static async getMessages(acknowledgementNumber: string) {
    const complaint = await prisma.complaint.findUnique({
      where: { acknowledgementNumber },
    });

    if (!complaint) return [];

    return prisma.supportMessage.findMany({
      where: { complaintId: complaint.id },
      orderBy: { createdAt: 'asc' },
    });
  }

  /**
   * Send a new message in a complaint conversation
   */
  static async sendMessage(input: CreateMessageInput) {
    const complaint = await prisma.complaint.findUnique({
      where: { acknowledgementNumber: input.acknowledgementNumber },
    });

    if (!complaint) {
      throw new Error(`Complaint case ${input.acknowledgementNumber} not found.`);
    }

    const newMessage = await prisma.supportMessage.create({
      data: {
        complaintId: complaint.id,
        senderType: input.senderType,
        senderName: input.senderName,
        message: input.message.trim(),
      },
    });

    // Record audit event
    await prisma.complaintEvent.create({
      data: {
        complaintId: complaint.id,
        eventType: 'SUPPORT_MESSAGE',
        title: input.senderType === 'CUSTOMER' ? 'Customer message received' : 'Support response sent',
        description: `${input.senderName}: "${input.message.substring(0, 80)}${input.message.length > 80 ? '...' : ''}"`,
      },
    });

    return newMessage;
  }
}
