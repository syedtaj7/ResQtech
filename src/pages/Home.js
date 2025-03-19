import { useState, useEffect, useCallback, useRef } from "react";
import { MapContainer, TileLayer, Popup, Rectangle, Polygon } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import React from 'react';
import { Link, NavLink } from 'react-router-dom';


// Add this after the icons constant
const severityColors = {
  high: {
    color: '#ef4444', // red-500
    fillColor: '#ef4444',
    fillOpacity: 0.3,
    weight: 2
  },
  moderate: {
    color: '#f59e0b', // yellow-500
    fillColor: '#f59e0b',
    fillOpacity: 0.3,
    weight: 2
  },
  low: {
    color: '#10b981', // green-500
    fillColor: '#10b981',
    fillOpacity: 0.3,
    weight: 2
  }
};

// Update the createCircleCoords function to be more efficient
const createCircleCoords = (center, radiusKm = 10) => {
  const points = 24; // Reduced from 32 to 24 points for better performance
  const earthRadius = 6371;
  const lat = center[0] * Math.PI / 180;
  const lon = center[1] * Math.PI / 180;
  const d = radiusKm / earthRadius;

  const coords = [];
  for (let i = 0; i <= points; i++) {
    const brng = 2 * Math.PI * i / points;
    const latPoint = Math.asin(Math.sin(lat) * Math.cos(d) + Math.cos(lat) * Math.sin(d) * Math.cos(brng));
    const lonPoint = lon + Math.atan2(
      Math.sin(brng) * Math.sin(d) * Math.cos(lat),
      Math.cos(d) - Math.sin(lat) * Math.sin(latPoint)
    );
    
    if (!isNaN(latPoint) && !isNaN(lonPoint)) {
      // Round coordinates to 4 decimal places to reduce complexity
      coords.push([
        Number((latPoint * 180 / Math.PI).toFixed(4)),
        Number((lonPoint * 180 / Math.PI).toFixed(4))
      ]);
    }
  }
  
  return coords;
};

// Removed unused constant boundsOptions and INDIA_BOUNDS

const locations = {
  // State Capitals
  'delhi': [28.7041, 77.1025],
  'mumbai': [19.0760, 72.8777],
  'bangalore': [12.9716, 77.5946],
  'chennai': [13.0827, 80.2707],
  'kolkata': [22.5726, 88.3639],
  'hyderabad': [17.3850, 78.4867],
  'thiruvananthapuram': [8.5241, 76.9366],
  'amaravati': [16.5150, 80.5187],
  'patna': [25.5941, 85.1376],
  'raipur': [21.2514, 81.6296],
  'panaji': [15.4909, 73.8278],
  'gandhinagar': [23.2156, 72.6369],
  'chandigarh': [30.7333, 76.7794],
  'shimla': [31.1048, 77.1734],
  'ranchi': [23.3441, 85.3096],
  'bhopal': [23.2599, 77.4126],
  'imphal': [24.8170, 93.9368],
  'shillong': [25.5788, 91.8933],
  'aizawl': [23.7307, 92.7173],
  'kohima': [25.6751, 94.1086],
  'bhubaneswar': [20.2961, 85.8245],
  'jaipur': [26.9124, 75.7873],
  'gangtok': [27.3389, 88.6065],
  'agartala': [23.8315, 91.2868],
  'lucknow': [26.8467, 80.9462],
  'dehradun': [30.3165, 78.0322],
  'dispur': [26.1433, 91.7898],

  // Major Cities & High Alert Areas
  'ahmedabad': [23.0225, 72.5714],
  'pune': [18.5204, 73.8567],
  'surat': [21.1702, 72.8311],
  'visakhapatnam': [17.6868, 83.2185],
  'kochi': [9.9312, 76.2673],
  'indore': [22.7196, 75.8577],
  'nagpur': [21.1458, 79.0882],
  'coimbatore': [11.0168, 76.9558],
  'varanasi': [25.3176, 82.9739],
  'guwahati': [26.1445, 91.7362],
  
  // Disaster-Prone Areas
  'porbandar': [21.6417, 69.6293],  // Cyclone prone
  'bhuj': [23.2420, 69.6669],       // Earthquake prone
  'mangalore': [12.9141, 74.8560],  // Coastal flooding
  'darjeeling': [27.0410, 88.2663], // Landslide prone
  'jammu': [32.7266, 74.8570],      // Flood prone
  'srinagar': [34.0837, 74.7973],   // Flood prone
  'puducherry': [11.9416, 79.8083], // Coastal flooding
  'port blair': [11.6234, 92.7265], // Tsunami prone
  'kavaratti': [10.5593, 72.6358],  // Cyclone prone
  'diu': [20.7144, 70.9874],        // Cyclone prone
  
  // Industrial Cities (Environmental Monitoring)
  'jamshedpur': [22.8046, 86.2029],
  'kanpur': [26.4499, 80.3319],
  'ludhiana': [30.9010, 75.8573],
  'vadodara': [22.3072, 73.1812],
  'rourkela': [22.2604, 84.8536],
  
  // Tourist Cities (High Population Density)
  'agra': [27.1767, 78.0081],
  'udaipur': [24.5854, 73.7125],
  'rishikesh': [30.0869, 78.2676],
  'madurai': [9.9252, 78.1198],
  'amritsar': [31.6340, 74.8723]
};

