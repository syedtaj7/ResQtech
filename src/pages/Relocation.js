import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Popup, Circle } from 'react-leaflet';
import { Link } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';
import { safeLocationService } from '../services/safeLocationService';

function Relocation() {
  const [search, setSearch] = useState('');
  const [safeLocations, setSafeLocations] = useState([]);
  const defaultCenter = [20.5937, 78.9629]; // India center

  useEffect(() => {
    const locations = safeLocationService.getAllSafeLocations();
    setSafeLocations(locations);

    const interval = setInterval(() => {
      const updatedLocations = safeLocationService.getAllSafeLocations();
      setSafeLocations(updatedLocations);
    }, 60000); // Update UI every minute

    return () => clearInterval(interval);
  }, []);

  const filterLocations = (searchTerm) => {
    if (!searchTerm) return Object.entries(safeLocations);
    return Object.entries(safeLocations).filter(([name]) => 
      name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-900 text-white">
      <header className="bg-gradient-to-r from-blue-800 to-blue-600 text-white">
        <nav className="container mx-auto px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold">ResQTech - Safe Relocation</div>
            <div className="hidden md:flex space-x-6">
              <Link to="/" className="hover:text-blue-200 transition-colors">Home</Link>
              <Link to="/relocation" className="text-blue-200 font-semibold">Relocation</Link>
              <Link to="/community-help" className="hover:text-blue-200 transition-colors">Community Help</Link>
              <Link to="/mitigation" className="hover:text-blue-200 transition-colors">Mitigation</Link>
              <Link to="/about" className="hover:text-blue-200 transition-colors">About</Link>
            </div>
          </div>
        </nav>
      </header>

      <main className="flex-grow p-5">
        <div className="grid grid-cols-3 gap-6">
          {/* Map Section */}
          <div className="col-span-2 bg-gray-800 p-6 rounded-xl shadow-xl">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              </svg>
              Safe Relocation Zones
            </h2>
            <div className="h-[600px] w-full relative rounded-xl overflow-hidden">
              <MapContainer
                center={defaultCenter}
                zoom={5}
                className="h-full w-full"
                scrollWheelZoom={true}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                />
                {safeLocations.map((zone) => (
                  <Circle
                    key={zone.name}
                    center={zone.coordinates}
                    radius={25000}
                    pathOptions={{
                      color: zone.score >= 90 ? '#10B981' : // green
                             zone.score >= 80 ? '#FBBF24' : // yellow
                             '#DC2626', // red
                      fillOpacity: 0.2
                    }}
                  >
                    <Popup>
                      <div className="bg-white p-4 rounded-lg">
                        <h3 className="font-bold text-gray-900">{zone.name.toUpperCase()}</h3>
                        <p className="text-green-600">Safety Score: {zone.score}%</p>
                        <p className="text-gray-600">Capacity: {zone.capacity}</p>
                        <div className="mt-2">
                          <p className="text-gray-700">{zone.description}</p>
                          <div className="mt-2">
                            <p className="font-semibold text-gray-700">Available Facilities:</p>
                            <ul className="list-disc list-inside text-gray-600">
                              {zone.facilities.map((facility, index) => (
                                <li key={index}>{facility}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </Popup>
                  </Circle>
                ))}
              </MapContainer>
            </div>
          </div>

          {/* Search and Info Section */}
          <div className="col-span-1 bg-gray-800 p-5 rounded-lg flex flex-col h-[calc(600px+2.5rem)]">
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-3">Find Safe Locations</h2>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search safe locations..."
                  className="w-full p-2 pl-10 rounded-md text-black"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <svg 
                  className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            <div className="flex-1 overflow-hidden">
              <h2 className="text-lg font-semibold mb-3">Safe Zones</h2>
              <div className="overflow-y-auto h-full pr-2 custom-scrollbar">
                {filterLocations(search).map(([name, data]) => (
                  <div 
                    key={name}
                    className="bg-gray-700 p-4 rounded-lg mb-3 hover:bg-gray-600 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center mt-2">
                      <div className={`w-2 h-2 rounded-full mr-2 ${
                        data.score >= 90 ? 'bg-green-500' :
                        data.score >= 80 ? 'bg-yellow-500' :
                        'bg-red-500'
                      }`}></div>
                      <span className="text-sm">Safety Score: {data.score}%</span>
                    </div>
                    <p className="text-gray-300 text-sm mt-2">{data.description}</p>
                    <div className="mt-2">
                      <span className="text-sm text-blue-400">Capacity: {data.capacity}</span>
                      <ul className="mt-2 text-sm text-gray-400">
                        {data.facilities.map((facility, index) => (
                          <li key={index}>• {facility}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Relocation;