import React, { useRef, useEffect } from 'react';
import maplibregl from 'maplibre-gl';

const MAPTILER_KEY = 'get_your_own_OpIi9ZULNHzrESv6T2vL';

const Map: React.FC = () => {
  const mapContainer = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return; // Ensure the ref is not null

    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: `https://api.maptiler.com/maps/basic-v2/style.json?key=${MAPTILER_KEY}`,
      center: [127.1025, 37.5126], // Starting position [lng, lat]
      zoom: 10, // Starting zoom
      antialias: true,
    });

    // setLngLat([경도, 위도])
    new maplibregl.Marker()
      .setLngLat([127.1025, 37.5126])
      .addTo(map)
      .setDraggable(true);

    map.on('load', () => {
      // Insert the layer beneath any symbol layer.
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const layers: any = map.getStyle().layers;

      let labelLayerId;
      for (let i = 0; i < layers.length; i++) {
        if (layers[i].type === 'symbol' && layers[i].layout['text-field']) {
          labelLayerId = layers[i].id;
          break;
        }
      }

      map.addSource('openmaptiles', {
        url: `https://api.maptiler.com/tiles/v3/tiles.json?key=${MAPTILER_KEY}`,
        type: 'vector',
      });

      map.addLayer(
        {
          id: '3d-buildings',
          source: 'openmaptiles',
          'source-layer': 'building',
          type: 'fill-extrusion',
          minzoom: 15,
          filter: ['!=', ['get', 'hide_3d'], true],
          paint: {
            'fill-extrusion-color': [
              'interpolate',
              ['linear'],
              ['get', 'render_height'],
              0,
              'lightgray',
              200,
              'royalblue',
              400,
              'lightblue',
            ],
            'fill-extrusion-height': [
              'interpolate',
              ['linear'],
              ['zoom'],
              15,
              0,
              16,
              ['get', 'render_height'],
            ],
            'fill-extrusion-base': [
              'case',
              ['>=', ['get', 'zoom'], 16],
              ['get', 'render_min_height'],
              0,
            ],
          },
        },
        labelLayerId
      );
    });

    return () => map.remove();
  }, []);

  return <div ref={mapContainer} style={{ width: '100%', height: '100vh' }} />;
};

export default Map;
