import { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { CONTACT } from '../data/villa.js';

/* All guest-facing map content is editable here. Coordinates are [longitude, latitude]. */
const MAP_PLACES = {
  villa: {
    name: 'Villa 25 Ekas',
    shortName: 'Villa 25 Ekas',
    coordinates: [CONTACT.coords.lng, CONTACT.coords.lat],
    kind: 'villa',
  },
  airport: {
    name: 'Lombok International Airport',
    shortName: 'Airport',
    coordinates: [116.2767, -8.7573],
    kind: 'gate',
  },
  slow: {
    name: 'Lembar Harbour · Slow Boat',
    shortName: 'Slow boat',
    coordinates: [116.0722, -8.7269],
    kind: 'gate',
  },
  fast: {
    name: 'Senggigi · Fast Boat',
    shortName: 'Fast boat',
    coordinates: [116.0424, -8.4936],
    kind: 'gate',
  },
};

const MAP_LABELS = [
  { name: 'Mount Rinjani', coordinates: [116.457, -8.411], size: 13 },
  { name: 'Mataram', coordinates: [116.116, -8.584], size: 11 },
  { name: 'Kuta', coordinates: [116.284, -8.894], size: 11 },
  { name: 'Ekas Bay', coordinates: [116.424, -8.868], size: 12 },
];

const ROUTES = {
  airport: { label: 'Airport', detail: '42 km · 1–1.5 hrs', color: '#B58E55', dash: [1, 0] },
  slow: { label: 'Slow boat', detail: '73 km · about 2 hrs', color: '#A98B62', dash: [2, 2] },
  fast: { label: 'Fast boat', detail: '82.5 km · 1 hr 20', color: '#DCBB83', dash: [1, 1.5] },
};

const ISLAND_BOUNDS = [[115.79, -9.04], [116.75, -8.18]];
const BAY_BOUNDS = [[116.383, -8.962], [116.517, -8.856]];
const featureCollection = (features) => ({ type: 'FeatureCollection', features });

async function warmMapStyle() {
  try {
    const response = await fetch('https://tiles.openfreemap.org/styles/liberty');
    if (!response.ok) throw new Error('Map style unavailable');
    const style = await response.json();
    const warm = {
      background: '#100E0B', fill: '#17140F', line: '#443C30', symbol: '#968D7E',
      water: '#0C0B09', park: '#1E1A14', building: '#262019', coast: '#937140',
    };

    style.layers.forEach((layer) => {
      const paint = layer.paint || {};
      const id = layer.id.toLowerCase();
      if (paint['background-color'] !== undefined) paint['background-color'] = warm.background;
      if (paint['fill-color'] !== undefined) {
        paint['fill-color'] = id.includes('water')
          ? warm.water
          : id.includes('park') || id.includes('landcover')
            ? warm.park
            : id.includes('building') ? warm.building : warm.fill;
      }
      if (paint['fill-outline-color'] !== undefined) paint['fill-outline-color'] = '#2E2820';
      if (paint['line-color'] !== undefined) {
        paint['line-color'] = id.includes('coast') || id.includes('water') ? warm.coast : warm.line;
      }
      if (paint['text-color'] !== undefined) paint['text-color'] = warm.symbol;
      if (paint['text-halo-color'] !== undefined) paint['text-halo-color'] = warm.background;
      if (paint['icon-color'] !== undefined) paint['icon-color'] = warm.symbol;
      if (paint['fill-extrusion-color'] !== undefined) paint['fill-extrusion-color'] = warm.building;
    });
    return style;
  } catch {
    return {
      version: 8,
      sources: {
        osm: {
          type: 'raster',
          tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
          tileSize: 256,
          attribution: '© OpenStreetMap contributors',
        },
      },
      layers: [{
        id: 'osm', type: 'raster', source: 'osm',
        paint: {
          'raster-saturation': -1, 'raster-brightness-max': 0.35,
          'raster-contrast': 0.25, 'raster-opacity': 0.75,
        },
      }],
    };
  }
}

async function roadGeometry(start, end) {
  try {
    const url = `https://router.project-osrm.org/route/v1/driving/${start.join(',')};${end.join(',')}?overview=full&geometries=geojson`;
    const response = await fetch(url);
    const data = await response.json();
    if (data.code === 'Ok') return data.routes[0].geometry.coordinates;
  } catch {
    // A straight fallback keeps the route legible if the public router is temporarily unavailable.
  }
  return [start, end];
}

function addTerrain(map) {
  map.addSource('villa-terrain', {
    type: 'raster-dem',
    tiles: ['https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png'],
    tileSize: 256,
    encoding: 'terrarium',
    maxzoom: 15,
  });
  map.setTerrain({ source: 'villa-terrain', exaggeration: 1.18 });
  const firstSymbol = map.getStyle().layers.find((layer) => layer.type === 'symbol')?.id;
  map.addLayer({
    id: 'villa-hillshade', type: 'hillshade', source: 'villa-terrain',
    paint: {
      'hillshade-shadow-color': '#080705',
      'hillshade-highlight-color': '#B58E55',
      'hillshade-accent-color': '#443C30',
      'hillshade-exaggeration': 0.45,
    },
  }, firstSymbol);
}

function addEditorialLabels(map) {
  map.addSource('villa-labels', {
    type: 'geojson',
    data: featureCollection(MAP_LABELS.map((label) => ({
      type: 'Feature', properties: label,
      geometry: { type: 'Point', coordinates: label.coordinates },
    }))),
  });
  map.addLayer({
    id: 'villa-labels', type: 'symbol', source: 'villa-labels',
    layout: {
      'text-field': ['get', 'name'], 'text-size': ['get', 'size'],
      'text-font': ['Noto Sans Italic'], 'text-letter-spacing': 0.18,
      'text-transform': 'uppercase', 'text-allow-overlap': true,
    },
    paint: {
      'text-color': '#DCBB83', 'text-halo-color': '#100E0B',
      'text-halo-width': 1.5, 'text-opacity': 0.9,
    },
  });
}

function addPlaceMarkers(map) {
  return Object.values(MAP_PLACES).map((place) => {
    const element = document.createElement('button');
    element.type = 'button';
    element.className = `journey-map-marker ${place.kind === 'villa' ? 'is-villa' : 'is-gate'}`;
    element.setAttribute('aria-label', place.name);
    const label = document.createElement('span');
    label.className = 'journey-map-marker-label';
    label.textContent = place.shortName;
    element.appendChild(label);
    return new maplibregl.Marker({ element, anchor: 'center' })
      .setLngLat(place.coordinates)
      .setPopup(new maplibregl.Popup({ offset: 20, closeButton: false }).setText(place.name))
      .addTo(map);
  });
}

async function addRoutes(map) {
  const villa = MAP_PLACES.villa.coordinates;
  await Promise.all(Object.entries(ROUTES).map(async ([key, route]) => {
    const coordinates = await roadGeometry(MAP_PLACES[key].coordinates, villa);
    if (!map.getStyle()) return;
    const data = { type: 'Feature', properties: { key }, geometry: { type: 'LineString', coordinates } };
    map.addSource(`journey-route-${key}`, { type: 'geojson', data });
    map.addLayer({
      id: `journey-route-${key}-shadow`, type: 'line', source: `journey-route-${key}`,
      layout: { 'line-join': 'round', 'line-cap': 'round' },
      paint: { 'line-color': '#100E0B', 'line-width': 6, 'line-opacity': 0.65 },
    });
    map.addLayer({
      id: `journey-route-${key}`, type: 'line', source: `journey-route-${key}`,
      layout: { 'line-join': 'round', 'line-cap': 'round' },
      paint: {
        'line-color': route.color, 'line-width': 2.25,
        'line-opacity': 0.95, 'line-dasharray': route.dash,
      },
    });
  }));
}

export default function EkasMap({ className = '' }) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const [ready, setReady] = useState(false);
  const [view, setView] = useState('island');
  const [visibleRoutes, setVisibleRoutes] = useState(() => new Set(Object.keys(ROUTES)));

  useEffect(() => {
    let disposed = false;
    let markers = [];

    async function createMap() {
      const style = await warmMapStyle();
      if (disposed || !containerRef.current) return;
      const map = new maplibregl.Map({
        container: containerRef.current,
        style,
        center: [116.17, -8.69], zoom: 8.55, pitch: 38, bearing: -8,
        minZoom: 7.8, maxZoom: 15,
        attributionControl: false,
      });
      mapRef.current = map;
      map.addControl(new maplibregl.NavigationControl({ showCompass: true }), 'bottom-right');
      map.on('load', async () => {
        if (disposed) return;
        addTerrain(map);
        addEditorialLabels(map);
        markers = addPlaceMarkers(map);
        await addRoutes(map);
        if (!disposed) setReady(true);
      });
    }
    createMap();
    return () => {
      disposed = true;
      markers.forEach((marker) => marker.remove());
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []);

  function switchView(next) {
    const map = mapRef.current;
    setView(next);
    if (!map) return;
    map.fitBounds(next === 'island' ? ISLAND_BOUNDS : BAY_BOUNDS, {
      padding: next === 'island'
        ? { top: 70, right: 55, bottom: 90, left: 55 }
        : { top: 70, right: 55, bottom: 70, left: 55 },
      pitch: next === 'island' ? 38 : 25,
      bearing: next === 'island' ? -8 : -4,
      duration: 1000,
    });
  }

  function toggleRoute(key) {
    const next = new Set(visibleRoutes);
    if (next.has(key)) next.delete(key); else next.add(key);
    setVisibleRoutes(next);
    const visibility = next.has(key) ? 'visible' : 'none';
    [`journey-route-${key}`, `journey-route-${key}-shadow`].forEach((id) => {
      if (mapRef.current?.getLayer(id)) mapRef.current.setLayoutProperty(id, 'visibility', visibility);
    });
  }

  return (
    <figure className={`m-0 ${className}`}>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-px border border-(--color-line-lit) bg-(--color-line)">
          {[
            ['island', 'The island'],
            ['bay', 'Ekas Bay'],
          ].map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => switchView(key)}
              aria-pressed={view === key}
              className={`px-5 py-2.5 text-[13px] uppercase tracking-[0.14em] transition-colors ${
                view === key
                  ? 'bg-(--color-bronze) text-(--color-ink)'
                  : 'bg-(--color-ink) text-(--color-text-soft) hover:text-(--color-text)'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        <p className="text-[13px] text-(--color-text-mute)">Drag to explore · scroll to zoom</p>
      </div>

      <div className="journey-map-frame">
        <div ref={containerRef} className="journey-map-canvas" aria-label="Topographic map of Lombok showing routes to Villa 25 Ekas" />
        <div className="journey-map-shade" aria-hidden="true" />

        {!ready && (
          <div className="journey-map-loading" role="status">Drawing Lombok…</div>
        )}

        <div className="journey-map-routes" aria-label="Map route layers">
          {Object.entries(ROUTES).map(([key, route], index) => {
            const active = visibleRoutes.has(key);
            return (
              <button
                key={key}
                type="button"
                onClick={() => toggleRoute(key)}
                aria-pressed={active}
                className={active ? 'is-active' : ''}
                style={{ '--route-colour': route.color }}
              >
                <i aria-hidden="true" />
                <span><b>{String(index + 1).padStart(2, '0')}</b>{route.label}</span>
                <small>{route.detail}</small>
              </button>
            );
          })}
        </div>
      </div>

    </figure>
  );
}
