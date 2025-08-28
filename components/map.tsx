"use client";

import dynamic from "next/dynamic";
import { useEffect } from "react";
import { Location } from "@/app/generated/prisma";
import "leaflet/dist/leaflet.css";

// ✅ Dynamic imports (no SSR, avoids `window is not defined`)
const MapContainer = dynamic(
  () => import("react-leaflet").then((m) => m.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((m) => m.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import("react-leaflet").then((m) => m.Marker),
  { ssr: false }
);
const Popup = dynamic(
  () => import("react-leaflet").then((m) => m.Popup),
  { ssr: false }
);

interface MapProps {
  itineraries: Location[];
}

export default function Map({ itineraries }: MapProps) {
  
  useEffect(() => {
    (async () => {
      const L = await import("leaflet");
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });
    })();
  }, []);

  const center: [number, number] =
    itineraries.length > 0
      ? [itineraries[0].lat, itineraries[0].lng]
      : [0, 0];

  return (
    <MapContainer
      center={center}
      zoom={6}
      className="w-full h-[500px] rounded-lg"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.maptiler.com/">MapTiler</a>'
        url={`https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=${process.env.NEXT_PUBLIC_MAPTILER_API_KEY}`}
      />
      {itineraries.map((location, i) => (
        <Marker key={i} position={[location.lat, location.lng]}>
          <Popup>{location.locationTitle}</Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
