import { useEffect, useState } from "react";
import api from "../services/api";
import LocatorMap from "../components/LocatorMap";

type PollingLocation = {
  name: string;
  address: string;
  latitude: number;
  longitude: number;
};

export default function LocatorPage() {
  const [address, setAddress] = useState("");
  const [debouncedAddress, setDebouncedAddress] = useState("");
  const [locations, setLocations] = useState<PollingLocation[]>([]);

  useEffect(() => {
    const handle = setTimeout(() => setDebouncedAddress(address), 300);
    return () => clearTimeout(handle);
  }, [address]);

  const search = async () => {
    const response = await api.post<PollingLocation[]>("/polling/search", { address });
    setLocations(response.data);
  };

  const mapUrl = debouncedAddress
    ? `https://www.google.com/maps/embed/v1/search?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&q=polling%20station%20near%20${encodeURIComponent(debouncedAddress)}`
    : "";

  return (
    <section className="page">
      <h2 className="section-title">Polling Booth Locator</h2>
      <div className="card" style={{ marginBottom: 16 }}>
        <label htmlFor="address">Search by address</label>
        <div style={{ display: "flex", gap: 12, marginTop: 12 }}>
          <input
            id="address"
            value={address}
            onChange={(event) => setAddress(event.target.value)}
            placeholder="Enter your address"
            style={{ flex: 1, padding: 12, borderRadius: 10 }}
          />
          <button className="primary-btn" onClick={search}>Search</button>
        </div>
      </div>
      {mapUrl && <LocatorMap mapUrl={mapUrl} />}
      <div style={{ display: "grid", gap: 16, marginTop: 16 }}>
        {locations.map((location, index) => (
          <div key={index} className="card">
            <h3>{location.name}</h3>
            <p style={{ color: "var(--muted)" }}>{location.address}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
