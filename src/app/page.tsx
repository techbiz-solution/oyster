'use client';

import { useEffect, useState } from 'react';
import liff from '@line/liff';

// Define the type for the profile based on the LIFF API
interface Profile {
  displayName: string;
  userId: string;
  pictureUrl?: string;  // Allow pictureUrl to be string or undefined
  statusMessage?: string;  // Optional property
}

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);  // Allow null initially
  const [error, setError] = useState<string | null>(null);  // Error handling

  useEffect(() => {
    const initializeLiff = async () => {
      try {
        await liff.init({ liffId: '2006431561-Rbdl37YN' });
        console.log('LIFF initialized');
        
        if (!liff.isLoggedIn()) {
          liff.login();  // Redirect to LINE login page if not logged in
        } else {
          setIsLoggedIn(true);

          // Get the user's profile data using async/await
          const profileData = await liff.getProfile();
          setProfile(profileData);  // Set the profile in the state
        }
      } catch (err) {
        console.error('LIFF init failed or error fetching profile:', err);
        setError('LIFF initialization or profile fetch failed');
      }
    };

    initializeLiff();  // Run the async function
  }, []);

  // Logout function
  const logout = () => {
    if (liff.isLoggedIn()) {
      liff.logout();  // Log the user out
      window.location.reload();  // Refresh the app to reset the state
    }
  };

  return (
    <main className="flex flex-col h-screen items-center justify-center bg-blue-100 p-4">
      <h1 className="text-4xl font-bold text-blue-800 mb-4">Welcome to LIFF App</h1>

      {error && <p className="text-red-500">{error}</p>}

      {isLoggedIn && profile ? (
        <>
          {/* Conditionally render the profile picture if it exists */}
          {profile.pictureUrl ? (
            <img src={profile.pictureUrl} alt="Profile" className="rounded-full w-24 h-24 mb-4" />
          ) : (
            <div className="w-24 h-24 mb-4 rounded-full bg-gray-200 flex items-center justify-center">
              <span>No Image</span>
            </div>
          )}

          <h2 className="text-2xl font-bold text-blue-600">Hello, {profile.displayName}!</h2>
          <p className="text-blue-600">User ID: {profile.userId}</p>

          {/* Logout button */}
          <button
            onClick={logout}
            className="mt-4 px-4 py-2 bg-red-500 text-white rounded"
          >
            Logout
          </button>
        </>
      ) : (
        <p className="text-blue-800">Logging in...</p>
      )}
    </main>
  );
}
