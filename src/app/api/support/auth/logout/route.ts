import { NextRequest } from 'next/server';
import { clearSupportSession } from '@/lib/auth/support-session';
import { successResponse } from '@/lib/utils/api-response';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  await clearSupportSession();
  return successResponse({ message: 'Support agent logged out successfully.' });
}
