export type PaymentStatus = 'SUCCESS' | 'FAILED' | 'PENDING';
export type BankDebitStatus = 'NOT_DEBITED' | 'DEBITED' | 'UNKNOWN';
export type MerchantStatus = 'CONFIRMED' | 'NOT_CONFIRMED' | 'UNKNOWN';
export type UserRole = 'CUSTOMER' | 'MERCHANT' | 'ADMIN';

export interface Customer {
  id: string;
  userId: string;
  name: string;
  phoneNumber: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface Merchant {
  id: string;
  userId: string;
  name: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface Payment {
  id: string;
  customerId: string;
  merchantId: string;
  amount: number;
  currency: string;
  paymentStatus: PaymentStatus;
  bankDebitStatus: BankDebitStatus;
  merchantStatus: MerchantStatus;
  utr: string | null;
  razorpayPaymentId: string | null;
  orderId: string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
  customer?: Customer;
  merchant?: Merchant;
}

export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
}

export interface ApiErrorDetail {
  code: string;
  message: string;
}

export interface ApiErrorResponse {
  success: false;
  error: ApiErrorDetail;
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;
