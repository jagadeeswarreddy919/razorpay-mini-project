import { NextRequest, NextResponse } from 'next/server';
import { verifyOtpSchema, normalizePhoneNumber } from '@/lib/validation/auth';
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

    const fullPhone = normalizePhoneNumber(phoneNumber);
    const cleanPhone = fullPhone.replace('+91', '').trim();

    // 1. Find existing customer user across all phone formats
    let user = await prisma.user.findFirst({
      where: {
        OR: [
          { phoneNumber: fullPhone },
          { phoneNumber: cleanPhone },
          { phoneNumber: `+91${cleanPhone}` },
        ],
      },
      include: {
        customer: true,
      },
    });

    // 2. Handle missing customer profile or new user creation safely
    if (!user) {
      // Create new User and Customer profile
      user = await prisma.user.create({
        data: {
          phoneNumber: fullPhone,
          role: 'CUSTOMER',
          customer: {
            create: {
              name: fullPhone === '+919876543211' ? 'Priya Patel' : fullPhone === '+919876543212' ? 'Ananya Rao' : 'Rahul Sharma',
              phoneNumber: fullPhone,
            },
          },
        },
        include: {
          customer: true,
        },
      });
    } else if (!user.customer) {
      // User exists but customer relation missing — attach Customer record
      const customer = await prisma.customer.create({
        data: {
          userId: user.id,
          name: 'Rahul Sharma',
          phoneNumber: user.phoneNumber,
        },
      });
      user = { ...user, customer };
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
  } catch (error: any) {
    console.error('Error verifying OTP:', error);
    return errorResponse('SERVER_ERROR', error?.message || 'Failed to verify OTP.', 500);
  }
}
