import { NextRequest, NextResponse } from 'next/server';
import { sendOtpSchema } from '@/lib/validation/auth';
import { errorResponse } from '@/lib/utils/api-response';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = sendOtpSchema.safeParse(body);

    if (!validation.success) {
      const msg = validation.error.errors[0]?.message || 'Enter a valid 10-digit mobile number.';
      return errorResponse('INVALID_INPUT', msg, 400);
    }

    const normalizedPhone = validation.data.phoneNumber;

    // Demo Mode Notice & Response
    return NextResponse.json({
      success: true,
      message: `OTP sent successfully to ${normalizedPhone}.`,
      demoMode: true,
      demoOtp: '123456',
    });
  } catch (error) {
    console.error('Error sending OTP:', error);
    return errorResponse('SERVER_ERROR', 'Failed to send OTP code.', 500);
  }
}
