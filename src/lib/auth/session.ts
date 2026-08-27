import { cookies } from 'next/headers';

export interface SessionData {
  userId: string;
  customerId: string;
  phoneNumber: string;
  name: string;
  role: string;
}

const SESSION_COOKIE_NAME = 'resolvex_session';

/**
 * Encodes session data to a simple base64 token string
 */
export function encodeSession(data: SessionData): string {
  const jsonStr = JSON.stringify(data);
  return Buffer.from(jsonStr).toString('base64');
}

/**
 * Decodes base64 session token string to SessionData
 */
export function decodeSession(token: string): SessionData | null {
  try {
    const jsonStr = Buffer.from(token, 'base64').toString('utf-8');
    return JSON.parse(jsonStr) as SessionData;
  } catch (err) {
    return null;
  }
}

/**
 * Retrieves the current authenticated customer session from request cookies
 */
export async function getSession(): Promise<SessionData | null> {
  const cookieStore = cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME);

  if (!sessionCookie || !sessionCookie.value) {
    return null;
  }

  return decodeSession(sessionCookie.value);
}

/**
 * Sets the authenticated session cookie
 */
export async function setSession(data: SessionData): Promise<void> {
  const token = encodeSession(data);
  const cookieStore = cookies();

  cookieStore.set({
    name: SESSION_COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

/**
 * Clears the session cookie
 */
export async function clearSession(): Promise<void> {
  const cookieStore = cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}
