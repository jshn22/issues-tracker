import React from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';

// Internal click handler component to update coordinates
const ClickHandler = ({ onSelect }) => {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      onSelect([lng, lat]); // geojson order: [lon, lat]
    }
  });
  return null;
};

const MapPicker = ({ initialCoords, onSelect }) => {
  const center = initialCoords ? [initialCoords[1], initialCoords[0]] : [20.5937, 78.9629];
  const zoom = initialCoords ? 13 : 5;

  return (
    <div style={{ height: '300px', width: '100%', marginTop: '1rem' }}>
      <MapContainer center={center} zoom={zoom} style={{ height: '100%', width: '100%' }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <ClickHandler onSelect={onSelect} />
        {initialCoords && (
          <Marker position={[initialCoords[1], initialCoords[0]]} />
        )}
      </MapContainer>
    </div>
  );
};

export default MapPicker;
