import React, { useRef, useEffect } from 'react';
import maplibregl from 'maplibre-gl';

const MAPTILER_KEY = 'get_your_own_OpIi9ZULNHzrESv6T2vL';

// 시작 및 종료 좌표 설정 (위도, 경도)
const start = [127.1025, 37.5126]; // 시작 좌표 [경도, 위도]
const end = [127.1125, 37.5226]; // 종료 좌표 [경도, 위도]

// GeoJSON 소스 초기화
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const point: GeoJSON.FeatureCollection<GeoJSON.Point> = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: start,
      },
      properties: {}, // 추가 속성
    },
  ],
};

const Map: React.FC = () => {
  const mapContainer = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return; // Ensure the ref is not null

    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: `https://api.maptiler.com/maps/basic-v2/style.json?key=${MAPTILER_KEY}`,
      center: [127.1025, 37.5126], // Starting position [lng, lat]
      zoom: 12, // Starting zoom
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

      // GeoJSON 소스 추가
      map.addSource('point', {
        type: 'geojson',
        data: point,
      });

      // 레이어 추가
      map.addLayer({
        id: 'point',
        source: 'point',
        type: 'circle',
        paint: {
          'circle-radius': 10,
          'circle-color': '#007cbf',
        },
      });

      // 애니메이션 함수 정의
      function animateMarker(startTime: number) {
        const duration = 5000; // 애니메이션 지속 시간 (ms)
        const currentTime = Date.now();
        const elapsedTime = currentTime - startTime;

        // 진행 비율 계산 (0 ~ 1)
        const t = Math.min(elapsedTime / duration, 1);

        // 보간을 통해 현재 위치 계산
        const currentPosition = interpolatePosition(start, end, t);

        // GeoJSON 데이터를 업데이트하여 위치 변경
        const source = map.getSource('point') as maplibregl.GeoJSONSource;
        if (source) {
          point.features[0].geometry.coordinates = currentPosition;
          source.setData(point);
        }

        // 애니메이션이 끝나지 않았으면 다음 프레임 요청
        if (t < 1) {
          requestAnimationFrame(() => animateMarker(startTime));
        }
      }

      // 보간 함수 (두 좌표 사이의 중간값 계산)
      function interpolatePosition(
        start: number[],
        end: number[],
        t: number
      ): number[] {
        const lng = start[0] + (end[0] - start[0]) * t;
        const lat = start[1] + (end[1] - start[1]) * t;
        return [lng, lat];
      }

      // 애니메이션 시작
      animateMarker(Date.now());

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
