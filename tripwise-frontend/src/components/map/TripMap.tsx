import React, { useEffect, useRef, useState } from 'react';
import { MapLocation } from '@/store/wizardStore';

const PIN_COLORS = {
    hotel: '#8b5cf6',
    airport: '#3b82f6',
    sightseeing: '#f59e0b',
    transport: '#10b981',
    restaurant: '#ef4444',
    activity: '#f97316',
} as const;

type PinType = keyof typeof PIN_COLORS;

function getPinColor(type: string): string {
    const safe: Record<PinType, string> = PIN_COLORS;
    switch (type as PinType) {
        case 'hotel': return safe.hotel;
        case 'airport': return safe.airport;
        case 'sightseeing': return safe.sightseeing;
        case 'transport': return safe.transport;
        case 'restaurant': return safe.restaurant;
        case 'activity': return safe.activity;
        default: return '#6366f1';
    }
}

interface TripMapProps {
    places: MapLocation[];
}

const TripMap: React.FC<TripMapProps> = ({ places }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const mapRef = useRef<any>(null);
    const olaMapsRef = useRef<any>(null);
    const markersRef = useRef<any[]>([]);
    const [mapReady, setMapReady] = useState(false);

    useEffect(() => {
        if (!containerRef.current) return;
        const apiKey = import.meta.env.VITE_OLA_MAPS_API_KEY;
        if (!apiKey || apiKey === 'your_ola_maps_api_key_here') return;

        let cancelled = false;

        import('olamaps-web-sdk').then(({ OlaMaps }) => {
            if (cancelled || !containerRef.current) return;

            const olaMaps = new OlaMaps({ apiKey });
            olaMapsRef.current = olaMaps;

            olaMaps.init({
                container: containerRef.current,
                center: [78.9629, 20.5937],
                zoom: 4.5,
                style: `https://api.olamaps.io/tiles/vector/v1/styles/default-light-standard/style.json?api_key=${apiKey}`,
            }).then((map: any) => {
                if (cancelled) { map.remove(); return; }
                mapRef.current = map;
                // init() may resolve after the load event fires — check immediately
                if (map.loaded()) {
                    if (!cancelled) setMapReady(true);
                } else {
                    map.once('load', () => { if (!cancelled) setMapReady(true); });
                }
            });
        });

        return () => {
            cancelled = true;
            markersRef.current.forEach(m => { try { m.remove(); } catch {} });
            markersRef.current = [];
            try { mapRef.current?.remove(); } catch {}
            mapRef.current = null;
            olaMapsRef.current = null;
            setMapReady(false);
        };
    }, []);

    useEffect(() => {
        if (!mapReady || !mapRef.current || !olaMapsRef.current) return;

        markersRef.current.forEach(m => { try { m.remove(); } catch {} });
        markersRef.current = [];

        if (places.length === 0) return;

        places.forEach(place => {
            const color = getPinColor(place.type);
            try {
                const marker = olaMapsRef.current
                    .addMarker({ offset: [0, -6], anchor: 'bottom', color })
                    .setLngLat([place.lng, place.lat])
                    .addTo(mapRef.current);
                markersRef.current.push(marker);
            } catch {}
        });

        if (places.length === 1) {
            mapRef.current.flyTo({ center: [places[0].lng, places[0].lat], zoom: 12, duration: 800 });
        } else {
            const lngs = places.map(p => p.lng);
            const lats = places.map(p => p.lat);
            mapRef.current.fitBounds(
                [[Math.min(...lngs), Math.min(...lats)], [Math.max(...lngs), Math.max(...lats)]],
                { padding: 60, duration: 800 }
            );
        }
    }, [mapReady, places]);

    const apiKey = import.meta.env.VITE_OLA_MAPS_API_KEY;
    const noKey = !apiKey || apiKey === 'your_ola_maps_api_key_here';

    return (
        <div className="w-full h-full rounded-2xl overflow-hidden border border-slate-200/50 bg-slate-50/40 relative">
            {noKey ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-xl">🗺️</div>
                    <p className="text-xs text-slate-500 font-medium">Add <code className="text-indigo-600">VITE_OLA_MAPS_API_KEY</code> to <code className="text-indigo-600 font-semibold">.env</code> to enable the map</p>
                </div>
            ) : (
                <>
                    <div ref={containerRef} className="w-full h-full" />
                    {!mapReady && (
                        <div className="absolute inset-0 flex items-center justify-center bg-slate-50/80">
                            <div className="flex gap-1.5">
                                {[0, 1, 2].map(i => (
                                    <div key={i} className="w-2 h-2 rounded-full bg-primary/60 animate-pulse" style={{ animationDelay: `${i * 150}ms` }} />
                                ))}
                            </div>
                        </div>
                    )}
                    {/* Pin legend */}
                    {mapReady && places.length > 0 && (
                        <div className="absolute bottom-3 left-3 bg-white/90 border border-slate-200/50 backdrop-blur-sm rounded-xl px-3 py-2 flex flex-wrap gap-x-3 gap-y-1 max-w-[200px] shadow-sm">
                            {Object.entries(PIN_COLORS)
                                .filter(([type]) => places.some(p => p.type === type))
                                .map(([type, color]) => (
                                    <span key={type} className="flex items-center gap-1 text-[9px] font-semibold uppercase tracking-wider text-slate-600">
                                        <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: color }} />
                                        {type}
                                    </span>
                                ))}
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default TripMap;
