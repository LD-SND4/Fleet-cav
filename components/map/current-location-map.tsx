"use client";

import { useEffect, useRef, useState } from "react";
import type { Map as LeafletMap } from "leaflet";

import { useLanguage } from "@/components/language-provider";
import languages from "@/locales/languages.json";

type CurrentLocation = {
  latitude: number;
  longitude: number;
};

type MapMessageKey = keyof typeof languages.en.fleetDashboard.map;

export function CurrentLocationMap({
  className = "h-[23rem]",
}: {
  className?: string;
}) {
  const { languageKey } = useLanguage();
  const content = languages[languageKey].fleetDashboard.map;
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const locationLayerRef = useRef<ReturnType<typeof import("leaflet").circleMarker> | null>(null);
  const [location, setLocation] = useState<CurrentLocation | null>(null);
  const [messageKey, setMessageKey] = useState<MapMessageKey>("requestingLocation");

  useEffect(() => {
    let watchId: number | null = null;
    let disposed = false;

    async function setupMap() {
      const L = await import("leaflet");

      if (!mapContainerRef.current || disposed) {
        return;
      }

      const map = L.map(mapContainerRef.current, {
        attributionControl: true,
        zoomControl: true,
      }).setView([0, 0], 2);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors",
        maxZoom: 19,
      }).addTo(map);

      mapRef.current = map;

      if (!navigator.geolocation) {
        setMessageKey("unavailable");
        return;
      }

      watchId = navigator.geolocation.watchPosition(
        (position) => {
          const nextLocation = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };

          setLocation(nextLocation);
          setMessageKey("currentPosition");

          const latLng: [number, number] = [nextLocation.latitude, nextLocation.longitude];
          map.setView(latLng, 14);

          if (locationLayerRef.current) {
            locationLayerRef.current.setLatLng(latLng);
          } else {
            locationLayerRef.current = L.circleMarker(latLng, {
              color: "#ffffff",
              fillColor: "#ef667c",
              fillOpacity: 1,
              radius: 9,
              weight: 4,
            }).addTo(map);
          }
        },
        () => {
          setMessageKey("allowLocation");
        },
        {
          enableHighAccuracy: true,
          maximumAge: 5000,
          timeout: 10000,
        },
      );
    }

    setupMap();

    return () => {
      disposed = true;

      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
      }

      mapRef.current?.remove();
      mapRef.current = null;
      locationLayerRef.current = null;
    };
  }, []);

  return (
    <div className={`relative overflow-hidden rounded-lg border border-[#ece8f1] bg-[#f3f1f6] ${className}`}>
      <div className="h-full w-full" ref={mapContainerRef} />
      <div className="absolute left-4 top-4 max-w-xs rounded-lg bg-white/95 px-4 py-3 shadow-[0_10px_24px_rgba(69,48,107,0.12)]">
        <p className="text-sm font-semibold text-[#2c2933]">{content[messageKey]}</p>
        {location ? (
          <p className="mt-1 text-xs font-semibold text-[#8a8393]">
            {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
          </p>
        ) : null}
      </div>
    </div>
  );
}
