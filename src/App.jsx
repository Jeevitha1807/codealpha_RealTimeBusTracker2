import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

import L from "leaflet";

// Leaflet icon fix
import iconUrl from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

L.Icon.Default.mergeOptions({
  iconUrl,
  shadowUrl: iconShadow,
});

function App() {
  const [source, setSource] = useState("Chennai");
  const [destination, setDestination] = useState("Coimbatore");

  // City coordinates
  const locations = {
    Chennai: [13.0827, 80.2707],
    Coimbatore: [11.0168, 76.9558],
    Madurai: [9.9252, 78.1198],
    Trichy: [10.7905, 78.7047],
  };

  const [position, setPosition] = useState(locations.Chennai);

  const speed = 55;

  const distances = {
    "Chennai-Coimbatore": 505,
    "Chennai-Madurai": 460,
    "Chennai-Trichy": 330,
    "Coimbatore-Chennai": 505,
    "Coimbatore-Madurai": 215,
    "Coimbatore-Trichy": 220,
    "Madurai-Chennai": 460,
    "Madurai-Coimbatore": 215,
    "Madurai-Trichy": 135,
    "Trichy-Chennai": 330,
    "Trichy-Coimbatore": 220,
    "Trichy-Madurai": 135,
  };

  const distance = distances[`${source}-${destination}`] || 0;
  const eta = distance > 0 ? (distance / speed).toFixed(1) : "N/A";
  const fare = distance;

  const route = `${source} → ${destination}`;

  const arrivalStatus =
    eta === "N/A"
      ? "Select Route"
      : Number(eta) > 5
      ? "🟢 On Time"
      : "🟡 Arriving Soon";

  const dest = locations[destination];

  // 🚍 REALISTIC SMOOTH GPS MOVEMENT (FIXED SPEED)
  useEffect(() => {
    const interval = setInterval(() => {
      setPosition((prev) => {
        const latDiff = dest[0] - prev[0];
        const lngDiff = dest[1] - prev[1];

        // stop when reached
        if (Math.abs(latDiff) < 0.00005 && Math.abs(lngDiff) < 0.00005) {
          return dest;
        }

        return [
          prev[0] + latDiff * 0.008, // 🔥 SLOW REALISTIC SPEED
          prev[1] + lngDiff * 0.008,
        ];
      });
    }, 500); // 🔥 smooth update interval

    return () => clearInterval(interval);
  }, [destination]);

  return (
    <div style={{ padding: "10px", backgroundColor: "#f4f6f9", minHeight: "100vh" }}>

      <h1 style={{
        textAlign: "center",
        backgroundColor: "#007bff",
        color: "white",
        padding: "15px",
        borderRadius: "10px",
      }}>
        🚍 Smart Live GPS Bus Tracking
      </h1>

      {/* Controls */}
      <div style={{
        textAlign: "center",
        backgroundColor: "white",
        padding: "15px",
        borderRadius: "10px",
        marginBottom: "15px",
      }}>
        <label>Source: </label>
        <select value={source} onChange={(e) => setSource(e.target.value)}>
          <option>Chennai</option>
          <option>Coimbatore</option>
          <option>Madurai</option>
          <option>Trichy</option>
        </select>

        <br /><br />

        <label>Destination: </label>
        <select value={destination} onChange={(e) => setDestination(e.target.value)}>
          <option>Chennai</option>
          <option>Coimbatore</option>
          <option>Madurai</option>
          <option>Trichy</option>
        </select>

        <h3>Distance: {distance} km</h3>
        <h3>ETA: {eta} hrs ⏱️</h3>
      </div>

      {/* INFO CARDS */}
      <div style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: "15px",
        marginBottom: "15px",
      }}>

        <div style={cardStyle}><h3>Bus</h3><p>TN 01 AB 1234</p></div>
        <div style={cardStyle}><h3>Speed</h3><p>{speed} km/h</p></div>
        <div style={cardStyle}><h3>Route</h3><p>{route}</p></div>
        <div style={cardStyle}><h3>Fare</h3><p>₹{fare}</p></div>
        <div style={cardStyle}><h3>Status</h3><p>{arrivalStatus}</p></div>

      </div>

      {/* MAP */}
      <MapContainer
        center={position}
        zoom={7}
        style={{ height: "70vh", width: "100%", borderRadius: "10px" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        <Marker position={position}>
          <Popup>🚍 Live Bus Tracking</Popup>
        </Marker>
      </MapContainer>

    </div>
  );
}

const cardStyle = {
  backgroundColor: "white",
  padding: "15px",
  borderRadius: "10px",
  minWidth: "180px",
  textAlign: "center",
};

export default App;
