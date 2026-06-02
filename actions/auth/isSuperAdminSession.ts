import crypto from 'crypto';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';


const adminUserName = process.env.SUPER_ADMIN_USER_NAME!;
const adminPassword = process.env.SUPER_ADMIN_USER_PASSWORD!;
const SECRET = process.env.SUPER_ADMIN_TOKEN_SECRET!;

function verifyToken(token: string) {
  const expectedToken = crypto
    .createHmac('sha256', SECRET)
    .update(`${adminUserName}:${adminPassword}`)
    .digest('hex');

  return token === expectedToken;
}

export const isSuperAdminSession = async() => {
  const cookieStore = await cookies()
  const token = cookieStore.get('super_admin_session');
  
  if(!token || !verifyToken(token.value)) {
    return {isLoggedIn: false};
    }
    // console.log(token, verifyToken(token?.value!))

  return {isLoggedIn: true};
};