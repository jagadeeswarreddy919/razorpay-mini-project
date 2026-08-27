import { NextRequest, NextResponse } from 'next/server';
import { ChatService } from '@/lib/services/chat.service';
import { errorResponse } from '@/lib/utils/api-response';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: { acknowledgementNumber: string } }
) {
  try {
    const ack = params.acknowledgementNumber;
    const messages = await ChatService.getMessages(ack);
    return NextResponse.json({ success: true, data: messages });
  } catch (error: any) {
    return errorResponse('SERVER_ERROR', error?.message || 'Failed to fetch chat messages.', 500);
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { acknowledgementNumber: string } }
) {
  try {
    const ack = params.acknowledgementNumber;
    const body = await request.json();

    if (!body.message || !body.senderType || !body.senderName) {
      return errorResponse('INVALID_INPUT', 'Message, senderType, and senderName are required.', 400);
    }

    const newMessage = await ChatService.sendMessage({
      acknowledgementNumber: ack,
      senderType: body.senderType,
      senderName: body.senderName,
      message: body.message,
    });

    return NextResponse.json({ success: true, data: newMessage });
  } catch (error: any) {
    return errorResponse('SERVER_ERROR', error?.message || 'Failed to send message.', 500);
  }
}
