import { NextRequest } from 'next/server';
import { SupportService } from '@/lib/services/support.service';
import { RefundService } from '@/lib/services/refund.service';
import { getSupportSession } from '@/lib/auth/support-session';
import { successResponse, errorResponse } from '@/lib/utils/api-response';

export const dynamic = 'force-dynamic';

export async function POST(
  request: NextRequest,
  { params }: { params: { acknowledgementNumber: string } }
) {
  try {
    const session = await getSupportSession();

    if (!session) {
      return errorResponse('UNAUTHORIZED', 'Access denied. Support agent session required.', 401);
    }

    const complaint = await SupportService.getCaseByAckNumber(params.acknowledgementNumber);

    if (!complaint) {
      return errorResponse('CASE_NOT_FOUND', 'Support case not found.', 404);
    }

    const body = await request.json();
    const { action, status, note, priority } = body;

    if (action === 'assign') {
      const assignment = await SupportService.assignCase(complaint.id, session.agentId, note);
      return successResponse({ assignment, message: `Case assigned to ${session.name}.` });
    }

    if (action === 'update_status') {
      if (!status) return errorResponse('INVALID_INPUT', 'Status is required.', 400);

      if (status === 'RESOLVED') {
        const result = await RefundService.processResolutionAndRefund(complaint.id, session.name);
        return successResponse({
          complaint: result.complaint,
          refundArn: result.refundArn,
          message: `Case RESOLVED & Refund of ₹${result.amount.toLocaleString()} processed successfully. ARN: ${result.refundArn}`,
        });
      }

      const updated = await SupportService.updateStatus(complaint.id, session.agentId, status);
      return successResponse({ complaint: updated, message: `Status updated to ${status}.` });
    }

    if (action === 'add_note') {
      if (!note) return errorResponse('INVALID_INPUT', 'Note content is required.', 400);
      const newNote = await SupportService.addInternalNote(complaint.id, session.agentId, note);
      return successResponse({ note: newNote, message: 'Internal note saved.' });
    }

    if (action === 'escalate') {
      const updated = await SupportService.escalateCase(complaint.id, session.agentId, priority || 'CRITICAL');
      return successResponse({ complaint: updated, message: `Case escalated to ${priority || 'CRITICAL'}.` });
    }

    return errorResponse('INVALID_ACTION', 'Unsupported support action.', 400);
  } catch (error) {
    console.error('Error executing support case action:', error);
    return errorResponse('INTERNAL_SERVER_ERROR', 'Unable to perform support action.', 500);
  }
}
