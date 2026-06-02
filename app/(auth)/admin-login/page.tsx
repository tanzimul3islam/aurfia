// app/admin/create-super-admin/page.tsx
'use client';

import { superAdminLogin } from '@/actions/auth/superAdminLogin';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function LoginInSuperAdminPage() {
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  async function handleSubmit(formData: FormData) {
    try {
        const res = await superAdminLogin(formData);

        if(res.isOk) {
            setSuccess(true);
            router.push('/admin-login/create-admin');
        }
    } catch (error: any) {
        setError(error.message);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-6 text-center">LogIn As Super Admin</h1>

        <form action={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              type="text"
              name="userName"
              id="username"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black sm:text-sm"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 bg-black text-white font-medium rounded-md hover:opacity-90"
          >
            Create Super Admin
          </button>
        </form>

        {success && <p className="mt-4 text-green-600 text-sm text-center">Super admin created!</p>}
        {error && <p className="mt-4 text-red-600 text-sm text-center">{error}</p>}
      </div>
    </div>
  )
}
