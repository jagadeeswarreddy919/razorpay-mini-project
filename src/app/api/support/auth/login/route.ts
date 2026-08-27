import { NextRequest } from 'next/server';
import prisma from '@/lib/db/prisma';
import { setSupportSession } from '@/lib/auth/support-session';
import { successResponse, errorResponse } from '@/lib/utils/api-response';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const agentId = body.agentId || 'agent_demo_1001';

    let agent = await prisma.supportAgent.findUnique({
      where: { id: agentId },
    });

    if (!agent) {
      // Fallback: create default demo agent
      agent = await prisma.supportAgent.create({
        data: {
          id: 'agent_demo_1001',
          name: 'Vikram Verma',
          email: 'vikram.verma@resolvex.internal',
          role: 'PRIORITY_SUPPORT_LEAD',
        },
      });
    }

    const sessionData = {
      agentId: agent.id,
      name: agent.name,
      email: agent.email,
      role: agent.role,
    };

    await setSupportSession(sessionData);

    return successResponse({
      agent: sessionData,
      message: 'Support agent authenticated successfully.',
    });
  } catch (error) {
    console.error('Support login error:', error);
    return errorResponse('INTERNAL_SERVER_ERROR', 'Unable to authenticate support agent.', 500);
  }
}