const defaultCenter = [20.5937, 78.9629];

// Add these constants at the top
const INDIA_BBOX = {
  north: 40.0,
  south: 5.0,
  west: 65.0,
  east: 100.0
};

// Add these API keys after the INDIA_BBOX constant
const API_KEYS = {
  NASA: 'Y1Cdfo9DlGrU5jC9ZhcwWMSdDlZB3xzac22qJUmn',
  NOAA: 'RKetBfTOLiCosTZesHkUNIwsygfpTCxs',
  OPENWEATHER: '80df7ef9d51c1d3f6322bb375bbb62b9'  // Updated OpenWeather API key
};

// Update fetchOpenWeatherData to use current weather, forecast, and air quality
const fetchOpenWeatherData = async (locations) => {
  const weatherData = [];
  try {
    console.log('Fetching weather data...');
    const promises = Object.entries(locations).map(async ([location, coords]) => {
      try {
        const [lat, lon] = coords;
        console.log(`Fetching data for ${location} at ${lat},${lon}`);
        
        const [currentResponse, forecastResponse] = await Promise.all([
          fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEYS.OPENWEATHER}&units=metric`),
          fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEYS.OPENWEATHER}&units=metric`)
        ]);

        if (!currentResponse.ok || !forecastResponse.ok) {
          throw new Error(`Weather API Error: ${currentResponse.status}`);
        }

        const [current, forecast] = await Promise.all([
          currentResponse.json(),
          forecastResponse.json()
        ]);
        console.log(`Data received for ${location}:`, current);

        if (current?.main && current?.weather?.[0]) {
          const conditions = {
            temp: current.main.temp,
            humidity: current.main.humidity,
            windSpeed: (current.wind?.speed || 0) * 3.6, // Convert m/s to km/h
            description: current.weather[0].description,
            pressure: current.main.pressure,
            rain: current.rain?.['1h'] || 0,
            snow: current.snow?.['1h'] || 0,
            visibility: current.visibility || 10000,
            clouds: current.clouds?.all || 0
          };

          const warnings = [];
          let severity = 'low';

          // Heat Related
          if (conditions.temp > 45) {
            severity = 'high';
            warnings.push('Extreme Heat Wave - Health Emergency');
          } else if (conditions.temp > 40) {
            severity = 'high';
            warnings.push('Severe Heat Wave Warning');
          } else if (conditions.temp > 35) {
            severity = 'moderate';
            warnings.push('Heat Wave Alert');
          }

          // Cold Related
          if (conditions.temp < 2) {
            severity = 'high';
            warnings.push('Extreme Cold Wave - Frost Risk');
          } else if (conditions.temp < 5) {
            severity = 'high';
            warnings.push('Severe Cold Wave Warning');
          } else if (conditions.temp < 10) {
            severity = 'moderate';
            warnings.push('Cold Wave Alert');
          }

          // Rainfall & Flooding
          if (conditions.rain > 150) {
            severity = 'high';
            warnings.push('Extreme Rainfall - Severe Flood Risk');
          } else if (conditions.rain > 100) {
            severity = 'high';
            warnings.push('Very Heavy Rainfall - Flash Flood Warning');
          } else if (conditions.rain > 50) {
            severity = 'high';
            warnings.push('Heavy Rainfall - Flood Alert');
          } else if (conditions.rain > 25) {
            severity = 'moderate';
            warnings.push('Moderate Rainfall Warning');
          }

          // Wind Conditions
          if (conditions.windSpeed > 166) {
            severity = 'high';
            warnings.push('Super Cyclonic Storm (Category 5)');
          } else if (conditions.windSpeed > 118) {
            severity = 'high';
            warnings.push('Very Severe Cyclonic Storm (Category 4)');
          } else if (conditions.windSpeed > 88) {
            severity = 'high';
            warnings.push('Severe Cyclonic Storm (Category 3)');
          } else if (conditions.windSpeed > 62) {
            severity = 'moderate';
            warnings.push('Cyclonic Storm (Category 2)');
          } else if (conditions.windSpeed > 40) {
            severity = 'moderate';
            warnings.push('Strong Wind Advisory');
          }

          // Pressure Systems
          if (conditions.pressure < 920) {
            severity = 'high';
            warnings.push('Extremely Low Pressure - Super Cyclone Risk');
          } else if (conditions.pressure < 950) {
            severity = 'high';
            warnings.push('Very Low Pressure - Severe Storm Risk');
          } else if (conditions.pressure < 980) {
            severity = 'moderate';
            warnings.push('Low Pressure System - Storm Alert');
          }

          // Visibility Conditions
          if (conditions.visibility < 200) {
            severity = 'high';
            warnings.push('Dense Fog - Zero Visibility Warning');
          } else if (conditions.visibility < 500) {
            severity = 'high';
            warnings.push('Very Dense Fog - Travel Advisory');
          } else if (conditions.visibility < 1000) {
            severity = 'moderate';
            warnings.push('Moderate Fog Alert');
          }

          // Drought & Dry Conditions
          if (conditions.humidity < 20 && conditions.temp > 35 && conditions.rain === 0) {
            severity = 'high';
            warnings.push('Severe Drought Conditions - Water Emergency');
          } else if (conditions.humidity < 30 && conditions.temp > 30 && conditions.rain === 0) {
            severity = 'high';
            warnings.push('Drought Warning - Water Conservation Alert');
          } else if (conditions.humidity < 40 && conditions.temp > 25 && conditions.rain === 0) {
            severity = 'moderate';
            warnings.push('Dry Weather Alert - Fire Risk');
          }

          // Snow Conditions (for northern regions)
          if (conditions.snow > 30) {
            severity = 'high';
            warnings.push('Heavy Snowfall - Avalanche Risk');
          } else if (conditions.snow > 15) {
            severity = 'high';
            warnings.push('Moderate Snowfall - Travel Advisory');
          } else if (conditions.snow > 5) {
            severity = 'moderate';
            warnings.push('Light Snowfall Alert');
          }

          // Thunderstorm Potential
          if (conditions.humidity > 80 && conditions.temp > 25 && conditions.pressure < 1000) {
            severity = 'high';
            warnings.push('Severe Thunderstorm Risk');
          } else if (conditions.humidity > 70 && conditions.temp > 22 && conditions.pressure < 1005) {
            severity = 'moderate';
            warnings.push('Thunderstorm Possibility');
          }

          // Check forecast for severe weather
          const forecastWarnings = forecast.list
            .slice(0, 8) // Next 24 hours
            .filter(item => {
              const forecastConditions = {
                temp: item.main.temp,
                windSpeed: (item.wind?.speed || 0) * 3.6,
                rain: (item.rain?.['3h'] || 0) / 3, // Convert 3h to 1h
                pressure: item.main.pressure,
                description: item.weather[0].main.toLowerCase()
              };

              return (
                forecastConditions.temp > 40 || 
                forecastConditions.temp < 10 ||
                forecastConditions.windSpeed > 62 ||
                forecastConditions.rain > 50 ||
                forecastConditions.pressure < 950 ||
                forecastConditions.description.includes('extreme') ||
                forecastConditions.description.includes('tornado') ||
                forecastConditions.description.includes('hurricane') ||
                forecastConditions.description.includes('storm')
              );
            })
            .map(item => ({
              time: new Date(item.dt * 1000),
              conditions: item.weather[0].description,
              temp: item.main.temp,
              windSpeed: (item.wind?.speed || 0) * 3.6,
              rain: (item.rain?.['3h'] || 0) / 3
            }));

          if (warnings.length > 0 || forecastWarnings.length > 0) {
            weatherData.push({
              id: `weather-${location}-${Date.now()}`,
              title: `Weather Alert: ${location}`,
              coordinates: coords,
              severity,
              type: 'Weather Warning',
              date: new Date().toISOString(),
              details: `Current Conditions:\n` +
                      `${conditions.description}\n` +
                      `Temperature: ${conditions.temp.toFixed(1)}°C\n` +
                      `Rainfall: ${conditions.rain.toFixed(1)} mm/h\n` +
                      `Wind Speed: ${conditions.windSpeed.toFixed(1)} km/h\n` +
                      `Pressure: ${conditions.pressure} hPa\n` +
                      `Humidity: ${conditions.humidity}%\n` +
                      `Visibility: ${(conditions.visibility/1000).toFixed(1)} km\n\n` +
                      `Active Warnings:\n${warnings.join('\n')}\n\n` +
                      (forecastWarnings.length > 0 ? 
                        `Forecast Warnings:\n${forecastWarnings.map(w => 
                          `${w.time.toLocaleTimeString()}: ${w.conditions} (${w.temp.toFixed(1)}°C, ${w.windSpeed.toFixed(1)} km/h)`
                        ).join('\n')}` : ''),
              source: 'OpenWeather',
              url: `https://openweathermap.org/city/${current.id}`,
            });
          }
          console.log('Weather conditions for', location, {
            conditions,
            warnings,
            severity
          });
        }
      } catch (error) {
        console.error(`Error fetching weather for ${location}:`, error);
      }
    });

    await Promise.all(promises);
  } catch (error) {
    console.error('Error in OpenWeather data fetch:', error);
  }

  return weatherData;
};

