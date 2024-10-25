'use client';

import { useEffect, useState } from 'react';
import liff from '@line/liff';

interface Profile {
  displayName: string;
  userId: string;
  pictureUrl?: string; // User's profile picture may be optional
}

export default function MenuLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [error, setError] = useState<string | null>(null); // Error state

  useEffect(() => {
    const initializeLiff = async () => {
      try {
        await liff.init({ liffId: '2006431561-Rbdl37YN' });
        if (liff.isLoggedIn()) {
          const userProfile = await liff.getProfile();
          setProfile(userProfile);
          setIsLoggedIn(true);
        } else {
          liff.login({ redirectUri: window.location.href });
        }
      } catch (err) {
        console.error('LIFF init failed:', err);
        setError('Failed to initialize LIFF.');
      }
    };

    initializeLiff();
  }, []);

  return (
    <section className="min-h-screen bg-white">
      <header className="bg-white fixed top-0 w-full z-10 flex justify-between items-center p-6">
        <div className="flex items-center space-x-4">
          {profile?.pictureUrl ? (
            <img
              src={profile.pictureUrl}
              alt="Profile"
              className="w-10 h-10 rounded-full"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gray-300"></div>
          )}
          <div>
            <p className="text-sm font-semibold text-gray-700">
              {profile?.displayName || 'User'}
            </p>
            <h1 className="text-2xl font-bold text-gray-800">Menu</h1>
          </div>
        </div>
        <button className="text-gray-800">Cart Icon</button>
      </header>

      <main className="pt-24">
        {error && <p className="text-red-500 text-center">{error}</p>}
        {!isLoggedIn && <p>Loading...</p>}
        {children}
      </main>
    </section>
  );
}
