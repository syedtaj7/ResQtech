import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { MapContainer, TileLayer, Popup, Rectangle, Polygon, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import React from 'react';
import { Link, NavLink } from 'react-router-dom';


// Update the severityColors constant for map markers
const severityColors = {
  high: {
    color: '#dc2626', // red-600
    fillColor: '#dc2626',
    fillOpacity: 0.4,
    weight: 2
  },
  moderate: {
    color: '#d97706', // amber-600
    fillColor: '#d97706',
    fillOpacity: 0.4,
    weight: 2
  },
  low: {
    color: '#059669', // emerald-600
    fillColor: '#059669',
    fillOpacity: 0.4,
    weight: 2
  }
};

// Update the disasterTypeColors constant
const disasterTypeColors = {
  'Weather Warning': {
    bg: 'bg-sky-100',
    border: 'border-sky-400',
    text: 'text-sky-900',
    title: 'text-sky-950',
    details: 'text-sky-800'
  },
  'Earthquake': {
    bg: 'bg-rose-100',
    border: 'border-rose-400',
    text: 'text-rose-900',
    title: 'text-rose-950',
    details: 'text-rose-800'
  },
  'Landslide Warning': {
    bg: 'bg-orange-100',
    border: 'border-orange-400',
    text: 'text-orange-900',
    title: 'text-orange-950',
    details: 'text-orange-800'
  },
  'Air Quality Warning': {
    bg: 'bg-violet-100',
    border: 'border-violet-400',
    text: 'text-violet-900',
    title: 'text-violet-950',
    details: 'text-violet-800'
  },
  'Flash Flood': {
    bg: 'bg-indigo-100',
    border: 'border-indigo-400',
    text: 'text-indigo-900',
    title: 'text-indigo-950',
    details: 'text-indigo-800'
  },
  'Cyclone': {
    bg: 'bg-emerald-100',
    border: 'border-emerald-400',
    text: 'text-emerald-900',
    title: 'text-emerald-950',
    details: 'text-emerald-800'
  },
  'Wildfire': {
    bg: 'bg-red-100',
    border: 'border-red-400',
    text: 'text-red-900',
    title: 'text-red-950',
    details: 'text-red-800'
  },
  'default': {
    bg: 'bg-slate-100',
    border: 'border-slate-400',
    text: 'text-slate-900',
    title: 'text-slate-950',
    details: 'text-slate-800'
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
  'amritsar': [31.6340, 74.8723],

  // Additional Major Cities
  'goa': [15.2993, 74.1240],
  'nashik': [20.0059, 73.7897],
  'aurangabad': [19.8762, 75.3433],
  'rajkot': [22.3039, 70.8022],
  'dhanbad': [23.7957, 86.4304],
  'nellore': [14.4426, 79.9865],
  'tirupati': [13.6288, 79.4192],
  'mysore': [12.2958, 76.6394],
  'hubli': [15.3647, 75.1240],
  'jalandhar': [31.3260, 75.5762],

  // Hill Stations & Tourist Places
  'kullu': [31.9592, 77.1089],
  'manali': [32.2432, 77.1892],
  'mcleodganj': [32.2427, 76.3234],
  'mahabaleshwar': [17.9307, 73.6477],
  'lonavala': [18.7546, 73.4062],
  'matheran': [18.9866, 73.2707],
  'panchgani': [17.9240, 73.8140],
  'cherrapunji': [25.2800, 91.7200],
  'mussorie': [30.4598, 78.0644],
  'ooty': [11.4102, 76.6950],

  // Coastal Cities (Additional Monitoring)
  'alibag': [18.6411, 72.8724],
  'daman': [20.3974, 72.8328],
  'karwar': [14.8137, 74.1279],
  'kundapur': [13.6223, 74.6923],
  'puri': [19.8135, 85.8312],
  'rameswaram': [9.2876, 79.3129],
  'varkala': [8.7378, 76.7164],
  'kovalam': [8.4004, 76.9787],
  'digha': [21.6267, 87.5090],
  'chilika': [19.7147, 85.3317],

  // Industrial Hubs (Environmental Focus)
  'ankleshwar': [21.6266, 73.0020],
  'vapi': [20.3893, 72.9067],
  'haldia': [22.0667, 88.0694],
  'korba': [22.3595, 82.7501],
  'singrauli': [24.1997, 82.6747],
  'bellary': [15.1394, 76.9214],
  'bhilai': [21.2090, 81.4280],
  'bokaro': [23.6693, 86.1511],
  'jharsuguda': [21.8596, 84.0066],
  'angul': [20.8400, 85.1016]
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
      const localPredictions = [];
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
            clouds: current.clouds?.all || 0,
            location: location, // Add location name
            feelsLike: current.main.feels_like,
            windGust: (current.wind?.gust || 0) * 3.6,
            dewPoint: current.main.temp - ((100 - current.main.humidity) / 5)
          };

          const { warnings, severity } = analyzeWeatherData(conditions);

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
          // Get local predictions
          const predictions = predictLocalDisasters(conditions);
          localPredictions.push(...predictions);

          if (warnings.length > 0 || forecastWarnings.length > 0 || predictions.length > 0) {
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

// Update the analyzeWeatherData function
const analyzeWeatherData = (conditions) => {
  const warnings = [];
  let severity = 'low';

  // Temperature Warnings
  if (conditions.temp >= 45) {
    severity = 'high';
    warnings.push('Extreme Heat Warning - Heat Wave Conditions');
  } else if (conditions.temp >= 40) {
    severity = 'moderate';
    warnings.push('Heat Advisory - High Temperature Alert');
  }

  // Cold Temperature Warnings
  if (conditions.temp <= 5) {
    severity = 'high';
    warnings.push('Extreme Cold Warning - Cold Wave Conditions');
  } else if ( conditions.temp <= 10) {
    severity = 'moderate';
    warnings.push('Cold Weather Advisory');
  }

  // Existing weather checks
  if (conditions.visibility < 1000 && conditions.windSpeed > 30) {
    severity = 'high';
    warnings.push('Dust Storm Warning - Low Visibility');
  }

  // Heat Index Check
  const heatIndex = calculateHeatIndex(conditions.temp, conditions.humidity);
  if (heatIndex > 54) {
    severity = 'high';
    warnings.push('Extreme Heat Danger - Heat Stroke Risk');
  } else if (heatIndex > 41) {
    severity = 'high';
    warnings.push('Heat Advisory - Heat Exhaustion Risk');
  }

  // Wind Chill Check
  const windChill = calculateWindChill(conditions.temp, conditions.windSpeed);
  if (windChill < -27) {
    severity = 'high';
    warnings.push('Extreme Wind Chill - Frostbite Risk');
  }

  // Make sure warnings are being added to weather data
  if (warnings.length > 0) {
    console.log('Temperature warnings:', warnings);
  }

  return { warnings, severity };
};

// Add these helper functions
const calculateHeatIndex = (temp, humidity) => {
  // Simplified heat index calculation
  if (temp < 27) return temp;
  
  return -8.784695 + 1.61139411 * temp + 2.338549 * humidity 
         - 0.14611605 * temp * humidity - 0.012308094 * temp * temp 
         - 0.016424828 * humidity * humidity + 0.002211732 * temp * temp * humidity 
         + 0.00072546 * temp * humidity * humidity 
         - 0.000003582 * temp * temp * humidity * humidity;
};

const calculateWindChill = (temp, windSpeed) => {
  // Wind chill calculation
  if (temp > 10 || windSpeed < 4.8) return temp;
  
  return 13.12 + 0.6215 * temp - 11.37 * Math.pow(windSpeed, 0.16) 
         + 0.3965 * temp * Math.pow(windSpeed, 0.16);
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

    // Use a proxy or alternative API endpoint
    const response = await fetch(
      `https://api.allorigins.win/raw?url=${encodeURIComponent(
        `https://www.ncdc.noaa.gov/cdo-web/api/v2/data?` +
        `datasetid=GHCND&` +
        `locationid=FIPS:IN&` +
        `startdate=${startDate}&` +
        `enddate=${endDate}&` +
        `limit=1000`
      )}`, {
        headers: {
          'token': API_KEYS.NOAA
        }
      }
    );
    
    if (!response.ok) {
      console.warn('NCDC API Response:', await response.text());
      return []; // Return empty array instead of throwing
    }
    
    const data = await response.json();
    console.log('NCDC Weather data:', data);

    return (data?.results || [])
      .filter(record => record.value !== null)
      .map((record, index) => ({
        id: `weather-${record.station}-${record.date}-${index}`,
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
    return []; // Return empty array on error
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

// Add this function for local disaster prediction
const predictLocalDisasters = (weatherData) => {
  const predictions = [];
  
  // Enhanced weather thresholds
  if (weatherData.rain > 30 && weatherData.windSpeed > 25) {
    predictions.push({
      type: 'Cyclone',
      severity: weatherData.rain > 50 ? 'high' : 'moderate',
      probability: 0.8,
      details: 'Heavy rain and strong winds indicate cyclonic conditions'
    });
  }

  // Heat Wave
  if (weatherData.temp > 40) {
    predictions.push({
      type: 'Heat Wave',
      severity: weatherData.temp > 45 ? 'high' : 'moderate',
      probability: 0.9,
      details: `Extreme temperature of ${weatherData.temp}°C poses health risks`
    });
  }

  // Cold Wave
  if (weatherData.temp < 5) {
    predictions.push({
      type: 'Cold Wave',
      severity: weatherData.temp < 0 ? 'high' : 'moderate',
      probability: 0.9,
      details: `Severe cold temperature of ${weatherData.temp}°C`
    });
  }

  // Flash Floods
  if (weatherData.rain > 40) {
    predictions.push({
      type: 'Flash Flood',
      severity: weatherData.rain > 60 ? 'high' : 'moderate',
      probability: 0.85,
      details: `Heavy rainfall of ${weatherData.rain}mm/h indicates flood risk`
    });
  }

  // Drought Conditions
  if (weatherData.humidity < 30 && weatherData.temp > 35) {
    predictions.push({
      type: 'Drought',
      severity: 'moderate',
      probability: 0.7,
      details: 'Low humidity and high temperature indicate drought conditions'
    });
  }

  // Landslide Risk (for hilly areas)
  if (weatherData.rain > 25 && hillStations.includes(weatherData.location)) {
    predictions.push({
      type: 'Landslide',
      severity: weatherData.rain > 40 ? 'high' : 'moderate',
      probability: 0.75,
      details: 'Continuous rainfall in hilly terrain increases landslide risk'
    });
  }

  // Thunderstorm
  if (weatherData.clouds > 75 && weatherData.windSpeed > 20) {
    predictions.push({
      type: 'Thunderstorm',
      severity: weatherData.windSpeed > 30 ? 'high' : 'moderate',
      probability: 0.8,
      details: 'Cloud coverage and wind conditions indicate thunderstorm possibility'
    });
  }

  // Fog Warning
  if (weatherData.visibility < 1000 && weatherData.humidity > 90) {
    predictions.push({
      type: 'Dense Fog',
      severity: weatherData.visibility < 500 ? 'high' : 'moderate',
      probability: 0.9,
      details: 'Low visibility and high humidity indicate dense fog conditions'
    });
  }

  return predictions;
};

// Add this array for hill stations
const hillStations = [
  'shimla',
  'manali',
  'darjeeling',
  'mussoorie',
  'nainital',
  'gangtok',
  'ooty',
  'kodaikanal',
  'munnar',
  'dehradun',
  'shillong',
  'srinagar',
  'kalimpong',
  'dharamshala',
  'almora'
];

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
              <a 
                href="https://twitter.com/ResQTech" 
                className="text-gray-400 hover:text-white"
                target="_blank" 
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
              >
                <span className="sr-only">Twitter</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                </svg>
              </a>
              <a 
                href="https://github.com/ResQTech" 
                className="text-gray-400 hover:text-white"
                onClick={(e) => e.stopPropagation()}
              >
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

// Add this new component for handling map zooming
const MapController = ({ location }) => {
  const map = useMap();
  const defaultZoom = 5;
  const defaultCenter = useMemo(() => [20.5937, 78.9629], []); // Center of India

  useEffect(() => {
    // Handle location changes (zooming in)
    if (location && map) {
      const { coordinates, zoom } = location;
      if (Array.isArray(coordinates) && coordinates.length === 2) {
        map.flyTo(coordinates, zoom || 8, {
          duration: 1.5,
          easeLinearity: 0.25
        });
      }
    }

    // Add click handler for zooming out
    const handleMapClick = (e) => {
      // Check if click is directly on the map (not on markers/polygons)
      const target = e.originalEvent.target;
      const isMapClick = target.classList.contains('leaflet-container') || 
                        target.classList.contains('leaflet-tile') ||
                        target.classList.contains('leaflet-tile-container');

      if (isMapClick) {
        map.flyTo(defaultCenter, defaultZoom, {
          duration: 1.5,
          easeLinearity: 0.25
        });
      }
    };

    map.on('click', handleMapClick);

    // Cleanup
    return () => {
      map.off('click', handleMapClick);
    };
  }, [map, location, defaultCenter, defaultZoom]);

  return null;
};

function Home() {
  const [location, setLocation] = useState(null);
  const [search, setSearch] = useState("");
  const [disasters, setDisasters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mapDisasters, setMapDisasters] = useState([]);
  const [filteredDisasters, setFilteredDisasters] = useState([]);

  // Remove the notification comment and related code

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
  const LocationSuggestions = ({ searchTerm, onSelect }) => {
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
  };

  // Update the zoomToLocation function to handle different zoom levels
  const handleZoom = useCallback((coordinates, zoomLevel = 8) => {
    setLocation({
      coordinates: coordinates,
      zoom: zoomLevel
    });
  }, []);

  // Update the handleLocationSelect function
  const handleLocationSelect = useCallback((location) => {
    const locationKey = location.toLowerCase();
    if (locations[locationKey]) {
      handleZoom(locations[locationKey], 8);
      setSearch(location);
      filterDisasters(location);
    }
  }, [handleZoom, filterDisasters]);

  const fetchAllDisasterData = async () => {
    try {
      setLoading(true);
      const errors = [];

      const [weatherData, earthquakeData, landslideData, tsunamiData, airQualityData] = 
        await Promise.all([
          // ...existing fetch calls...
          fetchOpenWeatherData(locations).catch(err => {
            errors.push(['Weather', err]);
            return [];
          }),
          fetchEarthquakeData().catch(err => {
            errors.push(['Earthquake', err]);
            return [];
          }),
          fetchLandslideData().catch(err => {
            errors.push(['Landslide', err]);
            return [];
          }),
          fetchTsunamiData().catch(err => {
            errors.push(['Tsunami', err]);
            return [];
          }),
          fetchAirQualityData(locations).catch(err => {
            errors.push(['Air Quality', err]);
            return [];
          })
        ]);

      const allDisasters = [
        ...weatherData, 
        ...earthquakeData, 
        ...landslideData, 
        ...tsunamiData, 
        ...airQualityData,
      ].filter(Boolean).map(disaster => ({
        ...disaster,
        id: `${disaster.type}-${disaster.title}-${disaster.date}` // Ensure each disaster has a unique ID
      }));

      // Log high severity disasters for debugging
      allDisasters.forEach(disaster => {
        if (disaster.severity === 'high') {
          console.log('High severity disaster detected:', {
            id: disaster.id,
            title: disaster.title,
            type: disaster.type,
            severity: disaster.severity
          });
        }
      });

      setMapDisasters(allDisasters);
      setDisasters(allDisasters);
      setFilteredDisasters(allDisasters);

    } catch (error) {
      console.error("Error fetching disaster data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Single useEffect for data fetching
  useEffect(() => {
    fetchAllDisasterData();
    const interval = setInterval(fetchAllDisasterData, 300000);
    
    return () => {
      clearInterval(interval);
      setLoading(false);
      setDisasters([]);
      setFilteredDisasters([]);
    };
  }, []); // Empty dependency array

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
                minZoom={4}    // Reduced to allow more zooming out
                maxZoom={13}
                scrollWheelZoom={true}
                className="h-full w-full"
                boundsOptions={{
                  padding: [50, 50],
                  animate: true
                }}
                // Add click handler to handle click bubbling
                onClick={(e) => {
                  if (e.originalEvent.target.classList.contains('leaflet-container')) {
                    e.originalEvent.stopPropagation();
                  }
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
                          
                          const getAllWarnings = (disasterGroup) => {
                            return disasterGroup.map(disaster => {
                              const warnings = [];
                              const details = disaster.details || '';
                              
                              // Temperature warnings with specific thresholds
                              if (details.includes('Temperature:')) {
                                const tempMatch = details.match(/Temperature:\s*([-\d.]+)/);
                                if (tempMatch) {
                                  const temp = parseFloat(tempMatch[1]);
                                  if (temp >= 45) {
                                    warnings.push('🌡️ Extreme Heat Wave (>45°C)');
                                  } else if (temp >= 40) {
                                    warnings.push('🌡️ Heat Wave Warning (40-45°C)');
                                  } else if (temp <= 5) {
                                    warnings.push('❄️ Severe Cold Wave (<5°C)');
                                  } else if (temp <= 10) {
                                    warnings.push('❄️ Cold Wave Warning (5-10°C)');
                                  }
                                }
                              }
                              
                              // Rainfall warnings with specific thresholds
                              if (details.includes('Rainfall:')) {
                                const rainMatch = details.match(/Rainfall:\s*([\d.]+)/);
                                if (rainMatch) {
                                  const rainfall = parseFloat(rainMatch[1]);
                                  if (rainfall >= 50) {
                                    warnings.push('🌧️ Extreme Rainfall Warning (>50mm/h)');
                                  } else if (rainfall >= 30) {
                                    warnings.push('🌧️ Heavy Rainfall Alert (30-50mm/h)');
                                  }
                                }
                              }
                              
                              // Wind warnings with specific thresholds
                              if (details.includes('Wind Speed:')) {
                                const windMatch = details.match(/Wind Speed:\s*([\d.]+)/);
                                if (windMatch) {
                                  const windSpeed = parseFloat(windMatch[1]);
                                  if (windSpeed >= 80) {
                                    warnings.push('💨 Hurricane Force Winds (>80km/h)');
                                  } else if (windSpeed >= 60) {
                                    warnings.push('💨 Storm Force Winds (60-80km/h)');
                                  } else if (windSpeed >= 40) {
                                    warnings.push('💨 Strong Wind Alert (40-60km/h)');
                                  }
                                }
                              }
                              
                              // Visibility warnings
                              if (details.includes('Visibility:')) {
                                const visMatch = details.match(/Visibility:\s*([\d.]+)/);
                                if (visMatch) {
                                  const visibility = parseFloat(visMatch[1]);
                                  if (visibility < 0.5) {
                                    warnings.push('🌫️ Very Dense Fog (<0.5km)');
                                  } else if (visibility < 1) {
                                    warnings.push('🌫️ Dense Fog Warning (<1km)');
                                  }
                                }
                              }
                              
                              // Humidity related warnings
                              if (details.includes('Humidity:')) {
                                const humidityMatch = details.match(/Humidity:\s*([\d.]+)/);
                                if (humidityMatch) {
                                  const humidity = parseFloat(humidityMatch[1]);
                                  if (humidity >= 95) {
                                    warnings.push('💧 Extreme Humidity Warning (>95%)');
                                  } else if (humidity <= 20) {
                                    warnings.push('🏜️ Very Dry Conditions (<20%)');
                                  }
                                }
                              }
                          
                              // Air Quality warnings
                              if (details.includes('Air Quality Index:')) {
                                const aqiMatch = details.match(/Air Quality Index:\s*([\d.]+)/);
                                if (aqiMatch) {
                                  const aqi = parseFloat(aqiMatch[1]);
                                  if (aqi >= 4) {
                                    warnings.push('😷 Hazardous Air Quality');
                                  } else if (aqi >= 3) {
                                    warnings.push('😷 Poor Air Quality');
                                  }
                                }
                              }
                              
                              // Natural disaster specific warnings
                              if (disaster.type === 'Earthquake') {
                                const magMatch = details.match(/Magnitude:\s*([\d.]+)/);
                                if (magMatch) {
                                  const magnitude = parseFloat(magMatch[1]);
                                  if (magnitude >= 6.0) {
                                    warnings.push('🌋 Major Earthquake (M6.0+)');
                                  } else if (magnitude >= 5.0) {
                                    warnings.push('🌋 Moderate Earthquake (M5.0+)');
                                  }
                                }
                              }
                              
                              if (disaster.type === 'Landslide Warning') {
                                warnings.push('⛰️ Landslide Risk Alert');
                              }
                              
                              if (details.includes('Tsunami Risk: Yes')) {
                                warnings.push('🌊 Tsunami Risk Alert');
                              }
                              
                              return {
                                type: disaster.type,
                                severity: disaster.severity,
                                warnings: warnings
                              };
                            });
                          };

                          const tooltipContent = `
                            <div class="bg-white p-3 rounded-lg shadow-md text-sm">
                              <p class="font-bold text-gray-900">${mainDisaster.title}</p>
                              <p class="text-${maxSeverity === 'high' ? 'red' : maxSeverity === 'moderate' ? 'yellow' : 'green'}-600">
                                ${maxSeverity.charAt(0).toUpperCase() + maxSeverity.slice(1)} Severity
                              </p>
                              <div class="mt-2">
                                <p class="font-medium text-gray-700">Active Warnings:</p>
                                <ul class="mt-1 space-y-1">
                                  ${getAllWarnings(disasterGroup).map(item => 
                                    item.warnings.map(warning => `
                                      <li class="text-gray-600 flex items-center">
                                        <span class="w-2 h-2 rounded-full bg-${item.severity === 'high' ? 'red' : item.severity === 'moderate' ? 'amber' : 'emerald'}-500 mr-2"></span>
                                        ${warning}
                                      </li>
                                    `).join('')
                                  ).join('')}
                                </ul>
                              </div>
                              <p class="text-gray-600 mt-2">${disasterGroup.length} active warning${disasterGroup.length > 1 ? 's' : ''}</p>
                            </div>
                          `;

                          layer.bindTooltip(tooltipContent, {
                            permanent: false,
                            direction: 'top',
                            className: 'custom-tooltip',
                            offset: [0, -10]
                          }).openTooltip();
                        },
                        mouseout: (e) => {
                          const layer = e.target;
                          layer.setStyle({
                            fillOpacity: 0.2
                          });
                          layer.unbindTooltip();
                        },
                        click: (e) => {
                          const layer = e.target;
                          const bounds = layer.getBounds();
                          const center = bounds.getCenter();
                          if (center) {
                            handleZoom([center.lat, center.lng], 10);
                          }
                        }
                      }}
                    >
                      <Popup 
                        className="custom-popup"
                        autoPan={true}
                        autoPanPadding={[150, 150]}
                        keepInView={true}
                        maxWidth={350} // Increased from 300
                      >
                        <div className="rounded-xl shadow-lg bg-gray-800" style={{ maxHeight: '500px' }}>
                          {/* Header section with custom gradient */}
                          <div className="bg-gradient-to-r from-gray-800 to-gray-900 p-4 border-b border-gray-700 rounded-t-xl">
                            <h3 className="font-bold text-xl text-white flex items-center gap-2">
                              <svg className="w-5 h-5 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                  d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                                />
                              </svg>
                              <span className="truncate text-white">
                                {mainDisaster.title.split(':')[1]?.trim() || 'this Location'}
                              </span>
                            </h3>
                          </div>

                          {/* Updated Content section with severity reasons */}
                          <div className="overflow-y-auto" style={{ maxHeight: '400px' }}>
                            <div className="p-4 space-y-4">
                              {disasterGroup.map((disaster, index) => {
                                // Extract severity reasons from details
                                const severityReasons = disaster.details.split('\n')
                                  .filter(line => 
                                    line.includes('Warning') || 
                                    line.includes('Alert') || 
                                    line.includes('Risk') ||
                                    line.includes('Danger')
                                  );

                                return (
                                  <div 
                                    key={disaster.id || index} 
                                    className={`rounded-lg overflow-hidden transition-all hover:shadow-md border ${
                                      disaster.severity === 'high' ? 'border-red-500/30 bg-red-900/20' :
                                      disaster.severity === 'moderate' ? 'border-amber-500/30 bg-amber-900/20' :
                                      'border-emerald-500/30 bg-emerald-900/20'
                                    }`}
                                  >
                                    {/* Alert Header with Severity Reasons */}
                                    <div className={`p-3 border-b ${
                                      disaster.severity === 'high' ? 'border-red-500/30 bg-gradient-to-r from-red-900/40 to-red-800/40' :
                                      disaster.severity === 'moderate' ? 'border-amber-500/30 bg-gradient-to-r from-amber-900/40 to-amber-800/40' :
                                      'border-emerald-500/30 bg-gradient-to-r from-emerald-900/40 to-emerald-800/40'
                                    }`}>
                                      <div className="flex items-center justify-between">
                                        <h4 className="font-semibold text-white">{disaster.type}</h4>
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                                          disaster.severity === 'high' ? 'bg-red-500/20 text-red-100 border border-red-500/30' :
                                          disaster.severity === 'moderate' ? 'bg-amber-500/20 text-amber-100 border border-amber-500/30' :
                                          'bg-emerald-500/20 text-emerald-100 border border-emerald-500/30'
                                        }`}>
                                          {disaster.severity}
                                        </span>
                                      </div>
                                      {/* Add Severity Reasons */}
                                      {severityReasons.length > 0 && (
                                        <div className="mt-2 text-sm text-gray-300">
                                          <p className="font-medium mb-1">Reasons for {disaster.severity} severity:</p>
                                          <ul className="list-disc list-inside space-y-1 text-gray-400">
                                            {severityReasons.map((reason, i) => (
                                              <li key={i}>{reason}</li>
                                            ))}
                                          </ul>
                                        </div>
                                      )}
                                    </div>

                                    {/* Rest of the content remains the same */}
                                    <div className="p-4 bg-gray-800/50">
                                      <p className="text-sm text-gray-200 leading-relaxed">{disaster.details}</p>
                                      
                                      {/* Add this new button section */}
                                      <div className="mt-4 mb-2">
                                        <Link
                                          to={`/mitigation?type=${encodeURIComponent(disaster.type)}`}
                                          className="w-full inline-flex items-center justify-center px-4 py-2.5 
                                            bg-gradient-to-r from-blue-600 to-blue-700 
                                            hover:from-blue-500 hover:to-blue-600
                                            text-white font-medium rounded-lg 
                                            shadow-lg shadow-blue-500/20
                                            transition-all duration-200 
                                            border border-blue-600/20
                                            hover:scale-[1.02]
                                            focus:outline-none focus:ring-2 focus:ring-blue-500/50 
                                            gap-2"
                                        >
                                          <svg 
                                            className="w-5 h-5 text-blue-100" 
                                            fill="none" 
                                            stroke="currentColor" 
                                            viewBox="0 0 24 24"
                                          >
                                            <path 
                                              strokeLinecap="round" 
                                              strokeLinejoin="round" 
                                              strokeWidth={2} 
                                              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                                            />
                                          </svg>
                                          <span className="text-blue-50">View Precautions</span>
                                        </Link>
                                      </div>

                                      {/* Existing footer section */}
                                      <div className="flex items-center justify-between mt-4 pt-2 border-t border-gray-700">
                                        <time className="text-xs text-gray-400">
                                          {new Date(disaster.date).toLocaleDateString('en-IN', {
                                            day: 'numeric',
                                            month: 'short',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                          })}
                                        </time>
                                        <a 
                                          href={disaster.url} 
                                          target="_blank" 
                                          rel="noopener noreferrer"
                                          className="text-blue-400 hover:text-blue-300 text-sm font-medium flex items-center gap-1 group"
                                        >
                                          More Info
                                          <svg 
                                            className="w-4 h-4 transition-transform group-hover:translate-x-0.5" 
                                            fill="none" 
                                            stroke="currentColor" 
                                            viewBox="0 0 24 24"
                                          >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
                                          </svg>
                                        </a>
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      </Popup>
                    </Polygon>
                  );
                })}
                <Legend />
                <MapController location={location} />
              </MapContainer>
            </div>
          </div>

          {/* Update the search bar and results styling */}
          <div className="col-span-1 bg-gray-700 p-5 rounded-xl shadow-lg flex flex-col h-[calc(600px+2.5rem)]">
            <h2 className="text-lg font-semibold mb-3 text-white">Search Your Area</h2>
            <div className="relative mb-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by city name, disaster type..."
                  className="w-full p-3 pl-10 pr-10 rounded-xl bg-gray-600 text-white placeholder-gray-300 
                    border border-gray-500 focus:border-blue-400 focus:ring-2 focus:ring-blue-400 
                    focus:ring-opacity-50 transition-all"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    filterDisasters(e.target.value);
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
                onSelect={handleLocationSelect} 
              />
            </div>

            {/* Update the disaster reports list styling */}
            <div className="flex-1 overflow-hidden flex flex-col">
              <h2 className="text-lg font-semibold mb-3 text-white">Latest Indian Disaster Reports</h2>
              <div className="overflow-y-auto flex-1 pr-2 custom-scrollbar space-y-3">
                {loading ? (
                  <div className="bg-gray-600 p-4 rounded-xl animate-pulse">
                    <div className="h-4 bg-gray-500 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-500 rounded w-1/2"></div>
                  </div>
                ) : filteredDisasters.length > 0 ? (
                  filteredDisasters.map((disaster, index) => {
                    const typeColors = disasterTypeColors[disaster.type] || disasterTypeColors.default;
                    return (
                      <div 
                        key={`${disaster.id}-${index}`}
                        className={`p-4 rounded-xl transition-all hover:shadow-lg ${typeColors.bg}`}
                      >
                        <div>
                          <h4 className={`font-bold ${typeColors.title}`}>{disaster.title}</h4>
                          <p className={`font-semibold ${typeColors.text}`}>{disaster.type}</p>
                          <p className={`text-sm ${typeColors.details}`}>Severity: {disaster.severity}</p>
                          <div className={`mt-2 text-sm ${typeColors.details} whitespace-pre-line`}>
                            {disaster.details}
                          </div>
                          <p className={`text-sm mt-2 ${typeColors.details}`}>
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
                      </div>
                    );
                  })
                ) : (
                  <div className="bg-gray-600 p-4 rounded-xl text-gray-300 text-center">
                    {search.trim() ? 'No disasters found for this location' : 'No recent disaster reports found'}
                  </div>
                )}
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

