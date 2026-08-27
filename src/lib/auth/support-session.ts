import { cookies } from 'next/headers';

export interface SupportSessionData {
  agentId: string;
  name: string;
  email: string;
  role: string;
}

const SUPPORT_SESSION_COOKIE_NAME = 'resolvex_support_session';

export function encodeSupportSession(data: SupportSessionData): string {
  const jsonString = JSON.stringify(data);
  return Buffer.from(jsonString).toString('base64');
}

export function decodeSupportSession(token: string): SupportSessionData | null {
  try {
    const jsonString = Buffer.from(token, 'base64').toString('utf-8');
    return JSON.parse(jsonString);
  } catch (error) {
    return null;
  }
}

export async function getSupportSession(): Promise<SupportSessionData | null> {
  const cookieStore = cookies();
  const token = cookieStore.get(SUPPORT_SESSION_COOKIE_NAME)?.value;

  if (!token) return null;
  return decodeSupportSession(token);
}

export async function setSupportSession(data: SupportSessionData): Promise<void> {
  const token = encodeSupportSession(data);
  const cookieStore = cookies();

  cookieStore.set(SUPPORT_SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

export async function clearSupportSession(): Promise<void> {
  const cookieStore = cookies();
  cookieStore.delete(SUPPORT_SESSION_COOKIE_NAME);
}
