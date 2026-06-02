'use server';
import { cookies } from 'next/headers';
import crypto from 'crypto';

const adminPassword = process.env.SUPER_ADMIN_USER_PASSWORD!;
const adminUserName = process.env.SUPER_ADMIN_USER_NAME!;
const SECRET = process.env.SUPER_ADMIN_TOKEN_SECRET!;

export const superAdminLogin = async (formData: FormData) => {
    const password = formData.get('password');
    const userName = formData.get('userName');
      const cookieStore = await cookies()


    if(!userName || !password || typeof password !== 'string' || typeof userName !== 'string') {
        throw new Error("INVALID FORM SUBMISSION");
    }

    if(password !== adminPassword || userName !== adminUserName) {
        throw new Error("WRONG USERNAME OR PASSWORD");
    }

    const token = crypto
    .createHmac('sha256', SECRET)
    .update(`${userName}:${password}`)
    .digest('hex');

    cookieStore.set({
    name: 'super_admin_session',
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: 60 * 60 * 24, // 1 day
  });

    

    return {isOk: true};
};