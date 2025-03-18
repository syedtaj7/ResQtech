import React, { useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const MapComponent = () => {
  useEffect(() => {
    const map = L.map("map").setView([20.5937, 78.9629], 5); // Center on India

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(map);

    // Sample Marker (Can be replaced with real API data)
    L.marker([28.7041, 77.1025]).addTo(map).bindPopup("<b>Disaster Alert:</b> New Delhi");

    return () => {
      map.remove(); // Cleanup on component unmount
    };
  }, []);

  return <div id="map" className="h-96 w-full bg-gray-200"></div>;
};

export default MapComponent;
