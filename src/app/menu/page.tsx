'use client';

import Image from 'next/image';
import liff from '@line/liff';
import { useEffect, useState } from 'react';

export default function MenuPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('Starting LIFF initialization...');
    
    const alreadyOpened = sessionStorage.getItem('openedInBrowser');
    if (alreadyOpened) {
      console.log('Already opened in browser, skipping liff.openWindow()');
      setLoading(false);
      return;
    }

    liff.init({ liffId: '2006431561-Rbdl37YN' })
      .then(() => {
        console.log('LIFF initialized successfully');
        if (liff.isInClient()) {
          console.log('Inside LINE client, opening in external browser...');
          
          liff.openWindow({
            url: window.location.href, // The current URL
            external: true,            // Open in external browser
          });

          // Mark this session to prevent infinite looping
          sessionStorage.setItem('openedInBrowser', 'true');
        } else {
          console.log('Not inside LINE client, staying in current window');
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('LIFF initialization failed:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  const categories = ['All', 'Oyster', 'Box set', 'Drinks'];
  const menuItems = [
    { id: 1, name: 'Seafood Platter', price: 1499, imageUrl: '/images/set1.jpg' },
    { id: 2, name: 'Perless Noires', price: 555, imageUrl: '/images/set2.jpg' },
    { id: 3, name: 'Josephine', price: 999, imageUrl: '/images/set3.jpg' },
    { id: 4, name: 'Gillardeau', price: 2499, imageUrl: '/images/set4.jpg' },
  ];

  const formatPrice = (price: number) => {
      return new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB',
      minimumFractionDigits: 0,
      }).format(price);
  };

  return (
    <main className="min-h-screen bg-blue-100 rounded-l-3xl p-4">
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search"
          className="w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring focus:border-blue-500"
        />
      </div>

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

      <div className="grid grid-cols-2 gap-4">
          {menuItems.map((item) => (
          <div key={item.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
              <Image
              src={item.imageUrl}
              alt={item.name}
              width={500}
              height={200}
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
