'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';

export default function DashboardPage() {
  const router = useRouter();
  const { isAuthenticated, user, logout } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/signup');
    }
  }, [router, isAuthenticated]);

  if (!isAuthenticated()) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Welcome to Dashboard</h1>
        <p className="text-gray-600">You have successfully logged in!</p>
        {user && (
          <div className="mt-4 p-4 bg-white rounded-lg shadow">
            <p className="text-sm text-gray-700"><strong>Name:</strong> {user.name}</p>
            <p className="text-sm text-gray-700"><strong>Email:</strong> {user.email}</p>
          </div>
        )}
        <button
          onClick={() => {
            logout();
            router.push('/signup');
          }}
          className="mt-6 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Logout
        </button>
        <p className="text-sm text-gray-500 mt-4">This is a placeholder page. You can create your dashboard here.</p>
      </div>
    </div>
  );
}

