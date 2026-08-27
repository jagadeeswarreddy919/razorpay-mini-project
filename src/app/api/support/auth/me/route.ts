import { NextRequest } from 'next/server';
import { getSupportSession } from '@/lib/auth/support-session';
import { successResponse, errorResponse } from '@/lib/utils/api-response';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const session = await getSupportSession();

    if (!session) {
      return errorResponse('UNAUTHORIZED', 'No active support agent session found.', 401);
    }

    return successResponse({ agent: session });
  } catch (error) {
    return errorResponse('INTERNAL_SERVER_ERROR', 'Unable to check support session.', 500);
  }
}
