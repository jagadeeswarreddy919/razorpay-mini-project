import { z } from 'zod';

export function normalizePhoneNumber(phone: string): string {
  const digitsOnly = phone.replace(/\D/g, '');

  if (digitsOnly.length === 10) {
    return `+91${digitsOnly}`;
  }

  if (digitsOnly.length === 12 && digitsOnly.startsWith('91')) {
    return `+${digitsOnly}`;
  }

  return phone.trim();
}

export const sendOtpSchema = z.object({
  phoneNumber: z
    .string({
      required_error: 'Phone number is required',
    })
    .trim()
    .transform((val) => normalizePhoneNumber(val))
    .refine((val) => /^\+91[6-9]\d{9}$/.test(val), {
      message: 'Enter a valid 10-digit mobile number.',
    }),
});

export const verifyOtpSchema = z.object({
  phoneNumber: z
    .string({
      required_error: 'Phone number is required',
    })
    .trim()
    .transform((val) => normalizePhoneNumber(val))
    .refine((val) => /^\+91[6-9]\d{9}$/.test(val), {
      message: 'Enter a valid 10-digit mobile number.',
    }),
  otp: z
    .string({
      required_error: 'OTP is required',
    })
    .trim()
    .length(6, 'Please enter a 6-digit OTP code.'),
});
