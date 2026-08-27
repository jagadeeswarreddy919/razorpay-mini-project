import prisma from '../db/prisma';

export class NotificationService {
  /**
   * Get all notifications for a customer
   */
  static async getCustomerNotifications(customerId: string) {
    return prisma.notification.findMany({
      where: { customerId },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });
  }

  /**
   * Create an in-app notification for a customer
   */
  static async createNotification(
    customerId: string,
    type: 'PAYMENT_FAILED' | 'CASE_CREATED' | 'CASE_UPDATED' | 'REFUND_INITIATED' | 'REFUND_COMPLETED',
    title: string,
    message: string
  ) {
    return prisma.notification.create({
      data: {
        customerId,
        type,
        title,
        message,
        isRead: false,
      },
    });
  }

  /**
   * Mark all notifications as read for a customer
   */
  static async markAllAsRead(customerId: string) {
    return prisma.notification.updateMany({
      where: { customerId, isRead: false },
      data: { isRead: true },
    });
  }
}
