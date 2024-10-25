'use client';

import { useEffect, useState } from 'react';
import liff from '@line/liff';
import MapPickerModal from '@/components/MapPickerModal';

// Define the type for the user profile
interface Profile {
  displayName: string;
  userId: string;
  pictureUrl?: string;
}

export default function MenuLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isMapPickerOpen, setIsMapPickerOpen] = useState(false); // To control modal state
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null); // Store selected location

  useEffect(() => {
    // Initialize LIFF and fetch the user's profile
    liff.init({ liffId: '2006431561-Rbdl37YN' })
      .then(() => {
        if (liff.isLoggedIn()) {
          liff.getProfile()
            .then((userProfile) => {
              setProfile(userProfile);
            })
            .catch((err) => {
              console.error('Error fetching profile:', err);
              setError('Failed to load profile data.');
            });
        } else {
          liff.login(); // Trigger login if the user isn't logged in
        }
      })
      .catch((err) => {
        console.error('LIFF initialization failed:', err);
        setError('LIFF initialization failed.');
      });
  }, []);

  // Handle the "Save Location" from MapPickerModal
  const handleSaveLocation = (lat: number, lng: number) => {
    setLocation({ lat, lng });
    setIsMapPickerOpen(false); // Close the modal
  };

  return (
    <section className="min-h-screen bg-white">
      {/* Header with user profile and Get Location button */}
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

        {/* Change flex direction to column for button and location display */}
        <div className="flex flex-col items-center space-y-2">
          {/* Get Location button */}
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded"
            onClick={() => setIsMapPickerOpen(true)} // Open the modal
          >
            Get Location
          </button>

          {/* Show the selected location below the button, if available */}
          {location && (
            <p className="text-sm text-gray-600">
              Location: {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
            </p>
          )}
        </div>
      </header>


      {/* Content will be injected here */}
      <main className="pt-24">
        {error && <p className="text-red-500 text-center">{error}</p>}
        {children}
      </main>

      {/* Map Picker Modal */}
      {isMapPickerOpen && (
        <MapPickerModal
          onClose={() => setIsMapPickerOpen(false)}
          onSaveLocation={handleSaveLocation} // Handle saving the location
        />
      )}
    </section>
  );
}
