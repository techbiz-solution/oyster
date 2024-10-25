// src/app/menu/page.tsx
'use client'

import Image from "next/image";
import liff from '@line/liff';
import { useEffect } from 'react';

export default function MenuPage() {
  useEffect(() => {
    // Initialize LIFF
    liff.init({ liffId: '2006431561-Rbdl37YN' }).then(() => {
      if (!liff.isInClient()) {
        // If not in the LINE app, don't open the external browser
        return;
      }

      // Open the current window in an external browser to remove the toolbar
      liff.openWindow({
        url: window.location.href, // The current URL
        external: true,            // Set this to true to open in external browser
      });
    });
  }, []);
  const categories = ['All', 'Oyster', 'Box set', 'Drinks'];
  const menuItems = [
    { id: 1, name: 'Seafood Platter', price: 1499, imageUrl: '/images/set1.jpg' },
    { id: 2, name: 'Perless Noires', price: 555, imageUrl: '/images/set2.jpg' },
    { id: 3, name: 'Josephine', price: 999, imageUrl: '/images/set3.jpg' },
    { id: 4, name: 'Gillardeau', price: 2499, imageUrl: '/images/set4.jpg' },
  ];

  // Function to format the price with commas
  const formatPrice = (price: number) => {
      return new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB',
      minimumFractionDigits: 0,
      }).format(price);
  };

  return (
    <main className="min-h-screen bg-blue-100 rounded-l-3xl p-4">
      {/* Search bar */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search"
          className="w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring focus:border-blue-500"
        />
      </div>

      {/* Category section */}
      <div className="mb-4">
        <ul className="flex overflow-x-auto space-x-4">
          {categories.map((category) => (
            <li key={category}>
              <button className="px-4 py-2 text-sm font-semibold text-gray-700 bg-white rounded-full shadow-md hover:bg-gray-200">
                {category}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Menu grid */}
      <div className="grid grid-cols-2 gap-4">
          {menuItems.map((item) => (
          <div key={item.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
              <Image
              src={item.imageUrl}  // Image path from public folder
              alt={item.name}       // Accessible alt text for the image
              width={500}           // Define width for optimization
              height={200}          // Define height for optimization
              className="rounded-lg object-cover"
              />
              <div className="p-4">
              <h2 className="text-lg font-bold text-black">{item.name}</h2>
              <p className="text-black">{formatPrice(item.price)}</p>
              </div>
          </div>
          ))}
      </div>
      </main>
  );
}
