import { NextRequest, NextResponse } from 'next/server';
import { verifyOtpSchema } from '@/lib/validation/auth';
import { errorResponse } from '@/lib/utils/api-response';
import { setSession } from '@/lib/auth/session';
import prisma from '@/lib/db/prisma';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = verifyOtpSchema.safeParse(body);

    if (!validation.success) {
      const msg = validation.error.errors[0]?.message || 'Invalid phone or OTP format.';
      return errorResponse('INVALID_INPUT', msg, 400);
    }

    const { phoneNumber, otp } = validation.data;

    // Validate against DEMO OTP (123456)
    if (otp !== '123456') {
      return errorResponse(
        'INVALID_OTP',
        'Invalid OTP code. Please use demo verification code 123456.',
        400
      );
    }

    // Find existing customer user or create new demo customer
    let user = await prisma.user.findFirst({
      where: {
        OR: [
          { phoneNumber },
          // Match seeded customer phone format if +91 prefix
          { phoneNumber: phoneNumber.replace('+91', '') },
        ],
      },
      include: {
        customer: true,
      },
    });

    if (!user || !user.customer) {
      // Create user & customer for new phone numbers
      user = await prisma.user.create({
        data: {
          phoneNumber,
          role: 'CUSTOMER',
          customer: {
            create: {
              name: 'Rahul Sharma', // Seeded demo customer name fallback
              phoneNumber,
            },
          },
        },
        include: {
          customer: true,
        },
      });
    }

    const sessionData = {
      userId: user.id,
      customerId: user.customer!.id,
      phoneNumber: user.phoneNumber,
      name: user.customer!.name,
      role: 'CUSTOMER',
    };

    // Set server-side HTTP cookie session
    await setSession(sessionData);

    return NextResponse.json({
      success: true,
      user: sessionData,
    });
  } catch (error) {
    console.error('Error verifying OTP:', error);
    return errorResponse('SERVER_ERROR', 'Failed to verify OTP.', 500);
  }
}