// Update the fetchEarthquakeData function with proper date formatting and parameters
const fetchEarthquakeData = async () => {
  try {
    // Format date properly for USGS API (YYYY-MM-DD)
    const today = new Date();
    const thirtyDaysAgo = new Date(today.getTime() - (30 * 24 * 60 * 60 * 1000));
    const startTime = thirtyDaysAgo.toISOString().split('T')[0];
    const endTime = today.toISOString().split('T')[0];

    // Construct the USGS API URL with proper parameters
    const queryParams = new URLSearchParams({
      format: 'geojson',
      starttime: startTime,
      endtime: endTime,
      minmagnitude: '4.0',
      maxlatitude: INDIA_BBOX.north,
      minlatitude: INDIA_BBOX.south,
      maxlongitude: INDIA_BBOX.east,
      minlongitude: INDIA_BBOX.west,
      orderby: 'magnitude'
    });

    const response = await fetch(`https://earthquake.usgs.gov/fdsnws/event/1/query?${queryParams.toString()}`);

    if (!response.ok) {
      console.error('USGS API Response:', await response.text());
      throw new Error(`USGS API Error: ${response.status}`);
    }

    const data = await response.json();
    console.log('USGS API Response:', data);
    console.log('Earthquake response:', data.features?.length || 0, 'earthquakes found');

    return data.features
      .filter(eq => {
        const [lon, lat] = eq.geometry.coordinates;
        // Additional filtering to ensure points are within India
        return lat >= INDIA_BBOX.south && 
               lat <= INDIA_BBOX.north && 
               lon >= INDIA_BBOX.west && 
               lon <= INDIA_BBOX.east;
      })
      .map(eq => ({
        id: `eq-${eq.id}`,
        title: `M${eq.properties.mag.toFixed(1)} Earthquake near ${eq.properties.place}`,
        coordinates: [eq.geometry.coordinates[1], eq.geometry.coordinates[0]],
        severity: eq.properties.mag >= 6 ? 'high' : 
                 eq.properties.mag >= 5 ? 'moderate' : 'low',
        type: 'Earthquake',
        date: new Date(eq.properties.time).toISOString(),
        details: formatEarthquakeDetails(eq.properties),
        source: 'USGS',
        url: eq.properties.url
      }));
  } catch (error) {
    console.error('Error fetching earthquake data:', error);
    return [];
  }
};

