import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { NotificationService } from '@/lib/services/notification.service';
import { errorResponse } from '@/lib/utils/api-response';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session || !session.customerId) {
      return errorResponse('UNAUTHORIZED', 'Customer authentication required.', 401);
    }

    const notifications = await NotificationService.getCustomerNotifications(session.customerId);
    return NextResponse.json({ success: true, data: notifications });
  } catch (error: any) {
    return errorResponse('SERVER_ERROR', error?.message || 'Failed to fetch notifications.', 500);
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session || !session.customerId) {
      return errorResponse('UNAUTHORIZED', 'Customer authentication required.', 401);
    }

    await NotificationService.markAllAsRead(session.customerId);
    return NextResponse.json({ success: true, message: 'Notifications marked as read.' });
  } catch (error: any) {
    return errorResponse('SERVER_ERROR', error?.message || 'Failed to update notifications.', 500);
  }
}
