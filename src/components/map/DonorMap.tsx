import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Circle, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface DonorMapProps {
  center: { lat: number; lng: number };
  radiusKm: number;
  donorMarkers: Array<{ lat: number; lng: number; label: string; uid: string }>;
  onMarkerClick?: (uid: string) => void;
}

const bloodGroupColors: Record<string, string> = {
  "A+": "#d32f2f", "A-": "#c62828",
  "B+": "#1976d2", "B-": "#1565c0",
  "AB+": "#7b1fa2", "AB-": "#6a1b9a",
  "O+": "#388e3c", "O-": "#2e7d32",
};

function createIcon(group: string) {
  const color = bloodGroupColors[group] || "#d32f2f";
  return L.divIcon({
    html: `<div style="background:${color};color:white;font-weight:bold;font-size:11px;width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;border:2px solid white;box-shadow:0 1px 4px rgba(0,0,0,0.3)">${group}</div>`,
    className: "bg-transparent",
    iconSize: [28, 28],
    iconAnchor: [14, 14],
  });
}

function CenterUpdater({ center }: { center: { lat: number; lng: number } }) {
  const map = useMap();
  useEffect(() => {
    map.setView([center.lat, center.lng], map.getZoom());
  }, [center.lat, center.lng, map]);
  return null;
}

export default function DonorMap({ center, radiusKm, donorMarkers, onMarkerClick }: DonorMapProps) {
  const userIcon = L.divIcon({
    html: `<div style="background:#2563eb;color:white;font-size:14px;width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;border:3px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.3)">📍</div>`,
    className: "bg-transparent",
    iconSize: [32, 32],
    iconAnchor: [16, 32],
  });

  return (
    <MapContainer
      center={[center.lat, center.lng]}
      zoom={11}
      className="w-full h-80 rounded-xl border border-gray-200 dark:border-gray-700 z-0"
    >
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <CenterUpdater center={center} />

      <Marker position={[center.lat, center.lng]} icon={userIcon} />

      <Circle
        center={[center.lat, center.lng]}
        radius={radiusKm * 1000}
        pathOptions={{ color: "#dc2626", fillColor: "#ef4444", fillOpacity: 0.1, weight: 2 }}
      />

      {donorMarkers.map((d) => (
        <Marker
          key={d.uid}
          position={[d.lat, d.lng]}
          icon={createIcon(d.label)}
          eventHandlers={onMarkerClick ? { click: () => onMarkerClick(d.uid) } : undefined}
        />
      ))}
    </MapContainer>
  );
}
