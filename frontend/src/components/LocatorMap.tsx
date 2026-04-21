type LocatorMapProps = {
  mapUrl: string;
};

export default function LocatorMap({ mapUrl }: LocatorMapProps) {
  return (
    <div className="card">
      <iframe
        title="Polling booth map"
        src={mapUrl}
        style={{ width: "100%", height: 360, border: "none", borderRadius: 12 }}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  );
}
