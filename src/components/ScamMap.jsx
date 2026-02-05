import React from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Activity } from 'lucide-react';

const SCAM_DATA = [
    { city: "Mumbai", lat: 19.0760, lng: 72.8777, count: 243, risk: "High" },
    { city: "Delhi", lat: 28.7041, lng: 77.1025, count: 189, risk: "High" },
    { city: "Bangalore", lat: 12.9716, lng: 77.5946, count: 156, risk: "Medium" },
    { city: "Hyderabad", lat: 17.3850, lng: 78.4867, count: 112, risk: "Medium" },
    { city: "Chennai", lat: 13.0827, lng: 80.2707, count: 98, risk: "Medium" },
    { city: "Kolkata", lat: 22.5726, lng: 88.3639, count: 87, risk: "Low" },
    { city: "Pune", lat: 18.5204, lng: 73.8567, count: 76, risk: "Low" },
    { city: "Jaipur", lat: 26.9124, lng: 75.7873, count: 45, risk: "Low" }
];

const ScamMap = () => {
    return (
        <section className="py-24 px-4 relative overflow-hidden">
            {/* Decoration */}
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

            <div className="max-w-7xl mx-auto">
                <div className="mb-12 text-center space-y-4">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-orange-500/30 bg-orange-500/10 backdrop-blur-sm">
                        <Activity size={16} className="text-orange-500 animate-pulse" />
                        <span className="text-xs font-bold uppercase tracking-widest text-orange-400">Live Threat Intelligence</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-black text-white px-4 cinematic-text">
                        Global Fraud Heatmap
                    </h2>
                    <p className="text-slate-400 max-w-2xl mx-auto">
                        Real-time visualization of anonymous threat markers detected by the RakshaVaani neural network across India.
                    </p>
                </div>

                <div className="h-[600px] w-full rounded-3xl overflow-hidden border border-white/10 shadow-2xl relative z-0">
                    <MapContainer
                        center={[20.5937, 78.9629]}
                        zoom={5}
                        scrollWheelZoom={false}
                        className="h-full w-full bg-[#1a1a1a]"
                        zoomControl={false}
                    >
                        {/* Dark Matter Tiles for Cyber Look - Free CartoDB */}
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                        />

                        {SCAM_DATA.map((data, idx) => (
                            <CircleMarker
                                key={idx}
                                center={[data.lat, data.lng]}
                                pathOptions={{
                                    color: data.risk === 'High' ? '#f97316' : data.risk === 'Medium' ? '#eab308' : '#22c55e',
                                    fillColor: data.risk === 'High' ? '#f97316' : data.risk === 'Medium' ? '#eab308' : '#22c55e',
                                    fillOpacity: 0.5,
                                    weight: 0
                                }}
                                radius={data.risk === 'High' ? 20 : data.risk === 'Medium' ? 15 : 10}
                            >
                                <Popup className="glass-popup">
                                    <div className="text-slate-900 font-bold text-lg">{data.city}</div>
                                    <div className="text-slate-600">Reports: {data.count}</div>
                                    <div className={`font-black uppercase text-xs mt-1 ${data.risk === 'High' ? 'text-red-600' : 'text-yellow-600'
                                        }`}>
                                        Threat Level: {data.risk}
                                    </div>
                                </Popup>
                                {/* Pulse Effect */}
                                <CircleMarker
                                    center={[data.lat, data.lng]}
                                    pathOptions={{
                                        color: data.risk === 'High' ? '#f97316' : '#eab308',
                                        fillOpacity: 0,
                                        weight: 1,
                                    }}
                                    radius={data.risk === 'High' ? 40 : 25}
                                />
                            </CircleMarker>
                        ))}
                    </MapContainer>

                    {/* Overlay UI */}
                    <div className="absolute bottom-6 left-6 z-[1000] glass px-6 py-4 rounded-xl border border-white/10">
                        <div className="text-[10px] uppercase tracking-widest text-slate-500 mb-2">Live Status</div>
                        <div className="flex items-center gap-3">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                            <span className="text-white font-mono text-sm">System Online</span>
                        </div>
                        <div className="flex items-center gap-3 mt-1">
                            <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                            <span className="text-white font-mono text-sm">Monitoring 1.2M+ Nodes</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ScamMap;
