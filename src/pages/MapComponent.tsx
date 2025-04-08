import { useEffect, useState } from "react";
import { LatLngExpression } from 'leaflet';
import MarkerIcon from './MarkerIcon'
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

interface MapComponentProps {
  city: string;
  position:[number, number] | null;
}

const API_KEY = import.meta.env.VITE_SUPABASE_API_KEY;

const center: LatLngExpression = [48.8566, 2.3522]; // Paris

export default function MapComponent({ city }: MapComponentProps) {
  const [position, setPosition] = useState<[number, number] | null>(null);

  useEffect(() => {
    async function fetchCoordinates() {
      if (!city) return;
      
      try {
        const response = await fetch(
          `https://api.opencagedata.com/geocode/v1/json?q=${city}&key=${API_KEY}`
        );
        const data = await response.json();
        console.log(data)
        if (data && data.results && data.results.length > 0) {
          // Sélectionner la première coordonnée pour la ville, en prenant en compte le contexte
          const cityResult = data.results.find((result: { components: { type: string } }) => result.components.type === "city" || result.components.type === "town");
          if (cityResult && cityResult.geometry) {
            const { lat, lng } = cityResult.geometry;
            setPosition([lat, lng]);
            console.log('Résultat de la recherche:', cityResult)
          } else if (data.results[0].geometry){
            const { lat, lng } = data.results[0].geometry;
            setPosition([lat, lng]);
            console.log('Résultat de la recherche:', data.results[0].geometry)
          } else {
            console.error("Coordonnées introuvables pour la ville :", city);
          }
        } else {
            console.error("Coordonnées introuvables pour la ville :", city);
        }
      } catch (error) {
        console.error("Erreur de géocodage :", error);
      }
    }
    fetchCoordinates();
  }, [city]);

  if (!position) return <p className="text-gray-500">Carte en attente...</p>;
  return (
    <MapContainer center={position} zoom={12} style={{ height: "300px", width: "100%", borderRadius: "8px", zIndex: "0" }}>
      <TileLayer
      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <Marker position={position} icon={MarkerIcon}>
        <Popup>{city}</Popup>
      </Marker>
    </MapContainer>
  );
}
