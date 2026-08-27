import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { errorResponse } from '@/lib/utils/api-response';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await getSession();

    if (!session) {
      return errorResponse('UNAUTHORIZED', 'No active session found.', 401);
    }

    return NextResponse.json({
      success: true,
      user: session,
    });
  } catch (error) {
    console.error('Error fetching session:', error);
    return errorResponse('SERVER_ERROR', 'Failed to retrieve session.', 500);
  }
}
