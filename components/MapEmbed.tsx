interface MapEmbedProps {
  lat: number;
  lng: number;
  address: string;
}

export function MapEmbed({ lat, lng, address }: MapEmbedProps) {
  const mapsKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_EMBED_KEY;
  const hasApiKey = mapsKey && !mapsKey.includes("your_");

  const src = hasApiKey
    ? `https://www.google.com/maps/embed/v1/place?key=${mapsKey}&q=${lat},${lng}&zoom=14`
    : `https://maps.google.com/maps?q=${lat},${lng}&output=embed`;

  return (
    <iframe
      title={`Map showing ${address}`}
      src={src}
      width="100%"
      height={480}
      className="h-[480px] w-full rounded-card border-0 shadow-[0_8px_32px_rgba(0,0,0,0.12)]"
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
      allowFullScreen
    />
  );
}
