// src/app/menu/layout.tsx
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
    const [profile, setProfile] = useState<Profile | null>(null); // Store user profile
    const [error, setError] = useState<string | null>(null); // Error state
  
    useEffect(() => {
      // Initialize LIFF and fetch the user's profile
      liff.init({ liffId: '2006431561-Rbdl37YN' })
        .then(() => {
          if (liff.isLoggedIn()) {
            liff.getProfile()
              .then((userProfile) => {
                setProfile(userProfile); // Set the profile in state
              })
              .catch((err) => {
                console.error('Error fetching profile:', err);
                setError('Failed to load profile data.');
              });
          } else {
            liff.login({ redirectUri: window.location.href }); // Trigger login if the user isn't logged in
          }
        })
        .catch((err) => {
          console.error('LIFF initialization failed:', err);
          setError('LIFF initialization failed.');
        });
    }, []); // Only run once when the layout is loaded

    return (
      <section className="min-h-screen bg-white">
        {/* Header with user profile, title, and cart icon */}
        <header className="bg-white fixed top-0 w-full z-10 flex justify-between items-center p-6">
          <div className="flex items-center space-x-4">
            {/* Display the profile picture and display name if available */}
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
          <button className="text-gray-800">
            {/* Cart Icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 3h18l-2 9H5L3 3zM16 13v6H8v-6m4-4V4"
              />
            </svg>
          </button>
        </header>
  
        {/* Content will be injected here */}
        <main className="pt-24">
          {error && <p className="text-red-500 text-center">{error}</p>}
          {children}
        </main>
      </section>
    );
  }