import { NextResponse } from 'next/server';
import { ApiResponse } from '@/types/payment';

export function successResponse<T>(data: T, status: number = 200) {
  const responseBody: ApiResponse<T> = {
    success: true,
    data,
  };
  return NextResponse.json(responseBody, { status });
}

export function errorResponse(
  code: string,
  message: string,
  status: number = 400
) {
  const responseBody: ApiResponse<never> = {
    success: false,
    error: {
      code,
      message,
    },
  };
  return NextResponse.json(responseBody, { status });
}
