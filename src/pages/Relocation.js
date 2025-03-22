import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { MapContainer, TileLayer, Popup, Circle, Polyline } from 'react-leaflet';
import { Link } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';
import { safeLocations as safeLocationsData } from '../data/safeLocations';
// Removed unused import for 'getNearestSafeZone'

function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">About ResQTech</h3>
            <p className="text-gray-400 text-sm">
              Real-time disaster monitoring and management system for India
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-400 hover:text-white text-sm">Home</Link></li>
              <li><Link to="/mitigation" className="text-gray-400 hover:text-white text-sm">Mitigation</Link></li>
              <li><Link to="/community-help" className="text-gray-400 hover:text-white text-sm">Community Help</Link></li>
              <li><Link to="/about" className="text-gray-400 hover:text-white text-sm">About</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Emergency Contacts</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>National Emergency: 112</li>
              <li>Ambulance: 108</li>
              <li>Police: 100</li>
              <li>Fire: 101</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Connect With Us</h3>
            <div className="flex space-x-4">
              <button className="text-gray-400 hover:text-white">
                <span className="sr-only">Twitter</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"/>
                </svg>
              </button>
              <a href="https://github.com/your-github-repo" className="text-gray-400 hover:text-white">
                <span className="sr-only">GitHub</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-700 pt-8 text-center text-sm text-gray-400">
          © {new Date().getFullYear()} ResQTech. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

// Add debounce utility
const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Add this function at the top level
const fetchNearbyHospitals = async (lat, lon, radius = 5000) => {
  try {
    const query = `
      [out:json][timeout:25];
      (
        node["amenity"="hospital"](around:${radius},${lat},${lon});
        way["amenity"="hospital"](around:${radius},${lat},${lon});
        relation["amenity"="hospital"](around:${radius},${lat},${lon});
      );
      out body;
      >;
      out skel qt;
    `;

    const response = await fetch('https://overpass-api.de/api/interpreter', {
      method: 'POST',
      body: query
    });

    const data = await response.json();
    return data.elements.map(element => ({
      id: element.id,
      name: element.tags?.name || 'Unnamed Hospital',
      coordinates: [element.lat, element.lon],
      type: element.tags?.healthcare || 'Hospital',
      emergency: element.tags?.emergency || 'yes',
      phone: element.tags?.phone || 'N/A',
      address: element.tags?.['addr:full'] || element.tags?.['addr:street'] || 'Address not available'
    }));
  } catch (error) {
    console.error('Error fetching nearby hospitals:', error);
    return [];
  }
};

function Relocation() {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState(null);
  const [nearestSafeZone, setNearestSafeZone] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const defaultCenter = [20.5937, 78.9629];
  const [locationSearch, setLocationSearch] = useState('');
  const [safeZoneSearch, setSafeZoneSearch] = useState('');
  const [travelDetails, setTravelDetails] = useState(null);

  // Move calculateTravelDetails to the top of component
  const calculateTravelDetails = useCallback((from, to) => {
    const distance = Math.round(to.distance);
    let recommendedMode;
    let estimatedTime;
    let route;

    if (distance > 700) {
      recommendedMode = 'air';
      estimatedTime = Math.ceil(distance/800);
      route = {
        primary: to.transportInfo.nearestAirport,
        steps: [
          'Get to nearest airport',
          'Take flight to destination',
          'Local transport to safe zone'
        ]
      };
    } else if (distance > 300) {
      recommendedMode = 'rail';
      estimatedTime = Math.ceil(distance/60);
      route = {
        primary: to.transportInfo.nearestStation,
        steps: [
          'Head to nearest railway station',
          'Take train to destination',
          'Local transport to safe zone'
        ]
      };
    } else {
      recommendedMode = 'road';
      estimatedTime = Math.ceil(distance/50);
      route = {
        primary: to.transportInfo.majorHighways.join(', '),
        steps: [
          'Take main highway',
          'Follow road signs to destination',
          'Local transport to safe zone'
        ]
      };
    }

    const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${from[0]},${from[1]}&destination=${to.coordinates[0]},${to.coordinates[1]}`;

    return {
      distance,
      recommendedMode,
      estimatedTime,
      route,
      googleMapsUrl
    };
  }, []);

  // Function to calculate distance between two points using Haversine formula
  const calculateDistance = useCallback((lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }, []);


  // Get user's location
  const getUserLocation = () => {
    if (navigator.geolocation) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const userCoords = [position.coords.latitude, position.coords.longitude];
          setUserLocation(userCoords);
          
          // Get location name using reverse geocoding
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${userCoords[0]}&lon=${userCoords[1]}&addressdetails=1`
            );
            const data = await response.json();
            
            const nearest = locations.reduce((closest, loc) => {
              const distance = calculateDistance(
                userCoords[0],
                userCoords[1],
                loc.coordinates[0],
                loc.coordinates[1]
              );
              if (!closest || distance < closest.distance) {
                return { ...loc, distance: parseFloat(distance.toFixed(1)) };
              }
              return closest;
            }, null);

            if (nearest) {
              setNearestSafeZone({
                ...nearest,
                userState: data.address?.state || 'Your Location'
              });
              const details = calculateTravelDetails(userCoords, nearest);
              setTravelDetails(details);
            }
          } catch (error) {
            console.error('Error getting location details:', error);
          }
          setLoading(false);
        },
        (error) => {
          console.error('Error getting location:', error);
          setLoading(false);
        }
      );
    }
  };

  
  // Add travel details calculation function

  // Update the handleLocationSearch function