// Add helper function to format earthquake details
const formatEarthquakeDetails = (properties) => {
  return `Magnitude: ${properties.mag.toFixed(1)}\n` +
         `Depth: ${properties.depth} km\n` +
         `Location: ${properties.place}\n` +
         `Tsunami Risk: ${properties.tsunami === 1 ? 'Yes' : 'No'}\n` +
         `Intensity: ${properties.mmi ? `${properties.mmi} MMI` : 'Not available'}\n` +
         `Status: ${properties.status.charAt(0).toUpperCase() + properties.status.slice(1)}`;
};

// Update fetchLandslideData function
const fetchLandslideData = async () => {
  try {
    const response = await fetch(
      `https://eonet.gsfc.nasa.gov/api/v3/events?category=landslides&status=open&bbox=${INDIA_BBOX.west},${INDIA_BBOX.south},${INDIA_BBOX.east},${INDIA_BBOX.north}`
    );
    
    if (!response.ok) {
      throw new Error(`NASA API Error: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('NASA Landslide data:', data); // Debug log
    
    if (!data.events || !Array.isArray(data.events)) {
      console.warn('No landslide events found or invalid data format');
      return [];
    }
    
    return data.events
      .filter(event => event.geometry && event.geometry[0]?.coordinates)
      .map(event => ({
        id: `landslide-${event.id}`,
        title: `Landslide Risk: ${event.title}`,
        coordinates: event.geometry[0].coordinates.reverse(),
        severity: 'high',
        type: 'Landslide Warning',
        date: event.geometry[0].date || new Date().toISOString(),
        details: `Location: ${event.title}\nSource: ${event.sources?.[0]?.id || 'NASA EONET'}\nStatus: ${event.closed ? 'Closed' : 'Active'}`,
        source: 'NASA EONET',
        url: event.sources?.[0]?.url || 'https://eonet.gsfc.nasa.gov/api/v3/events'
      }));
  } catch (error) {
    console.error('Error fetching landslide data:', error);
    return [];
  }
};

// Update fetchTsunamiData function
const fetchTsunamiData = async () => {
  try {
    const today = new Date();
    const thirtyDaysAgo = new Date(today.getTime() - (30 * 24 * 60 * 60 * 1000));
    
    const startDate = thirtyDaysAgo.toISOString().split('T')[0];
    const endDate = today.toISOString().split('T')[0];

    // Using NCDC endpoint instead
    const response = await fetch(
      `https://www.ncdc.noaa.gov/cdo-web/api/v2/data?` +
      `datasetid=GHCND&` +
      `locationid=FIPS:IN&` + // India specific data
      `startdate=${startDate}&` +
      `enddate=${endDate}&` +
      `limit=1000`, {
        headers: {
          'token': API_KEYS.NOAA
        }
      }
    );
    
    if (!response.ok) {
      console.warn('NCDC API Response:', await response.text());
      return [];
    }
    
    const data = await response.json();
    console.log('NCDC Weather data:', data);

    // Transform the data
    return (data?.results || [])
      .filter(record => record.value !== null)
      .map((record, index) => ({
        id: `weather-${record.station}-${record.date}-${index}`, // Add date and index for uniqueness
        title: `Weather Event: ${record.station}`,
        coordinates: [record.latitude || defaultCenter[0], record.longitude || defaultCenter[1]],
        severity: determineWeatherSeverity(record),
        type: 'Weather Warning',
        date: record.date,
        details: formatWeatherDetails(record),
        source: 'NOAA/NCDC',
        url: 'https://www.ncdc.noaa.gov/cdo-web/'
      }));
  } catch (error) {
    console.error('Error fetching NCDC data:', error);
    return [];
  }
};

// Add helper functions
const determineWeatherSeverity = (record) => {
  // Add logic based on data values
  return 'moderate';
};

const formatWeatherDetails = (record) => {
  return `Station: ${record.station}\n` +
         `Data Type: ${record.datatype}\n` +
         `Value: ${record.value}\n` +
         `Date: ${new Date(record.date).toLocaleDateString()}`;
};

const fetchAirQualityData = async (locations) => {
  try {
    const promises = Object.entries(locations).map(async ([location, coords]) => {
      try {
        const [lat, lon] = coords;
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEYS.OPENWEATHER}`
        );

        if (!response.ok) throw new Error(`Air Quality API Error: ${response.status}`);
        const data = await response.json();

        // AQI levels: 1 = Good, 2 = Fair, 3 = Moderate, 4 = Poor, 5 = Very Poor
        if (data.list?.[0]?.main?.aqi) {
          const aqi = data.list[0].main.aqi;
          const components = data.list[0].components;
          
          return {
            id: `air-${location}-${Date.now()}`,
            title: `Air Quality Alert: ${location}`,
            coordinates: coords,
            severity: aqi >= 4 ? 'high' : 
                     aqi >= 3 ? 'moderate' : 'low',
            type: 'Air Quality Warning',
            date: new Date().toISOString(),
            details: `Air Quality Index: ${aqi}/5\n` +
                    `PM2.5: ${components.pm2_5} μg/m³\n` +
                    `PM10: ${components.pm10} μg/m³\n` +
                    `NO2: ${components.no2} μg/m³\n` +
                    `SO2: ${components.so2} μg/m³\n` +
                    `O3: ${components.o3} μg/m³\n` +
                    `CO: ${components.co} μg/m³`,
            source: 'OpenWeather Air Quality',
            url: 'https://openweathermap.org/api/air-pollution'
          };
        }
        return null;
      } catch (error) {
        console.error(`Error fetching air quality for ${location}:`, error);
        return null;
      }
    });
    
    const results = await Promise.all(promises);
    return results.filter(result => result !== null);
  } catch (error) {
    console.error('Error fetching air quality data:', error);
    return [];
  }
};

function Legend() {
  return (
    <div className="absolute bottom-8 right-8 bg-white p-4 rounded-lg shadow-lg z-[1000]">
      <h4 className="text-gray-900 font-bold mb-2">Severity Levels</h4>
      <div className="space-y-2">
        <div className="flex items-center">
          <div className="w-4 h-4 bg-red-600 mr-2 rounded"></div>
          <span className="text-gray-700">High Severity</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-yellow-400 mr-2 rounded"></div>
          <span className="text-gray-700">Moderate Severity</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-green-500 mr-2 rounded"></div>
          <span className="text-gray-700">Low/No Risk</span>
        </div>
      </div>
    </div>
  );
}

// Add these components just before the Home function
function Header() {
  return (
    <header className="bg-gradient-to-r from-blue-800 to-blue-600 text-white">
      <nav className="container mx-auto px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold">
            ResQTech - Disaster Management
          </div>
          <div className="hidden md:flex space-x-6">
            <NavLink to="/" 
              className={({ isActive }) => 
                `hover:text-blue-200 transition-colors ${isActive ? 'text-blue-200 font-semibold' : ''}`
              }
            >
              Home
            </NavLink>
            <NavLink to="/relocation" 
              className={({ isActive }) => 
                `hover:text-blue-200 transition-colors ${isActive ? 'text-blue-200 font-semibold' : ''}`
              }
            >
              Relocation
            </NavLink>
            <NavLink to="/community-help" 
              className={({ isActive }) => 
                `hover:text-blue-200 transition-colors ${isActive ? 'text-blue-200 font-semibold' : ''}`
              }
            >
              Community Help
            </NavLink>
            <NavLink to="/mitigation" 
              className={({ isActive }) => 
                `hover:text-blue-200 transition-colors ${isActive ? 'text-blue-200 font-semibold' : ''}`
              }
            >
              Mitigation
            </NavLink>
            <NavLink to="/about" 
              className={({ isActive }) => 
                `hover:text-blue-200 transition-colors ${isActive ? 'text-blue-200 font-semibold' : ''}`
              }
            >
              About
            </NavLink>
          </div>
        </div>
      </nav>
    </header>
  );
}

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
              <a href="https://twitter.com/ResQTech" className="text-gray-400 hover:text-white" target="_blank" rel="noopener noreferrer">
                <span className="sr-only">Twitter</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                </svg>
              </a>
              <a href="https://github.com/ResQTech" className="text-gray-400 hover:text-white">
                <span className="sr-only">GitHub</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"></path>
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

function Home() {
  const [search, setSearch] = useState("");
  const [disasters, setDisasters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mapDisasters, setMapDisasters] = useState([]);
  const [filteredDisasters, setFilteredDisasters] = useState([]);

  // Function to extract coordinates from description or use predefined locations

  // Update the filterDisasters function
  const filterDisasters = useCallback((searchTerm) => {
    console.log('Filtering disasters with term:', searchTerm);
    
    if (!searchTerm.trim()) {
      console.log('Empty search, showing all disasters');
      setFilteredDisasters(disasters);
      return;
    }
  
    const searchLower = searchTerm.toLowerCase();
    
    // First, check if the search term matches any location
    const matchingLocations = Object.keys(locations).filter(location => 
      location.toLowerCase().includes(searchLower)
    );
    
    console.log('Matching locations:', matchingLocations);
  
    const filtered = disasters.filter(disaster => {
      // Check if disaster is in any of the matching locations
      const locationMatch = matchingLocations.some(location => {
        const [lat, lon] = locations[location];
        return disaster.coordinates[0] === lat && disaster.coordinates[1] === lon;
      });
  
      // Check all other fields
      const titleMatch = disaster.title?.toLowerCase().includes(searchLower);
      const typeMatch = disaster.type?.toLowerCase().includes(searchLower);
      const severityMatch = disaster.severity?.toLowerCase().includes(searchLower);
      const detailsMatch = disaster.details?.toLowerCase().includes(searchLower);
      const sourceMatch = disaster.source?.toLowerCase().includes(searchLower);
  
      return locationMatch || titleMatch || typeMatch || severityMatch || detailsMatch || sourceMatch;
    });
  
    console.log(`Found ${filtered.length} matching disasters`);
    setFilteredDisasters(filtered);
  }, [disasters]);

  // Add this new component above LocationSuggestions
  function useOutsideClick(ref, callback) {
    useEffect(() => {
      function handleClickOutside(event) {
        if (ref.current && !ref.current.contains(event.target)) {
          callback();
        }
      }
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [ref, callback]);
  }

  // Update the LocationSuggestions component to clear suggestions after selection
  function LocationSuggestions({ searchTerm, onSelect }) {
    const [isVisible, setIsVisible] = useState(true);
    const suggestionsRef = useRef(null);
    
    useOutsideClick(suggestionsRef, () => setIsVisible(false));

    // Reset visibility when search term changes
    useEffect(() => {
      setIsVisible(true);
    }, [searchTerm]);

    if (!searchTerm.trim() || !isVisible) return null;

    const matchingLocations = Object.keys(locations)
      .filter(location => 
        location.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .slice(0, 5);

    if (matchingLocations.length === 0) return null;

    return (
      <div 
        ref={suggestionsRef}
        className="absolute z-50 w-full bg-gray-700 rounded-md shadow-lg mt-1 border border-gray-600 max-h-48 overflow-y-auto"
      >
        <ul className="py-1">
          {matchingLocations.map(location => (
            <li
              key={location}
              className="px-4 py-2 hover:bg-gray-600 cursor-pointer text-gray-200 flex items-center"
              onClick={() => {
                onSelect(location);
                setIsVisible(false);
              }}
            >
              <svg 
                className="w-4 h-4 mr-2 text-gray-400" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" 
                />
              </svg>
              {location.charAt(0).toUpperCase() + location.slice(1)}
            </li>
          ))}
        </ul>
      </div>
    );
  }

  useEffect(() => {
    const fetchAllDisasterData = async () => {
      try {
        setLoading(true);
        console.log('Starting data fetch...');
        
        const [weatherData, earthquakeData, landslideData, tsunamiData, airQualityData] = 
          await Promise.all([
            fetchOpenWeatherData(locations).catch(err => {
              console.error('Weather data error:', err);
              return [];
            }),
            fetchEarthquakeData().catch(err => {
              console.error('Earthquake data error:', err);
              return [];
            }),
            fetchLandslideData().catch(err => {
              console.error('Landslide data error:', err);
              return [];
            }),
            fetchTsunamiData().catch(err => {
              console.error('Tsunami data error:', err);
              return [];
            }),
            fetchAirQualityData(locations).catch(err => {
              console.error('Air quality data error:', err);
              return [];
            }),
          ]);

        console.log('Data received:', {
          weather: weatherData.length,
          earthquakes: earthquakeData.length,
          landslides: landslideData.length,
          tsunamis: tsunamiData.length,
          airQuality: airQualityData.length
        });

        

        const allDisasters = [
          ...weatherData, 
          ...earthquakeData, 
          ...landslideData, 
          ...tsunamiData, 
          ...airQualityData,
        ].filter(Boolean);

        console.log('Total disasters found:', allDisasters.length);
        
        if (allDisasters.length === 0) {
          console.log('No disasters found in any API');
        }

        setMapDisasters(allDisasters);
        setDisasters(allDisasters);
        setFilteredDisasters(allDisasters);

      } catch (error) {
        console.error("Error fetching disaster data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllDisasterData();
    const interval = setInterval(fetchAllDisasterData, 300000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    filterDisasters(search);
  }, [search, filterDisasters]);

  useEffect(() => {
    setFilteredDisasters(disasters);
  }, [disasters]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-900 text-white">
      <Header />
      <main className="flex-grow">
        <div className="p-5 grid grid-cols-3 gap-6">
          <div className="col-span-2 bg-gray-800 p-6 rounded-xl shadow-xl">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
              Disaster Map of India
            </h2>
            <div className="h-[600px] w-full relative rounded-xl overflow-hidden shadow-inner">
              <MapContainer
                center={defaultCenter}
                zoom={5}
                // Remove maxBounds to allow scrolling
                minZoom={4}    // Reduced to allow more zooming out
                maxZoom={13}
                scrollWheelZoom={true}
                className="h-full w-full"
                boundsOptions={{
                  padding: [50, 50],
                  animate: true
                }}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  className="map-tiles"
                  // Remove bounds restriction
                  noWrap={false}  // Allow map wrapping
                  opacity={1} // Ensure full opacity
                />
                {/* Keep the Rectangle for visual reference but remove bounds restrictions */}
                <Rectangle 
                  bounds={[
                    [37.0, 68.0],  // Original India bounds for visual reference
                    [6.0, 97.0]
                  ]}
                  pathOptions={{
                    color: '#2563eb', // Blue border
                    weight: 1.5,      // Thinner border
                    fillColor: 'transparent', // Remove white fill
                    fillOpacity: 0.1  // Very subtle opacity
                  }}
                  eventHandlers={{
                    click: (event) => {
                      // Use the original event from the synthetic React event
                      if (event && event.originalEvent) {
                        event.originalEvent.stopPropagation();
                      }
                    }
                  }}
                />
                {Object.entries(
                  mapDisasters.reduce((grouped, disaster) => {
                    const key = disaster.coordinates.join(',');
                    if (!grouped[key]) {
                      grouped[key] = [];
                    }
                    grouped[key].push(disaster);
                    return grouped;
                  }, {})
                ).map(([coordKey, disasterGroup]) => {
                  const [lat, lon] = coordKey.split(',').map(Number);
                  const maxSeverity = disasterGroup.reduce((max, d) => 
                    ['high', 'moderate', 'low'].indexOf(d.severity) < ['high', 'moderate', 'low'].indexOf(max) 
                      ? d.severity 
                      : max
                  , 'low');

                  const mainDisaster = disasterGroup[0];

                  return (
                    // Update the Polygon component
                    <Polygon
                      key={coordKey}
                      positions={createCircleCoords([lat, lon], 15)} // Reduced radius from 20 to 15
                      pathOptions={{
                        ...severityColors[maxSeverity],
                        fillOpacity: 0.2,
                        smoothFactor: 2, // Increased from 1.5 to 2 for better performance
                        weight: 1.5,
                        // Add these options to reduce complexity
                        noClip: true,
                        interactive: true,
                        bubblingMouseEvents: false
                      }}
                      eventHandlers={{
                        mouseover: (e) => {
                          const layer = e.target;
                          layer.setStyle({
                            fillOpacity: 0.4
                          });
                          
                          const getSeverityReason = (disaster) => {
                            if (!disaster.details) return '';
                            const warningsSection = disaster.details.split('Active Warnings:\n')[1];
                            return warningsSection ? warningsSection.split('\n')[0] : disaster.details.split('\n')[0];
                          };

                          // Calculate position based on coordinates
                          const bounds = layer.getBounds();
                          const center = bounds.getCenter();
                          const mapHeight = e.target._map.getSize().y;
                          const pointY = e.target._map.latLngToContainerPoint(center).y;
                          
                          // Choose direction based on position
                          const tooltipDirection = pointY < mapHeight/2 ? 'bottom' : 'top';

                          const tooltipContent = `
                            <div class="bg-white p-3 rounded-lg shadow-md text-sm">
                              <p class="font-bold text-gray-900">${mainDisaster.title}</p>
                              <p class="text-${maxSeverity === 'high' ? 'red' : maxSeverity === 'moderate' ? 'yellow' : 'green'}-600">
                                ${maxSeverity.charAt(0).toUpperCase() + maxSeverity.slice(1)} Severity
                              </p>
                              <p class="text-gray-700 mt-1">
                                ${getSeverityReason(mainDisaster)}
                              </p>
                              <p class="text-gray-600 mt-1">${disasterGroup.length} active warning${disasterGroup.length > 1 ? 's' : ''}</p>
                            </div>
                          `;
                          
                          layer.bindTooltip(tooltipContent, {
                            permanent: false,
                            direction: tooltipDirection,
                            className: 'custom-tooltip',
                            offset: [0, tooltipDirection === 'bottom' ? 20 : -20]
                          }).openTooltip();
                        },
                        mouseout: (e) => {
                          const layer = e.target;
                          layer.setStyle({
                            fillOpacity: 0.2
                          });
                          layer.unbindTooltip();
                        }
                      }}
                    >
                      <Popup 
                        className="custom-popup"
                        autoPan={true}
                        autoPanPadding={[150, 150]}  // Increased padding
                        keepInView={true}
                        maxWidth={300}
                        // Smarter positioning logic
                        position={(() => {
                          const isNorth = lat > 25;
                          const isEast = lon > 85;
                          return [
                            isNorth ? lat - 2 : lat + 1,  // Move popup further up/down
                            isEast ? lon - 2 : lon + 1     // Move popup left/right if needed
                          ];
                        })()}
                      >
                        <div 
                          className="bg-white rounded-lg shadow-md" 
                          style={{ 
                            width: '300px',
                            maxHeight: '60vh'  // Reduced max height
                          }}
                        >
                          <div className="p-4 overflow-y-auto" style={{ maxHeight: '55vh' }}>
                            <h3 className="font-bold text-lg text-gray-900 mb-2">
                              Alerts for {mainDisaster.title.split(':')[1]?.trim() || 'this Location'}
                            </h3>
                            {disasterGroup.map((disaster, index) => (
                              <div key={disaster.id || index} className="mb-4 pb-4 border-b border-gray-200 last:border-0">
                                <h4 className="font-bold text-gray-900">{disaster.title}</h4>
                                <p className="text-red-600 font-semibold">{disaster.type}</p>
                                <p className="text-gray-700">Severity: {disaster.severity}</p>
                                <div className="mt-2 text-sm text-gray-600 whitespace-pre-line">
                                  {disaster.details}
                                </div>
                                <p className="text-gray-600 text-sm mt-2">
                                  {new Date(disaster.date).toLocaleDateString('en-IN', {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </p>
                                <a 
                                  href={disaster.url} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-blue-500 hover:underline text-sm mt-2 inline-block"
                                >
                                  More Info
                                </a>
                              </div>
                            ))}
                          </div>
                        </div>
                      </Popup>
                    </Polygon>
                  );
                })}
                <Legend />
              </MapContainer>
            </div>
          </div>

          <div className="col-span-1 bg-gray-800 p-5 rounded-lg flex flex-col h-[calc(600px+2.5rem)]">
            <h2 className="text-lg font-semibold mb-3">Search Your Area</h2>
            <div className="relative mb-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by city name, disaster type, or severity..."
                  className="w-full p-2 pl-10 pr-10 rounded-md bg-gray-700 text-white placeholder-gray-400 border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  value={search}
                  onChange={(e) => {
                    const value = e.target.value;
                    setSearch(value);
                    filterDisasters(value);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      const matchingLocations = Object.keys(locations).filter(location =>
                        location.toLowerCase().includes(search.toLowerCase())
                      );
                      if (matchingLocations.length > 0) {
                        setSearch(matchingLocations[0]);
                        filterDisasters(matchingLocations[0]);
                      }
                    }
                  }}
                />
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                  <svg 
                    className="w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                {search && (
                  <button
                    onClick={() => {
                      setSearch('');
                      filterDisasters('');
                    }}
                    className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-200"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
              <LocationSuggestions 
                searchTerm={search} 
                onSelect={(location) => {
                  setSearch(location);
                  filterDisasters(location);
                }} 
              />
            </div>

            <div className="flex-1 overflow-hidden flex flex-col">
              <h2 className="text-lg font-semibold mb-3">Latest Indian Disaster Reports</h2>
              <div className="overflow-y-auto flex-1 pr-2 custom-scrollbar">
                <ul className="space-y-2">
                  {loading ? (
                    <li className="bg-gray-700 p-3 rounded-md">Loading latest disaster reports...</li>
                  ) : filteredDisasters.length > 0 ? (
                    filteredDisasters.map((disaster, index) => (
                      <li 
                        key={`${disaster.id}-${index}`} // Combine id with index for guaranteed uniqueness
                        className="bg-gray-700 p-3 rounded-md hover:bg-gray-600 transition-colors"
                      >
                        <div>
                          <h4 className="font-bold text-white">{disaster.title}</h4>
                          <p className="text-red-400">{disaster.type}</p>
                          <p className="text-gray-300">Severity: {disaster.severity}</p>
                          <div className="mt-2 text-sm text-gray-400 whitespace-pre-line">
                            {disaster.details}
                          </div>
                          <p className="text-gray-500 text-sm mt-2">
                            {new Date(disaster.date).toLocaleDateString('en-IN', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                          <a 
                            href={disaster.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:underline text-sm mt-2 inline-block"
                          >
                            More Info
                          </a>
                        </div>
                      </li>
                    ))
                  ) : (
                    <li className="bg-gray-700 p-3 rounded-md">
                      {search.trim() ? 'No disasters found for this location' : 'No recent disaster reports found'}
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default Home;

