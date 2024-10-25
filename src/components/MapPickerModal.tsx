import { useState, useEffect } from 'react';

declare global {
  interface Window {
    initMap: () => void;
  }
}

interface MapPickerModalProps {
  onClose: () => void;
  onSaveLocation: (lat: number, lng: number) => void;  // Pass latitude and longitude
}

export default function MapPickerModal({ onClose, onSaveLocation }: MapPickerModalProps) {
  const [marker, setMarker] = useState<google.maps.Marker | null>(null);

  useEffect(() => {
    const initMap = () => {
      const defaultLocation = { lat: 13.7563, lng: 100.5018 }; // Fallback location: Bangkok

      const mapInstance = new google.maps.Map(document.getElementById('map') as HTMLElement, {
        center: defaultLocation,
        zoom: 12,
      });

      const markerInstance = new google.maps.Marker({
        position: defaultLocation,
        map: mapInstance,
        draggable: true,
      });

      setMarker(markerInstance);

      // Try to get user's current location
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const userLocation = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            };
            mapInstance.setCenter(userLocation);
            markerInstance.setPosition(userLocation);
          },
          () => {
            console.log('Geolocation failed. Using default location.');
          }
        );
      }
    };

    // Check if Google Maps script is already loaded
    if (!document.querySelector(`script[src*="maps.googleapis.com"]`)) {
      const googleScript = document.createElement('script');
      googleScript.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyDtNVlJ3Pl6cvZsAklr_4_g71D9whgEoOQ&callback=initMap`;
      googleScript.async = true;
      googleScript.defer = true;
      window.initMap = initMap;  // Attach initMap to window
      document.head.appendChild(googleScript);
    } else {
      // If script is already loaded, directly call initMap
      initMap();
    }

    // Cleanup script on component unmount
    return () => {
      const scriptElement = document.querySelector(`script[src*="maps.googleapis.com"]`);
      if (scriptElement) {
        document.head.removeChild(scriptElement);
      }
    };
  }, []);

  const saveLocation = () => {
    if (marker) {
      const position = marker.getPosition();
      if (position) {
        onSaveLocation(position.lat(), position.lng());  // Pass back the latitude and longitude
      }
    }
    onClose(); // Close the modal
  };

  return (
    <div className="fixed inset-0 z-20 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white w-4/5 h-4/5 p-4 relative">
        <h2 className="text-lg font-semibold mb-4">Select Your Location</h2>
        <div id="map" className="w-full h-full"></div>

        <button
          className="absolute bottom-4 right-4 px-4 py-2 bg-blue-500 text-white rounded"
          onClick={saveLocation}
        >
          Save Location
        </button>

        <button
          className="absolute top-4 right-4 text-red-500"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
}
