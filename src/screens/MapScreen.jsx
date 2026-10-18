import React, { useState, useEffect, useRef, useMemo } from 'react';
import L from 'leaflet';
import {
  PARIS_PLACES,
  CATEGORIES,
  INITIAL_FAVORITES
} from '../data/parisPlaces';
import {
  Search,
  Heart,
  MapPin,
  Navigation,
  Phone,
  Clock,
  Star,
  X,
  Share2,
  Layers,
  Compass,
  List,
  Map as MapIcon,
  Sparkles,
  Check,
  ExternalLink,
  ChevronRight,
  Filter,
  Footprints,
  Route,
  LocateFixed,
  Bike,
  Car,
  Loader2
} from 'lucide-react';

// Position de l'utilisateur : Université Paris Dauphine - PSL (Porte Dauphine)
export const USER_LOCATION = {
  lat: 48.8701,
  lng: 2.2735,
  name: 'Université Paris Dauphine — PSL',
  shortName: 'Dauphine PSL',
  address: 'Place du Maréchal de Lattre de Tassigny, 75016 Paris',
  district: 'Porte Dauphine • 16e arr.'
};

export default function MapScreen({ activePet, onOpenToast }) {
  // Favorites persisted in localStorage
  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem('dogtolib_favorites');
      return saved ? JSON.parse(saved) : INITIAL_FAVORITES;
    } catch {
      return INITIAL_FAVORITES;
    }
  });

  const [activeCategory, setActiveCategory] = useState('all'); // 'all' | 'parc' | 'pupuccino' | 'magasin' | 'toilettage' | 'favorites'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlaceId, setSelectedPlaceId] = useState(null);
  const [viewMode, setViewMode] = useState('map'); // 'map' | 'list'
  const [copiedAddress, setCopiedAddress] = useState(false);

  const [activeRoute, setActiveRoute] = useState(null);
  const [isCalculatingRoute, setIsCalculatingRoute] = useState(false);
  const [routeMode, setRouteMode] = useState('foot'); // 'foot' | 'bike' | 'car'

  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersGroupRef = useRef(null);
  const markersMapRef = useRef({});
  const routeLayerRef = useRef(null);
  const userMarkerRef = useRef(null);

  // Sync favorites to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('dogtolib_favorites', JSON.stringify(favorites));
    } catch (e) {
      console.warn('Could not save favorites to localStorage', e);
    }
  }, [favorites]);

  // Expose direct place selector & route calculator for Leaflet popups and markers
  useEffect(() => {
    window.__dogtolibShowDetail = (id) => {
      setSelectedPlaceId(id);
    };
    window.__dogtolibCalculateRoute = (id) => {
      const p = PARIS_PLACES.find(item => item.id === id);
      if (p) calculateRoute(p, 'foot');
    };
    return () => {
      delete window.__dogtolibShowDetail;
      delete window.__dogtolibCalculateRoute;
    };
  }, []);

  const toggleFavorite = (placeId, e) => {
    if (e) e.stopPropagation();
    setFavorites(prev => {
      const isFav = prev.includes(placeId);
      const updated = isFav ? prev.filter(id => id !== placeId) : [...prev, placeId];
      if (onOpenToast) {
        onOpenToast(isFav ? "Lieu retiré des favoris" : "Ajouté aux favoris ❤️");
      }
      return updated;
    });
  };

  // Filtered places
  const filteredPlaces = useMemo(() => {
    return PARIS_PLACES.filter(place => {
      // Category filter
      if (activeCategory === 'favorites') {
        if (!favorites.includes(place.id)) return false;
      } else if (activeCategory !== 'all') {
        if (place.category !== activeCategory) return false;
      }

      // Search query filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesTitle = place.title.toLowerCase().includes(query);
        const matchesAddress = place.address.toLowerCase().includes(query);
        const matchesDistrict = place.district.toLowerCase().includes(query);
        const matchesNeighborhood = place.neighborhood?.toLowerCase().includes(query);
        const matchesTags = place.tags.some(t => t.toLowerCase().includes(query));
        const matchesDesc = place.description.toLowerCase().includes(query);
        return matchesTitle || matchesAddress || matchesDistrict || matchesNeighborhood || matchesTags || matchesDesc;
      }

      return true;
    });
  }, [activeCategory, searchQuery, favorites]);

  const selectedPlace = useMemo(() => {
    return PARIS_PLACES.find(p => p.id === selectedPlaceId) || null;
  }, [selectedPlaceId]);

  // Count by category
  const counts = useMemo(() => {
    const c = {
      all: PARIS_PLACES.length,
      parc: PARIS_PLACES.filter(p => p.category === 'parc').length,
      pupuccino: PARIS_PLACES.filter(p => p.category === 'pupuccino').length,
      magasin: PARIS_PLACES.filter(p => p.category === 'magasin').length,
      toilettage: PARIS_PLACES.filter(p => p.category === 'toilettage').length,
      favorites: favorites.length
    };
    return c;
  }, [favorites]);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      // Create map centered on Paris
      const map = L.map(mapContainerRef.current, {
        center: [48.8566, 2.3522],
        zoom: 12,
        zoomControl: false,
        attributionControl: false
      });

      // OpenStreetMap tiles - 100% stable, free & open, no API key required
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19
      }).addTo(map);

      // Add Zoom control at top right
      L.control.zoom({ position: 'topright' }).addTo(map);

      // Attribution
      L.control.attribution({ position: 'bottomleft', prefix: false })
        .addAttribution('© OSM & Dogtolib')
        .addTo(map);

      // Route Polyline Layer Group
      const routeGroup = L.layerGroup().addTo(map);
      routeLayerRef.current = routeGroup;

      // User Location Marker (Université Paris Dauphine - PSL, Porte Dauphine)
      const userPuckIcon = L.divIcon({
        className: 'custom-user-puck-marker',
        html: `
          <div class="user-location-puck" title="Votre position : ${USER_LOCATION.name}">
            <div class="user-location-pulse"></div>
            <div class="user-location-dot"></div>
          </div>
        `,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
        popupAnchor: [0, -14]
      });

      const userMarker = L.marker([USER_LOCATION.lat, USER_LOCATION.lng], {
        icon: userPuckIcon,
        zIndexOffset: 1200
      });

      const userPopup = L.popup({
        className: 'dogtolib-popup',
        closeButton: true,
        offset: [0, -10],
        maxWidth: 240
      }).setContent(`
        <div style="padding: 10px 12px; font-family: system-ui, -apple-system, sans-serif; cursor: default;">
          <div style="display: flex; align-items: center; gap: 5px; margin-bottom: 4px;">
            <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: #2563EB;"></span>
            <span style="font-size: 10px; font-weight: 800; color: #2563EB; text-transform: uppercase; letter-spacing: 0.5px;">Ma localisation</span>
          </div>
          <div style="font-weight: 800; font-size: 13px; color: #0F4C5C; line-height: 1.25;">
            ${USER_LOCATION.name}
          </div>
          <div style="font-size: 11px; color: #64748B; margin-top: 3px;">
            📍 ${USER_LOCATION.district} • ${USER_LOCATION.address}
          </div>
        </div>
      `);

      userMarker.bindPopup(userPopup);
      userMarker.addTo(map);
      userMarkerRef.current = userMarker;

      const markersGroup = L.layerGroup().addTo(map);
      markersGroupRef.current = markersGroup;
      mapInstanceRef.current = map;
    }

    // Leaflet needs resize invalidation when shown inside dynamic layout
    const timer = setTimeout(() => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize();
      }
    }, 150);

    return () => clearTimeout(timer);
  }, []);

  // Invalidate map size when switching back to map view
  useEffect(() => {
    if (viewMode === 'map' && mapInstanceRef.current) {
      setTimeout(() => {
        mapInstanceRef.current.invalidateSize();
      }, 100);
    }
  }, [viewMode]);

  // Update Markers on map
  useEffect(() => {
    if (!mapInstanceRef.current || !markersGroupRef.current) return;

    markersGroupRef.current.clearLayers();
    markersMapRef.current = {};

    filteredPlaces.forEach(place => {
      const isFav = favorites.includes(place.id);
      const isSelected = place.id === selectedPlaceId;
      const cat = CATEGORIES[place.category];

      // Custom HTML Marker Icon
      const iconHtml = `
        <div class="dogtolib-marker-pin ${isSelected ? 'active' : ''}" onclick="window.__dogtolibShowDetail && window.__dogtolibShowDetail('${place.id}')" style="width: 36px; height: 44px; position: relative; cursor: pointer;">
          <svg viewBox="0 0 38 46" width="36" height="44" style="filter: drop-shadow(0 3px 5px rgba(0,0,0,0.3));">
            <path d="M19 0C8.5 0 0 8.5 0 19C0 29.5 19 46 19 46C19 46 38 29.5 38 19C38 8.5 29.5 0 19 0Z" fill="${cat.color}" />
            <circle cx="19" cy="18" r="13" fill="#ffffff" />
          </svg>
          <div style="position: absolute; top: 6px; left: 0; width: 36px; text-align: center; font-size: 15px; pointer-events: none; line-height: 22px;">
            ${cat.emoji}
          </div>
          ${isFav ? `
            <div style="position: absolute; top: -3px; right: -3px; width: 16px; height: 16px; background: #EF4444; border: 2px solid #ffffff; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 1px 3px rgba(0,0,0,0.3);">
              <svg viewBox="0 0 24 24" width="9" height="9" fill="#ffffff" stroke="#ffffff" stroke-width="2">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
            </div>
          ` : ''}
        </div>
      `;

      const customIcon = L.divIcon({
        className: 'custom-leaflet-marker',
        html: iconHtml,
        iconSize: [36, 44],
        iconAnchor: [18, 44],
        popupAnchor: [0, -42]
      });

      const marker = L.marker([place.lat, place.lng], {
        icon: customIcon,
        riseOnHover: true
      });

      // Custom Leaflet Popup preview aperçu
      const popupHtml = `
        <div style="width: 220px; font-family: system-ui, -apple-system, sans-serif; cursor: default;">
          <div style="position: relative; height: 95px; width: 100%; overflow: hidden; background: #0F4C5C;">
            <img src="${place.photo}" alt="${place.title}" style="width: 100%; height: 100%; object-fit: cover;" />
            <div style="position: absolute; inset: 0; background: linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 60%);"></div>
            <div style="position: absolute; top: 6px; left: 6px; background: ${cat.color}; color: #ffffff; font-size: 9px; font-weight: 800; padding: 2px 7px; border-radius: 999px; box-shadow: 0 1px 3px rgba(0,0,0,0.3); display: flex; align-items: center; gap: 3px;">
              <span>${cat.emoji}</span>
              <span>${cat.label}</span>
            </div>
            <div style="position: absolute; bottom: 5px; right: 6px; background: rgba(0,0,0,0.7); color: #FBBF24; font-size: 10px; font-weight: 800; padding: 2px 6px; border-radius: 6px; display: flex; align-items: center; gap: 2px;">
              <span>★</span>
              <span>${place.rating}</span>
            </div>
          </div>
          <div style="padding: 10px 12px 12px 12px;">
            <h4 style="margin: 0 0 2px 0; font-size: 13px; font-weight: 800; color: #0F4C5C; line-height: 1.25; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
              ${place.title}
            </h4>
            <div style="font-size: 11px; color: #64748B; margin-bottom: 8px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
              📍 ${place.neighborhood} • ${place.district}
            </div>
            <div style="display: flex; gap: 6px;">
              <button
                id="leaflet-route-btn-${place.id}"
                onclick="window.__dogtolibCalculateRoute && window.__dogtolibCalculateRoute('${place.id}')"
                style="flex: 1.3; background: #0F4C5C; color: #ffffff; border: none; padding: 7px 8px; border-radius: 10px; font-size: 11px; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 4px;"
              >
                <span>🧭 Itinéraire</span>
                <span>➔</span>
              </button>
              <button
                id="leaflet-preview-btn-${place.id}"
                onclick="window.__dogtolibShowDetail && window.__dogtolibShowDetail('${place.id}')"
                style="flex: 1; background: #F1F5F9; color: #0F4C5C; border: 1px solid #CBD5E1; padding: 7px 8px; border-radius: 10px; font-size: 11px; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center;"
              >
                <span>Détails</span>
              </button>
            </div>
          </div>
        </div>
      `;

      const popup = L.popup({
        className: 'dogtolib-popup',
        closeButton: true,
        autoPan: true,
        offset: [0, -32],
        maxWidth: 240,
        minWidth: 220
      }).setContent(popupHtml);

      marker.bindPopup(popup);

      // Marker click handler
      marker.on('click', (e) => {
        if (e && e.originalEvent) {
          e.originalEvent._markerClicked = true;
          L.DomEvent.stopPropagation(e.originalEvent);
        }
        setSelectedPlaceId(place.id);
        if (mapInstanceRef.current) {
          mapInstanceRef.current.panTo([place.lat, place.lng], { animate: true });
        }
      });

      marker.on('popupopen', () => {
        setSelectedPlaceId(place.id);
        const btn = document.getElementById(`leaflet-preview-btn-${place.id}`);
        if (btn) {
          btn.onclick = (ev) => {
            if (ev) ev.stopPropagation();
            setSelectedPlaceId(place.id);
          };
        }
      });

      marker.addTo(markersGroupRef.current);
      markersMapRef.current[place.id] = marker;
    });
  }, [filteredPlaces, favorites]);

  // Synchronize active marker popup and active pin styling
  useEffect(() => {
    document.querySelectorAll('.dogtolib-marker-pin').forEach(el => {
      el.classList.remove('active');
    });

    if (selectedPlaceId && markersMapRef.current[selectedPlaceId]) {
      const marker = markersMapRef.current[selectedPlaceId];
      const pinEl = marker.getElement()?.querySelector('.dogtolib-marker-pin');
      if (pinEl) pinEl.classList.add('active');

      if (!marker.isPopupOpen()) {
        marker.openPopup();
      }
    }
  }, [selectedPlaceId]);

  // Recenter Paris
  const handleRecenter = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([48.8566, 2.3522], 12, { animate: true });
      mapInstanceRef.current.closePopup();
      setSelectedPlaceId(null);
    }
  };

  // Close detail sheet & popup
  const handleCloseDetail = () => {
    setSelectedPlaceId(null);
    if (mapInstanceRef.current) {
      mapInstanceRef.current.closePopup();
    }
  };

  // Clear active route
  const handleClearRoute = () => {
    if (routeLayerRef.current) {
      routeLayerRef.current.clearLayers();
    }
    setActiveRoute(null);
    if (onOpenToast) {
      onOpenToast("Itinéraire terminé");
    }
  };

  // Center on user location (Université Paris Dauphine - PSL)
  const handleCenterOnUser = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([USER_LOCATION.lat, USER_LOCATION.lng], 15, { animate: true });
      if (userMarkerRef.current) {
        userMarkerRef.current.openPopup();
      }
    }
  };

  // Calculate in-app route from Dauphine to destination
  const calculateRoute = async (place, mode = 'foot') => {
    if (!place) return;
    setIsCalculatingRoute(true);
    setRouteMode(mode);
    setViewMode('map');

    try {
      const startLng = USER_LOCATION.lng;
      const startLat = USER_LOCATION.lat;
      const destLng = place.lng;
      const destLat = place.lat;

      const profile = mode === 'car' ? 'driving' : mode === 'bike' ? 'bike' : 'foot';
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 4000);

      let coords = [];
      let distanceMeters = 0;
      let durationSeconds = 0;

      try {
        const res = await fetch(
          `https://router.project-osrm.org/route/v1/${profile}/${startLng},${startLat};${destLng},${destLat}?overview=full&geometries=geojson`,
          { signal: controller.signal }
        );
        clearTimeout(timeout);
        if (res.ok) {
          const data = await res.json();
          if (data.routes && data.routes.length > 0) {
            const route = data.routes[0];
            coords = route.geometry.coordinates.map(([lng, lat]) => [lat, lng]);
            distanceMeters = route.distance;
            durationSeconds = route.duration;
          }
        }
      } catch (e) {
        console.warn('OSRM route fetch failed or timed out, fallback to geodesic', e);
      }

      // Fallback if offline or API delay
      if (!coords || coords.length === 0) {
        const rad = Math.PI / 180;
        const dLat = (destLat - startLat) * rad;
        const dLon = (destLng - startLng) * rad;
        const a = Math.sin(dLat / 2) ** 2 + Math.cos(startLat * rad) * Math.cos(destLat * rad) * Math.sin(dLon / 2) ** 2;
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const directMeters = 6371000 * c * 1.35; // 1.35x street detour factor
        distanceMeters = directMeters;
        durationSeconds = (directMeters / 1000) / (mode === 'car' ? 25 : mode === 'bike' ? 15 : 4.5) * 3600;
        coords = [
          [startLat, startLng],
          [(startLat * 2 + destLat) / 3, (startLng * 2 + destLng) / 3],
          [(startLat + destLat * 2) / 3, (startLng + destLng * 2) / 3],
          [destLat, destLng]
        ];
      }

      const distanceKm = (distanceMeters / 1000).toFixed(1).replace('.', ',');
      const durationMin = Math.max(1, Math.round(durationSeconds / 60));

      const newRoute = {
        destination: place,
        distanceKm,
        durationMin,
        distanceMeters,
        coordinates: coords,
        mode
      };

      setActiveRoute(newRoute);
      setSelectedPlaceId(null);
      if (mapInstanceRef.current) {
        mapInstanceRef.current.closePopup();
      }

      // Render polyline on Leaflet
      if (mapInstanceRef.current && routeLayerRef.current) {
        routeLayerRef.current.clearLayers();

        // 1. Contrast white glow border
        L.polyline(coords, {
          color: '#ffffff',
          weight: 9,
          opacity: 0.95,
          lineCap: 'round',
          lineJoin: 'round'
        }).addTo(routeLayerRef.current);

        // 2. Main route path
        L.polyline(coords, {
          color: mode === 'foot' ? '#0F4C5C' : mode === 'bike' ? '#059669' : '#2563EB',
          weight: 5,
          opacity: 0.95,
          lineCap: 'round',
          lineJoin: 'round',
          dashArray: mode === 'foot' ? '2, 8' : null
        }).addTo(routeLayerRef.current);

        // Fit bounds with comfortable padding
        const bounds = L.latLngBounds(coords);
        mapInstanceRef.current.fitBounds(bounds, {
          paddingTopLeft: [70, 40],
          paddingBottomRight: [40, 200],
          maxZoom: 16,
          animate: true
        });
      }

      if (onOpenToast) {
        onOpenToast(`Itinéraire : ${durationMin} min depuis Dauphine (${distanceKm} km) 🐾`);
      }
    } catch (err) {
      console.error('Error calculating route:', err);
      if (onOpenToast) onOpenToast("Impossible de calculer l'itinéraire");
    } finally {
      setIsCalculatingRoute(false);
    }
  };

  // Center on a specific place from list
  const handleFocusPlace = (place) => {
    setSelectedPlaceId(place.id);
    setViewMode('map');
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([place.lat, place.lng], 15, { animate: true });
      setTimeout(() => {
        if (markersMapRef.current[place.id]) {
          markersMapRef.current[place.id].openPopup();
        }
      }, 350);
    }
  };

  // Copy address
  const handleCopyAddress = (address) => {
    navigator.clipboard?.writeText(address);
    setCopiedAddress(true);
    setTimeout(() => setCopiedAddress(false), 2000);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#F6F1E9] overflow-hidden relative">

      {/* Top Header Bar */}
      <div className="bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 pt-3 pb-2.5 shrink-0 z-30 shadow-2xs">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#0F4C5C]/10 flex items-center justify-center text-[#0F4C5C]">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <h1 className="text-base font-extrabold text-[#0F4C5C] leading-none">
                Paris Canin
              </h1>
              <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                {filteredPlaces.length} adresses dog-friendly
              </p>
            </div>
          </div>

          {/* Toggle Map / List view */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200/60">
            <button
              onClick={() => setViewMode('map')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${viewMode === 'map'
                  ? 'bg-white text-[#0F4C5C] shadow-2xs'
                  : 'text-slate-500 hover:text-slate-800'
                }`}
            >
              <MapIcon className="w-3.5 h-3.5" />
              <span>Carte</span>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${viewMode === 'list'
                  ? 'bg-white text-[#0F4C5C] shadow-2xs'
                  : 'text-slate-500 hover:text-slate-800'
                }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>Liste ({filteredPlaces.length})</span>
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative mb-2">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher parc, pupuccino, 17e, laisse..."
            className="w-full bg-slate-100/90 hover:bg-slate-100 focus:bg-white border border-transparent focus:border-[#0F4C5C]/30 text-xs text-slate-800 placeholder-slate-400 pl-9 pr-8 py-2 rounded-xl outline-none transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Category Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 -mx-1 px-1">
          {/* Tous */}
          <button
            onClick={() => setActiveCategory('all')}
            className={`shrink-0 px-3 py-1.5 rounded-full text-[11px] font-bold transition-all flex items-center gap-1.5 ${activeCategory === 'all'
                ? 'bg-[#0F4C5C] text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70 border border-slate-200/60'
              }`}
          >
            <span>🐾 Tous</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${activeCategory === 'all' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
              }`}>
              {counts.all}
            </span>
          </button>

          {/* Favoris */}
          <button
            onClick={() => setActiveCategory('favorites')}
            className={`shrink-0 px-3 py-1.5 rounded-full text-[11px] font-bold transition-all flex items-center gap-1.5 ${activeCategory === 'favorites'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'bg-rose-50 text-rose-700 hover:bg-rose-100/70 border border-rose-200'
              }`}
          >
            <Heart className={`w-3.5 h-3.5 ${activeCategory === 'favorites' ? 'fill-white' : 'fill-rose-500 text-rose-500'}`} />
            <span>Favoris</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${activeCategory === 'favorites' ? 'bg-white/20 text-white' : 'bg-rose-200/70 text-rose-800'
              }`}>
              {counts.favorites}
            </span>
          </button>

          {/* Parcs */}
          <button
            onClick={() => setActiveCategory('parc')}
            className={`shrink-0 px-3 py-1.5 rounded-full text-[11px] font-bold transition-all flex items-center gap-1.5 ${activeCategory === 'parc'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100/80 border border-emerald-200'
              }`}
          >
            <span>🌳 Parcs</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${activeCategory === 'parc' ? 'bg-white/20 text-white' : 'bg-emerald-200/60 text-emerald-800'
              }`}>
              {counts.parc}
            </span>
          </button>

          {/* Pupuccinos */}
          <button
            onClick={() => setActiveCategory('pupuccino')}
            className={`shrink-0 px-3 py-1.5 rounded-full text-[11px] font-bold transition-all flex items-center gap-1.5 ${activeCategory === 'pupuccino'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-amber-50 text-amber-800 hover:bg-amber-100/80 border border-amber-200'
              }`}
          >
            <span>☕ Pupuccinos</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${activeCategory === 'pupuccino' ? 'bg-white/20 text-white' : 'bg-amber-200/60 text-amber-800'
              }`}>
              {counts.pupuccino}
            </span>
          </button>

          {/* Boutiques */}
          <button
            onClick={() => setActiveCategory('magasin')}
            className={`shrink-0 px-3 py-1.5 rounded-full text-[11px] font-bold transition-all flex items-center gap-1.5 ${activeCategory === 'magasin'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-blue-50 text-blue-800 hover:bg-blue-100/80 border border-blue-200'
              }`}
          >
            <span>🛍️ Boutiques</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${activeCategory === 'magasin' ? 'bg-white/20 text-white' : 'bg-blue-200/60 text-blue-800'
              }`}>
              {counts.magasin}
            </span>
          </button>

          {/* Toiletteurs */}
          <button
            onClick={() => setActiveCategory('toilettage')}
            className={`shrink-0 px-3 py-1.5 rounded-full text-[11px] font-bold transition-all flex items-center gap-1.5 ${activeCategory === 'toilettage'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'bg-purple-50 text-purple-800 hover:bg-purple-100/80 border border-purple-200'
              }`}
          >
            <span>✂️ Toiletteurs</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${activeCategory === 'toilettage' ? 'bg-white/20 text-white' : 'bg-purple-200/60 text-purple-800'
              }`}>
              {counts.toilettage}
            </span>
          </button>
        </div>
      </div>

      {/* Main View Area (Map or List) */}
      <div className="flex-1 relative overflow-hidden">

        {/* LEAFLET MAP VIEW */}
        <div
          className={`absolute inset-0 transition-opacity duration-200 ${viewMode === 'map' ? 'opacity-100 pointer-events-auto z-10' : 'opacity-0 pointer-events-none z-0'
            }`}
        >
          {/* Map canvas */}
          <div ref={mapContainerRef} className="w-full h-full bg-[#E8E0D5]" />

          {/* Floating Map Controls */}
          <div className="absolute top-3 left-3 z-20 flex flex-col gap-1.5 pointer-events-auto">
            {/* Recenter Button */}
            <button
              onClick={handleRecenter}
              title="Recentrer sur Paris"
              className="bg-white/95 backdrop-blur-xs hover:bg-white text-slate-700 hover:text-[#0F4C5C] px-3 py-2 rounded-2xl shadow-md border border-slate-200/80 flex items-center gap-1.5 text-xs font-bold transition-transform active:scale-95"
            >
              <Compass className="w-3.5 h-3.5 text-[#0F4C5C]" />
              <span>Paris Centre</span>
            </button>

            {/* My Location: Dauphine PSL */}
            <button
              onClick={handleCenterOnUser}
              title="Me localiser à Dauphine - PSL"
              className="bg-white/95 backdrop-blur-xs hover:bg-white text-[#2563EB] px-3 py-2 rounded-2xl shadow-md border border-blue-200/80 flex items-center gap-1.5 text-xs font-bold transition-transform active:scale-95"
            >
              <span className="w-2.5 h-2.5 rounded-full bg-[#2563EB] animate-pulse"></span>
              <span>Dauphine PSL</span>
            </button>
          </div>

          {/* ACTIVE ITINERARY TOP HEADER BANNER */}
          {activeRoute && (
            <div className="absolute top-2.5 left-2.5 right-2.5 z-[1100] animate-in slide-in-from-top-4 duration-200 pointer-events-auto">
              <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-slate-200/90 p-2.5 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-8 h-8 rounded-xl bg-[#2563EB]/10 text-[#2563EB] flex items-center justify-center shrink-0">
                    <Navigation className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1 text-[10px] text-slate-500 font-bold truncate">
                      <span>Dauphine (16e)</span>
                      <span>➔</span>
                    </div>
                    <div className="text-xs font-extrabold text-[#0F4C5C] truncate">
                      {activeRoute.destination.title}
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleClearRoute}
                  className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center shrink-0 transition-colors"
                  title="Quitter l'itinéraire"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Floating Status Pill */}
          <div className="absolute top-3 right-14 z-20 pointer-events-none">
            <span className="bg-white/90 backdrop-blur-xs text-[#0F4C5C] text-[10px] font-extrabold px-2.5 py-1 rounded-full shadow-xs border border-slate-200/60">
              📍 {filteredPlaces.length} spot{filteredPlaces.length > 1 ? 's' : ''}
            </span>
          </div>

          {/* EMPTY STATE ON MAP (e.g. 0 favorites) */}
          {filteredPlaces.length === 0 && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 bg-white/95 backdrop-blur-md p-5 rounded-3xl shadow-xl border border-slate-200 text-center max-w-[280px]">
              <Heart className="w-8 h-8 text-rose-400 mx-auto mb-2 opacity-50" />
              <h3 className="text-sm font-extrabold text-slate-800">
                Aucun lieu favori
              </h3>
              <p className="text-xs text-slate-500 mt-1 mb-3">
                Touchez le cœur ❤️ sur un parc, café ou boutique pour le retrouver ici.
              </p>
              <button
                onClick={() => setActiveCategory('all')}
                className="bg-[#0F4C5C] text-white text-xs font-bold px-4 py-2 rounded-xl shadow-xs hover:bg-[#16697A]"
              >
                Explorer tous les lieux
              </button>
            </div>
          )}

          {/* BOTTOM SHEET DETAIL CARD (when a place is selected on the map) */}
          {selectedPlace && (
            <div className="absolute bottom-2 left-2 right-2 z-[1000] animate-in slide-in-from-bottom-5 duration-200 pointer-events-auto">
              <div className="bg-white rounded-3xl shadow-2xl border border-slate-200/90 overflow-hidden flex flex-col max-h-[380px]">

                {/* Header Image & Badges */}
                <div className="relative h-28 w-full shrink-0">
                  <img
                    src={selectedPlace.photo}
                    alt={selectedPlace.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                  {/* Category Pill */}
                  <div
                    className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full text-[10px] font-extrabold text-white flex items-center gap-1 shadow-xs"
                    style={{ backgroundColor: CATEGORIES[selectedPlace.category].color }}
                  >
                    <span>{CATEGORIES[selectedPlace.category].emoji}</span>
                    <span>{CATEGORIES[selectedPlace.category].label}</span>
                  </div>

                  {/* Close button */}
                  <button
                    onClick={handleCloseDetail}
                    className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-black/40 backdrop-blur-xs text-white hover:bg-black/60 flex items-center justify-center transition-all"
                  >
                    <X className="w-4 h-4" />
                  </button>

                  {/* Title overlay */}
                  <div className="absolute bottom-2 left-3 right-3 text-white flex items-end justify-between">
                    <div className="min-w-0 pr-2">
                      <h3 className="text-sm font-extrabold leading-tight truncate">
                        {selectedPlace.title}
                      </h3>
                      <p className="text-[11px] text-white/90 truncate">
                        {selectedPlace.neighborhood} • {selectedPlace.district}
                      </p>
                    </div>

                    {/* Favorite Button */}
                    <button
                      onClick={(e) => toggleFavorite(selectedPlace.id, e)}
                      className={`w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 shadow-md transition-all active:scale-90 ${favorites.includes(selectedPlace.id)
                          ? 'bg-rose-500 text-white'
                          : 'bg-white/90 text-slate-700 hover:bg-white'
                        }`}
                    >
                      <Heart className={`w-4 h-4 ${favorites.includes(selectedPlace.id) ? 'fill-white' : ''}`} />
                    </button>
                  </div>
                </div>

                {/* Content body */}
                <div className="p-3.5 overflow-y-auto space-y-2.5 text-xs text-slate-600">

                  {/* Rating + Hours + Distance info */}
                  <div className="flex items-center justify-between text-[11px] text-slate-500 border-b border-slate-100 pb-2">
                    <div className="flex items-center gap-1 font-bold text-amber-600">
                      <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                      <span>{selectedPlace.rating}</span>
                      <span className="text-slate-400 font-normal">({selectedPlace.reviewsCount} avis)</span>
                    </div>

                    <div className="flex items-center gap-1 text-slate-600 font-medium">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{selectedPlace.hours.split('•')[0]}</span>
                    </div>
                  </div>

                  {/* Highlights Tags */}
                  <div className="flex flex-wrap gap-1">
                    {selectedPlace.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md border border-slate-200/50"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Description */}
                  <p className="text-xs text-slate-700 leading-relaxed">
                    {selectedPlace.description}
                  </p>

                  {/* Owner Tip / Pitch Highlight */}
                  <div className="bg-[#0F4C5C]/5 border border-[#0F4C5C]/15 rounded-2xl p-2.5 flex items-start gap-2 text-[11px] text-[#0F4C5C]">
                    <Sparkles className="w-4 h-4 text-[#E36414] shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold block">Le conseil Dogtolib :</span>
                      <span>{selectedPlace.ownerTip}</span>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    {/* Itinéraire direct */}
                    <button
                      onClick={() => calculateRoute(selectedPlace, 'foot')}
                      disabled={isCalculatingRoute}
                      className="py-2.5 px-3 rounded-xl bg-[#0F4C5C] hover:bg-[#16697A] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer disabled:opacity-70"
                    >
                      {isCalculatingRoute ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Navigation className="w-3.5 h-3.5" />
                      )}
                      <span>{isCalculatingRoute ? "Calcul..." : "Itinéraire (Dauphine)"}</span>
                    </button>

                    {/* Appeler ou Copier adresse */}
                    {selectedPlace.phone ? (
                      <a
                        href={`tel:${selectedPlace.phone}`}
                        className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors border border-slate-200"
                      >
                        <Phone className="w-3.5 h-3.5 text-slate-600" />
                        <span>Appeler</span>
                      </a>
                    ) : (
                      <button
                        onClick={() => handleCopyAddress(selectedPlace.address)}
                        className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors border border-slate-200"
                      >
                        {copiedAddress ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <MapPin className="w-3.5 h-3.5 text-slate-600" />}
                        <span>{copiedAddress ? "Copié !" : "Adresse"}</span>
                      </button>
                    )}
                  </div>

                </div>
              </div>
            </div>
          )}

          {/* ACTIVE ROUTE BOTTOM DETAIL CARD */}
          {activeRoute && !selectedPlace && (
            <div className="absolute bottom-2 left-2 right-2 z-[1000] animate-in slide-in-from-bottom-5 duration-200 pointer-events-auto">
              <div className="bg-white rounded-3xl shadow-2xl border border-slate-200/90 p-3.5 flex flex-col gap-3">
                {/* Transport Mode Switcher */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                  <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
                    <button
                      onClick={() => calculateRoute(activeRoute.destination, 'foot')}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1 transition-all ${
                        routeMode === 'foot'
                          ? 'bg-[#0F4C5C] text-white shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <span>🚶‍♂️ À pied</span>
                    </button>
                    <button
                      onClick={() => calculateRoute(activeRoute.destination, 'bike')}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1 transition-all ${
                        routeMode === 'bike'
                          ? 'bg-emerald-700 text-white shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <span>🚲 Vélo</span>
                    </button>
                    <button
                      onClick={() => calculateRoute(activeRoute.destination, 'car')}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1 transition-all ${
                        routeMode === 'car'
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <span>🚗 Voiture</span>
                    </button>
                  </div>

                  <button
                    onClick={() => {
                      if (mapInstanceRef.current && routeLayerRef.current) {
                        const bounds = L.latLngBounds(activeRoute.coordinates);
                        mapInstanceRef.current.fitBounds(bounds, {
                          paddingTopLeft: [70, 40],
                          paddingBottomRight: [40, 200],
                          animate: true
                        });
                      }
                    }}
                    className="text-[11px] text-[#0F4C5C] hover:text-[#16697A] font-bold flex items-center gap-1 bg-slate-100/90 hover:bg-slate-200/70 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                    title="Recentrer sur tout le trajet"
                  >
                    <Compass className="w-3 h-3" />
                    <span>Recentrer</span>
                  </button>
                </div>

                {/* Metrics & Thumbnail */}
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-black text-[#0F4C5C]">
                        {activeRoute.durationMin} min
                      </span>
                      <span className="text-xs font-bold text-slate-500">
                        ({activeRoute.distanceKm} km)
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1.5 flex-wrap">
                      <span>🐾 ~{Math.round(parseFloat(activeRoute.distanceKm.replace(',', '.')) * 1400).toLocaleString('fr-FR')} pas pour {activePet?.name || 'votre chien'}</span>
                      <span>•</span>
                      <span className="text-emerald-700 font-bold">Itinéraire direct</span>
                    </div>
                  </div>

                  <div className="w-12 h-12 rounded-2xl overflow-hidden shrink-0 border border-slate-200 shadow-2xs">
                    <img
                      src={activeRoute.destination.photo}
                      alt={activeRoute.destination.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* Actions */}
                <div className="grid grid-cols-3 gap-2 pt-0.5">
                  <button
                    onClick={() => setSelectedPlaceId(activeRoute.destination.id)}
                    className="py-2.5 px-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-[11px] flex items-center justify-center gap-1 transition-colors border border-slate-200 cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#E36414]" />
                    <span>Fiche</span>
                  </button>

                  <a
                    href={`https://www.google.com/maps/dir/?api=1&origin=${USER_LOCATION.lat},${USER_LOCATION.lng}&destination=${encodeURIComponent(activeRoute.destination.title + ' ' + activeRoute.destination.address + ' Paris')}&travelmode=${routeMode === 'car' ? 'driving' : routeMode === 'bike' ? 'bicycling' : 'walking'}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2.5 px-2 rounded-xl bg-[#0F4C5C] hover:bg-[#16697A] text-white font-bold text-[11px] flex items-center justify-center gap-1 shadow-xs transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>GPS (Plans)</span>
                  </a>

                  <button
                    onClick={handleClearRoute}
                    className="py-2.5 px-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-[11px] flex items-center justify-center gap-1 transition-colors border border-rose-200 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Quitter</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* LIST VIEW */}
        <div
          className={`absolute inset-0 overflow-y-auto px-4 py-3 space-y-3 transition-opacity duration-200 ${viewMode === 'list' ? 'opacity-100 pointer-events-auto z-10' : 'opacity-0 pointer-events-none z-0'
            }`}
        >
          {filteredPlaces.length === 0 ? (
            <div className="bg-white rounded-3xl p-8 text-center border border-slate-200 shadow-xs mt-6 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-extrabold text-slate-800">
                Aucun résultat trouvé
              </h3>
              <p className="text-xs text-slate-500 max-w-[240px] mx-auto">
                Modifiez vos filtres ou effectuez une autre recherche pour trouver des lieux canins.
              </p>
              <button
                onClick={() => { setActiveCategory('all'); setSearchQuery(''); }}
                className="bg-[#0F4C5C] text-white text-xs font-bold px-4 py-2 rounded-xl shadow-xs"
              >
                Réinitialiser les filtres
              </button>
            </div>
          ) : (
            filteredPlaces.map((place) => {
              const isFav = favorites.includes(place.id);
              const cat = CATEGORIES[place.category];

              return (
                <div
                  key={place.id}
                  onClick={() => handleFocusPlace(place)}
                  className="bg-white rounded-3xl p-3.5 border border-slate-200/80 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col gap-2.5 group"
                >
                  <div className="flex gap-3">
                    {/* Place Photo */}
                    <div className="relative w-20 h-20 rounded-2xl overflow-hidden shrink-0">
                      <img
                        src={place.photo}
                        alt={place.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <span
                        className="absolute top-1.5 left-1.5 text-xs px-1.5 py-0.5 rounded-md font-bold shadow-xs text-white"
                        style={{ backgroundColor: cat.color }}
                      >
                        {cat.emoji}
                      </span>
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-1">
                          <h4 className="text-xs font-extrabold text-slate-900 group-hover:text-[#0F4C5C] transition-colors leading-snug">
                            {place.title}
                          </h4>
                          {/* Heart button */}
                          <button
                            onClick={(e) => toggleFavorite(place.id, e)}
                            className="p-1 text-slate-400 hover:text-rose-500 shrink-0 transition-transform active:scale-90"
                          >
                            <Heart className={`w-4 h-4 ${isFav ? 'fill-rose-500 text-rose-500' : ''}`} />
                          </button>
                        </div>
                        <p className="text-[11px] text-slate-500 font-medium truncate mt-0.5">
                          {place.neighborhood} • {place.district}
                        </p>
                      </div>

                      <div className="flex items-center gap-3 text-[11px] text-slate-500 mt-1">
                        <span className="flex items-center gap-0.5 font-bold text-amber-600">
                          <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                          {place.rating}
                        </span>
                        <span className="text-slate-400 truncate">
                          {place.hours.split('•')[0]}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1">
                    {place.tags.slice(0, 3).map((tag, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md"
                      >
                        {tag}
                      </span>
                    ))}
                    {place.tags.length > 3 && (
                      <span className="text-[10px] bg-slate-100 text-slate-400 px-1.5 py-0.5 rounded-md">
                        +{place.tags.length - 3}
                      </span>
                    )}
                  </div>

                  {/* Bottom Action Bar */}
                  <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-[11px]">
                    <span className="text-slate-400 truncate max-w-[150px]">
                      {place.address}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          calculateRoute(place, 'foot');
                        }}
                        className="text-[#2563EB] hover:text-blue-700 font-bold flex items-center gap-1 bg-blue-50 hover:bg-blue-100/80 px-2.5 py-1 rounded-xl transition-colors cursor-pointer"
                      >
                        <Navigation className="w-3 h-3" />
                        <span>Itinéraire</span>
                      </button>
                      <span className="text-[#0F4C5C] font-bold flex items-center gap-0.5 shrink-0 group-hover:translate-x-0.5 transition-transform">
                        Carte
                        <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

      </div>

    </div>
  );
}

