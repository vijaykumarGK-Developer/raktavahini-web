import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface LocationPickerProps {
  lat: number;
  lng: number;
  onLocationChange: (lat: number, lng: number) => void;
}

const icon = L.divIcon({
  html: "📍",
  className: "text-2xl bg-transparent",
  iconSize: [24, 24],
  iconAnchor: [12, 24],
});

function CenterUpdater({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lng], map.getZoom());
  }, [lat, lng, map]);
  return null;
}

function ClickHandler({ onLocationChange }: { onLocationChange: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onLocationChange(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

export default function LocationPicker({ lat, lng, onLocationChange }: LocationPickerProps) {
  return (
    <div className="space-y-2">
      <MapContainer
        center={[lat, lng]}
        zoom={13}
        className="w-full h-64 rounded-xl border border-gray-200 dark:border-gray-700 z-0"
      >
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <CenterUpdater lat={lat} lng={lng} />
        <ClickHandler onLocationChange={onLocationChange} />
        <Marker position={[lat, lng]} icon={icon} />
      </MapContainer>
      <p className="text-xs text-gray-500 text-center">
        Click on the map to set exact location
      </p>
    </div>
  );
}