const handleLocationSearch = useCallback(async (searchQuery) => {
  if (!searchQuery) return;

  try {
    setLoading(true);
    // 1. First get coordinates of searched location
    const locationResponse = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}, India&countrycodes=in&limit=1&addressdetails=1`
    );
    const locationData = await locationResponse.json();
    
    if (locationData.length > 0) {
      const location = locationData[0];
      const searchedCoords = [parseFloat(location.lat), parseFloat(location.lon)];
      setUserLocation(searchedCoords);
      
      // 2. Fetch hospitals near the searched location
      const hospitalsQuery = `
        [out:json][timeout:25];
        (
          node["amenity"="hospital"](around:10000,${searchedCoords[0]},${searchedCoords[1]});
          way["amenity"="hospital"](around:10000,${searchedCoords[0]},${searchedCoords[1]});
          relation["amenity"="hospital"](around:10000,${searchedCoords[0]},${searchedCoords[1]});
        );
        out body;
        >;
        out skel qt;
      `;

      const hospitalsResponse = await fetch('https://overpass-api.de/api/interpreter', {
        method: 'POST',
        body: hospitalsQuery
      });

      const hospitalsData = await hospitalsResponse.json();
      
      // 3. Process hospital data
      const nearbyHospitals = hospitalsData.elements
        .filter(element => element.tags && element.tags.name)
        .map(hospital => ({
          id: hospital.id,
          name: hospital.tags.name,
          coordinates: [hospital.lat, hospital.lon],
          type: hospital.tags.healthcare || 'Hospital',
          emergency: hospital.tags.emergency || 'yes',
          phone: hospital.tags.phone || hospital.tags['contact:phone'] || 'N/A',
          address: hospital.tags['addr:full'] || hospital.tags['addr:street'] || 'Address not available',
          distance: calculateDistance(
            searchedCoords[0],
            searchedCoords[1],
            hospital.lat,
            hospital.lon
          ).toFixed(1)
        }))
        .sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));

      // 4. Find nearest safe zone
      const nearest = locations.reduce((closest, loc) => {
        const distance = calculateDistance(
          searchedCoords[0],
          searchedCoords[1],
          loc.coordinates[0],
          loc.coordinates[1]
        );
        if (!closest || distance < closest.distance) {
          return { ...loc, distance: parseFloat(distance.toFixed(1)) };
        }
        return closest;
      }, null);

      if (nearest) {
        setNearestSafeZone({
          ...nearest,
          userState: location.address?.state || 'Unknown Location',
          searchedLocation: {
            name: location.display_name,
            coordinates: searchedCoords
          },
          nearbyHospitals: nearbyHospitals.slice(0, 5) // Show top 5 nearest hospitals
        });

        const details = calculateTravelDetails(searchedCoords, nearest);
        setTravelDetails(details);

        // Log found hospitals for debugging
        console.log(`Found ${nearbyHospitals.length} hospitals near ${searchQuery}`);
      }
    }
  } catch (error) {
    console.error('Error searching location:', error);
  } finally {
    setLoading(false);
  }
}, [locations, calculateTravelDetails, calculateDistance]);
  

  // Add debounce to search input
  const debouncedSearch = useCallback((value) => {
    const handler = debounce((searchVal) => handleLocationSearch(searchVal), 300);
    handler(value);
  }, [handleLocationSearch]);


  useEffect(() => {
    const loadSafeLocations = async () => {
      try {
        setLoading(true);
        // Transform the safeLocations object into an array with all required properties
        const locationsArray = Object.entries(safeLocationsData).map(([name, data]) => ({
          name,
          coordinates: data.coordinates,
          score: data.score,
          capacity: data.capacity,
          facilities: data.facilities,
          description: data.description,
          state: data.state,
          elevation: data.elevation,
          hasAirport: data.hasAirport,
          hasRailway: data.hasRailway,
          transportInfo: {
            nearestAirport: data.transportInfo?.nearestAirport || 'Not available',
            nearestStation: data.transportInfo?.nearestStation || 'Not available',
            majorHighways: data.transportInfo?.majorHighways || [],
            busTerminal: data.transportInfo?.busTerminal || 'Not available'
          }
        }));
        setLocations(locationsArray);
      } catch (error) {
        console.error('Error loading safe locations:', error);
        setLocations([]); 
      } finally {
        setLoading(false);
      }
    };

    loadSafeLocations();
  }, []);

  const filterLocations = useCallback((searchTerm) => {
    if (!searchTerm) return locations;
    return locations.filter(location => 
      location.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      location.state.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [locations]);

  const filteredLocations = useMemo(() => 
    filterLocations(safeZoneSearch),
    [safeZoneSearch, filterLocations]
  );
  const createHoverContent = (location) => `
    <div class="bg-white p-3 rounded shadow-lg max-w-xs">
      <h4 class="font-bold text-gray-900">${location.name.toUpperCase()}</h4>
      <div class="flex items-center mt-1">
        <div class="w-2 h-2 rounded-full mr-2 ${
          location.score >= 90 ? 'bg-green-500' :
          location.score >= 80 ? 'bg-yellow-500' :
          'bg-red-500'
        }"></div>
        <span class="text-sm text-gray-600">Safety Score: ${location.score}%</span>
      </div>
      <p class="text-sm text-gray-600 mt-1">${location.description}</p>
    </div>
  `;

// Remove duplicate declaration of calculateTravelDetails

// Add filtered locations handler
const getFilteredSafeZones = useCallback((searchTerm) => {
  if (!searchTerm) return locations;
  return locations.filter(location => 
    location.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    location.state.toLowerCase().includes(searchTerm.toLowerCase())
  );
}, [locations]);

// Update the LocationDetailsModal component
const LocationDetailsModal = ({ location, onClose }) => {
  const [nearbyHospitals, setNearbyHospitals] = useState([]);
  const [loadingHospitals, setLoadingHospitals] = useState(true);

  useEffect(() => {
    const loadHospitals = async () => {
      if (location?.coordinates) {
        setLoadingHospitals(true);
        const [lat, lon] = location.coordinates;
        const hospitals = await fetchNearbyHospitals(lat, lon);
        setNearbyHospitals(hospitals);
        setLoadingHospitals(false);
      }
    };

    loadHospitals();
  }, [location]);

  if (!location) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-xl w-full max-w-2xl relative">
        {/* Modal Header */}
        <div className="p-4 border-b border-gray-700">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-white">{location.name.toUpperCase()}</h2>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Modal Content - Scrollable */}
        <div className="overflow-y-auto p-4 max-h-[70vh] custom-scrollbar">
          {/* Safety Score */}
          <div className="bg-gray-700 p-4 rounded-lg mb-4">
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${
                location.score >= 90 ? 'bg-green-500' :
                location.score >= 80 ? 'bg-yellow-500' :
                'bg-red-500'
              }`}></div>
              <span className="text-lg font-medium text-white">Safety Score: {location.score}%</span>
            </div>
            <p className="text-gray-300 mt-2">{location.description}</p>
          </div>

          {/* Location Details */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-gray-700 p-3 rounded-lg">
              <p className="text-gray-400">State</p>
              <p className="text-white font-medium">{location.state}</p>
            </div>
            <div className="bg-gray-700 p-3 rounded-lg">
              <p className="text-gray-400">Elevation</p>
              <p className="text-white font-medium">{location.elevation}</p>
            </div>
            <div className="bg-gray-700 p-3 rounded-lg">
              <p className="text-gray-400">Capacity</p>
              <p className="text-white font-medium">{location.capacity}</p>
            </div>
          </div>

          {/* Transport Information */}
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-white mb-3">Transport Options</h3>
            <div className="space-y-3">
              {location.hasAirport && (
                <div className="bg-gray-700 p-3 rounded-lg flex items-start">
                  <span className="text-2xl mr-3">✈️</span>
                  <div>
                    <p className="text-white font-medium">Air Travel</p>
                    <p className="text-gray-400 text-sm">{location.transportInfo?.nearestAirport}</p>
                  </div>
                </div>
              )}
              {location.hasRailway && (
                <div className="bg-gray-700 p-3 rounded-lg flex items-start">
                  <span className="text-2xl mr-3">🚂</span>
                  <div>
                    <p className="text-white font-medium">Railway</p>
                    <p className="text-gray-400 text-sm">{location.transportInfo?.nearestStation}</p>
                  </div>
                </div>
              )}
              <div className="bg-gray-700 p-3 rounded-lg flex items-start">
                <span className="text-2xl mr-3">🚌</span>
                <div>
                  <p className="text-white font-medium">Bus Transport</p>
                  <p className="text-gray-400 text-sm">{location.transportInfo?.busTerminal}</p>
                </div>
              </div>
              {location.transportInfo?.majorHighways?.length > 0 && (
                <div className="bg-gray-700 p-3 rounded-lg flex items-start">
                  <span className="text-2xl mr-3">🛣️</span>
                  <div>
                    <p className="text-white font-medium">Major Highways</p>
                    <p className="text-gray-400 text-sm">{location.transportInfo.majorHighways.join(', ')}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Available Facilities */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-3">Available Facilities</h3>
            <div className="bg-gray-700 p-4 rounded-lg">
              <div className="flex flex-wrap gap-2">
                {location.facilities.map((facility, index) => (
                  <span key={index} className="bg-gray-600 text-gray-200 px-3 py-1 rounded-full text-sm">
                    {facility}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Add Nearby Hospitals Section */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-white mb-3">
              <span className="mr-2">🏥</span>
              Nearby Hospitals
            </h3>
            {loadingHospitals ? (
              <div className="animate-pulse space-y-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="bg-gray-700 h-16 rounded-lg"></div>
                ))}
              </div>
            ) : nearbyHospitals.length > 0 ? (
              <div className="space-y-3">
                {nearbyHospitals.map(hospital => (
                  <div key={hospital.id} className="bg-gray-700 p-4 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-white font-medium">{hospital.name}</h4>
                        <p className="text-gray-400 text-sm">{hospital.address}</p>
                        {hospital.phone !== 'N/A' && (
                          <p className="text-gray-400 text-sm">📞 {hospital.phone}</p>
                        )}
                      </div>
                      <a
                        href={`https://www.google.com/maps/dir/?api=1&destination=${hospital.coordinates[0]},${hospital.coordinates[1]}&travelmode=driving`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-1 rounded flex items-center"
                      >
                        <span className="mr-1">🚗</span>
                        Directions
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 text-gray-400">
                No hospitals found in the nearby area
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
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

      <main className="flex-grow p-5 mb-16">
        <div className="grid grid-cols-3 gap-6 h-[calc(100vh-12rem)]"> {/* Fixed height instead of min-height */}
          {/* Map container */}
          <div className="col-span-2 bg-gray-800 p-6 rounded-xl shadow-xl flex flex-col h-full">
            <div className="mb-4 flex gap-4">
              <button
                onClick={getUserLocation}
                className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700 transition-colors"
              >
                Use My Location
              </button>
              <div className="flex-1 relative search-container">
                <input
                  type="text"
                  value={locationSearch}
                  onChange={(e) => {
                    setLocationSearch(e.target.value);
                    debouncedSearch(e.target.value);
                  }}
                  placeholder="Enter location and press Enter..."
                  className="w-full p-2 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                <button
                  onClick={() => handleLocationSearch(locationSearch)}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  <svg 
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="flex-1 relative rounded-xl overflow-hidden">
              <MapContainer
                center={userLocation || defaultCenter}
                zoom={userLocation ? 8 : 5}
                className="h-full w-full"
                scrollWheelZoom={true}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                />
                
                {/* User Location Marker */}
                {userLocation && (
                  <Circle
                    center={userLocation}
                    radius={5000}
                    pathOptions={{ color: 'red', fillColor: 'red' }}
                  >
                    <Popup>Your Location</Popup>
                  </Circle>
                )}

                {/* Path to nearest safe zone */}
                {userLocation && nearestSafeZone && (
                  <Polyline
                    positions={[userLocation, nearestSafeZone.coordinates]}
                    pathOptions={{ color: 'yellow' }}
                  />
                )}

                {!loading && filteredLocations.map((zone) => (
                  <Circle
                    key={zone.name}
                    center={zone.coordinates}
                    radius={25000}
                    pathOptions={{
                      color: zone.score >= 90 ? '#10B981' : 
                             zone.score >= 80 ? '#FBBF24' : 
                             '#DC2626',
                      fillOpacity: 0.2
                    }}
                    eventHandlers={{
                      mouseover: (e) => {
                        const layer = e.target;
                        layer.setStyle({
                          fillOpacity: 0.4,
                          weight: 2
                        });
                        layer.bindTooltip(createHoverContent(zone), {
                          direction: 'top',
                          sticky: true,
                          offset: [0, -10],
                          opacity: 1,
                          className: 'custom-tooltip'
                        }).openTooltip();
                      },
                      mouseout: (e) => {
                        const layer = e.target;
                        layer.setStyle({
                          fillOpacity: 0.2,
                          weight: 1
                        });
                        layer.unbindTooltip();
                      },
                      click: () => {
                        // Keep the existing popup behavior
                      }
                    }}
                  >
                    <Popup maxWidth={300} className="custom-popup">
                      <div className="bg-white rounded-lg p-4">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                          {zone.name.toUpperCase()}
                        </h3>
                        
                        <div className="flex items-center mb-3">
                          <div className={`w-3 h-3 rounded-full mr-2 ${
                            zone.score >= 90 ? 'bg-green-500' :
                            zone.score >= 80 ? 'bg-yellow-500' :
                            'bg-red-500'
                          }`}></div>
                          <span className="font-medium text-gray-700">
                            Safety Score: {zone.score}%
                          </span>
                        </div>

                        <div className="text-gray-600 mb-3">
                          <p className="mb-1"><span className="font-medium">State:</span> {zone.state}</p>
                          <p className="mb-1"><span className="font-medium">Elevation:</span> {zone.elevation}</p>
                          <p><span className="font-medium">Capacity:</span> {zone.capacity}</p>
                        </div>

                        <div className="mb-4">
                          <p className="text-gray-700">{zone.description}</p>
                        </div>

                        <div className="border-t pt-3">
                          <h4 className="font-semibold text-gray-800 mb-2">Transport Info</h4>
                          <ul className="space-y-2 text-sm text-gray-600">
                            {zone.hasAirport && zone.transportInfo?.nearestAirport && (
                              <li className="flex items-center">
                                <span className="mr-2">✈️</span>
                                {zone.transportInfo.nearestAirport}
                              </li>
                            )}
                            {zone.hasRailway && zone.transportInfo?.nearestStation && (
                              <li className="flex items-center">
                                <span className="mr-2">🚂</span>
                                {zone.transportInfo.nearestStation}
                              </li>
                            )}
                            {zone.transportInfo?.busTerminal && (
                              <li className="flex items-center">
                                <span className="mr-2">🚌</span>
                                {zone.transportInfo.busTerminal}
                              </li>
                            )}
                            {zone.transportInfo?.majorHighways?.length > 0 && (
                              <li className="flex items-center">
                                <span className="mr-2">🛣️</span>
                                Highways: {zone.transportInfo.majorHighways.join(', ')}
                              </li>
                            )}
                          </ul>
                        </div>

                        <div className="border-t pt-3 mt-3">
                          <h4 className="font-semibold text-gray-800 mb-2">Available Facilities</h4>
                          <ul className="list-disc list-inside text-gray-600 text-sm">
                            {zone.facilities.map((facility, index) => (
                              <li key={index}>{facility}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </Popup>
                  </Circle>
                ))}
              </MapContainer>
            </div>
          </div>

          {/* Right sidebar */}
          <div className="col-span-1 bg-gray-800 rounded-lg flex flex-col h-full overflow-hidden">
            {/* Fixed header */}
            <div className="p-4 border-b border-gray-700 bg-gray-800 sticky top-0 z-10">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search safe locations..."
                  className="w-full p-2 pl-10 pr-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  value={safeZoneSearch}
                  onChange={(e) => setSafeZoneSearch(e.target.value)}
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

            {/* Single scrollable container */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              {nearestSafeZone && (
                <div className="p-4 bg-gray-750 border-b border-gray-700">
                  <div className="flex justify-between items-center mb-3">
                    <h2 className="text-lg font-semibold text-blue-400">Nearest Safe Zone</h2>
                    <button
                      onClick={() => {
                        setNearestSafeZone(null);
                        setUserLocation(null);
                        setTravelDetails(null);
                      }}
                      className="text-sm px-2 py-1 bg-gray-600 hover:bg-gray-500 rounded text-gray-200 flex items-center"
                    >
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      Clear
                    </button>
                  </div>

                  <div className="bg-gray-700 rounded-lg p-4 shadow-lg space-y-4">
                    {/* Basic Info */}
                    <div>
                      <h3 className="font-medium text-white mb-2">{nearestSafeZone.name}</h3>
                      <div className="flex items-center space-x-2 mb-2">
                        <div className={`w-2 h-2 rounded-full ${
                          nearestSafeZone.score >= 90 ? 'bg-green-500' :
                          nearestSafeZone.score >= 80 ? 'bg-yellow-500' :
                          'bg-red-500'
                        }`}></div>
                        <span className="text-sm text-gray-300">Safety Score: {nearestSafeZone.score}%</span>
                      </div>
                      <div className="text-sm text-gray-400">
                        <p>From: {nearestSafeZone.userState || 'Your Location'}</p>
                        <p>To: {nearestSafeZone.state}</p>
                        <p className="text-green-400">Distance: {nearestSafeZone.distance} km</p>
                      </div>
                    </div>

                    {/* Travel Details */}
                    {travelDetails && (
                      <div className="border-t border-gray-600 pt-4">
                        <h4 className="text-sm font-semibold text-white mb-3">Recommended Travel Route</h4>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-400">Best Mode:</span>
                            <span className="text-white">
                              {travelDetails.recommendedMode === 'air' ? '✈️ Air Travel' :
                               travelDetails.recommendedMode === 'rail' ? '🚂 Railway' :
                               '🚗 Road Transport'}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-400">Est. Travel Time:</span>
                            <span className="text-white">{travelDetails.estimatedTime} hours</span>
                          </div>
                          <div className="text-sm">
                            <p className="text-gray-400 mb-2">Route Steps:</p>
                            <ol className="list-decimal list-inside space-y-1">
                              {travelDetails.route.steps.map((step, index) => (
                                <li key={index} className="text-gray-300">{step}</li>
                              ))}
                            </ol>
                          </div>
                          <a
                            href={travelDetails.googleMapsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block text-center bg-blue-600 hover:bg-blue-700 transition-colors text-white py-2 px-4 rounded-lg text-sm"
                          >
                            View Route on Google Maps 🗺️
                          </a>
                        </div>
                      </div>
                    )}

                    <button 
                      className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
                      onClick={() => {
                        setSelectedLocation(nearestSafeZone);
                        setShowDetails(true);
                      }}
                    >
                      View Full Details →
                    </button>
                    {/* Add Nearby Hospitals Section */}
                    {nearestSafeZone.nearbyHospitals && nearestSafeZone.nearbyHospitals.length > 0 && (
                      <div className="border-t border-gray-600 pt-4 mt-4">
                        <h4 className="text-sm font-semibold text-white mb-3">
                          <span className="mr-2">🏥</span>
                          Nearby Hospitals
                        </h4>
                        <div className="space-y-2">
                          {nearestSafeZone.nearbyHospitals.slice(0, 3).map((hospital, index) => (
                            <div key={index} className="bg-gray-600 rounded p-2">
                              <div className="flex justify-between items-start">
                                <div>
                                  <p className="text-sm text-white">{hospital.name}</p>
                                  <p className="text-xs text-gray-400">{hospital.distance}km away</p>
                                </div>
                                <a
                                  href={`https://www.google.com/maps/dir/?api=1&destination=${hospital.coordinates[0]},${hospital.coordinates[1]}&travelmode=driving`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-xs bg-blue-600 hover:bg-blue-700 px-2 py-1 rounded text-white"
                                >
                                  🚗 Route
                                </a>
                              </div>
                              {hospital.phone !== 'N/A' && (
                                <p className="text-xs text-gray-400 mt-1">📞 {hospital.phone}</p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="p-4">
                <h2 className="text-lg font-semibold text-white mb-3 sticky top-0 bg-gray-800 py-2">
                  Available Safe Zones
                </h2>
                <div className="space-y-3">
                  {loading ? (
                    <div className="animate-pulse space-y-3">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="bg-gray-700 rounded-lg p-4 h-24"></div>
                      ))}
                    </div>
                  ) : getFilteredSafeZones(safeZoneSearch).length > 0 ? (
                    getFilteredSafeZones(safeZoneSearch).map((location) => (
                      <button
                        key={location.name}
                        className="w-full text-left bg-gray-700 rounded-lg p-3 hover:bg-gray-650 transition-all transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onClick={() => {
                          setUserLocation(location.coordinates);
                          setNearestSafeZone(location);
                          setSelectedLocation(location);
                          setShowDetails(true);
                        }}
                      >
                        <h3 className="font-medium text-white text-sm mb-1">{location.name}</h3>
                        <div className="flex items-center space-x-2 mb-2">
                          <div className={`w-2 h-2 rounded-full ${
                            location.score >= 90 ? 'bg-green-500' :
                            location.score >= 80 ? 'bg-yellow-500' :
                            'bg-red-500'
                          }`}></div>
                          <span className="text-xs text-gray-400">Score: {location.score}%</span>
                          <span className="text-xs text-gray-400">• {location.state}</span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {location.hasAirport && (
                            <span className="inline-flex items-center text-xs bg-gray-600 px-1.5 py-0.5 rounded">
                              ✈️
                            </span>
                          )}
                          {location.hasRailway && (
                            <span className="inline-flex items-center text-xs bg-gray-600 px-1.5 py-0.5 rounded">
                              🚂
                            </span>
                          )}
                          <span className="inline-flex items-center text-xs bg-gray-600 px-1.5 py-0.5 rounded">
                            🚌
                          </span>
                        </div>
                        <button 
                          className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
                          onClick={() => {
                            setSelectedLocation(location);
                            setShowDetails(true);
                          }}
                        >
                          View Details →
                        </button>
                      </button>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-400">
                      <svg className="w-12 h-12 mx-auto mb-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p>No safe locations found{safeZoneSearch ? ' for your search' : ''}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      {showDetails && (
        <LocationDetailsModal
          location={selectedLocation}
          onClose={() => {
            setShowDetails(false);
            setSelectedLocation(null);
          }}
        />
      )}
    </div>
  );
}

export default Relocation;