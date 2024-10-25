'use client';

import React, { useEffect, useState } from 'react';
import { APIProvider } from '@vis.gl/react-google-maps';

export default function MapPage() {
    const [userLocation, setUserLocation] = useState<{ lat: number, lng: number } | null>(null);
    const [map, setMap] = useState<google.maps.Map | null>(null);
    const [marker, setMarker] = useState<google.maps.Marker | null>(null);

    // Get the user's current location using the Geolocation API
    useEffect(() => {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const { latitude, longitude } = position.coords;
              setUserLocation({ lat: latitude, lng: longitude });
            },
            (error) => {
              console.error('Error fetching geolocation:', error);
            }
          );
        } else {
          console.error('Geolocation is not supported by this browser.');
        }
    }, []);

    // Initialize the map and marker when user location is available
    useEffect(() => {
        if (window.google && userLocation) {
            // Initialize the map
            const mapInstance = new google.maps.Map(document.getElementById('map') as HTMLElement, {
                center: userLocation,
                zoom: 20,
                mapId: '56685e799b75061c', // Replace with your mapId
                disableDefaultUI: true,
            });
            setMap(mapInstance);

            // Create and set the marker at the user's location
            const markerInstance = new google.maps.Marker({
                position: userLocation,
                map: mapInstance,
                animation: google.maps.Animation.BOUNCE, // Add bounce animation
                icon: {
                    url: "https://static.thenounproject.com/png/921030-200.png",
                scaledSize: new google.maps.Size(50,50)},
                draggable: true,

            });
            setMarker(markerInstance);
        }
    }, [userLocation]);

    // Add the click listener for moving the marker to clicked location
    useEffect(() => {
        if (map && marker) {
            const listener = map.addListener('click', (event: google.maps.MapMouseEvent) => {
                if (event.latLng) {
                    marker.setPosition(event.latLng); // Move marker to clicked location
                    map.panTo(event.latLng); // Pan the map to the new marker location
                }
            });

            // Clean up the listener when the component is unmounted
            return () => {
                google.maps.event.removeListener(listener);
            };
        }
    }, [map, marker]);

    return (
        <APIProvider apiKey={'AIzaSyDtNVlJ3Pl6cvZsAklr_4_g71D9whgEoOQ'}>
            <h1 className="text-2xl font-bold mb-4">Google map training</h1>

            <div id="map" style={{ height: '500px', width: '100%' }} />
        </APIProvider>
    );
}
