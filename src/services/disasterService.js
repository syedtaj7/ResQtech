const API_KEYS = {
  NASA: 'Y1Cdfo9DlGrU5jC9ZhcwWMSdDlZB3xzac22qJUmn',
  NOAA: 'RKetBfTOLiCosTZesHkUNIwsygfpTCxs',
  OPENWEATHER: '80df7ef9d51c1d3f6322bb375bbb62b9'
};

const INDIA_BBOX = {
  north: 40.0,
  south: 5.0,
  west: 65.0,
  east: 100.0
};

// Function to get active disasters from multiple sources
export const getActiveDisasters = async () => {
  try {
    const [earthquakes, weather, landslides] = await Promise.all([
      fetchEarthquakes(),
      fetchWeatherDisasters(),
      fetchLandslides()
    ]);

    return [...earthquakes, ...weather, ...landslides];
  } catch (error) {
    console.error('Error fetching active disasters:', error);
    return [];
  }
};

// Fetch earthquake data
const fetchEarthquakes = async () => {
  try {
    const today = new Date();
    const thirtyDaysAgo = new Date(today.getTime() - (30 * 24 * 60 * 60 * 1000));
    const startTime = thirtyDaysAgo.toISOString().split('T')[0];
    const endTime = today.toISOString().split('T')[0];

    const response = await fetch(
      `https://earthquake.usgs.gov/fdsnws/event/1/query?` +
      `format=geojson&starttime=${startTime}&endtime=${endTime}` +
      `&minmagnitude=4.0` +
      `&maxlatitude=${INDIA_BBOX.north}&minlatitude=${INDIA_BBOX.south}` +
      `&maxlongitude=${INDIA_BBOX.east}&minlongitude=${INDIA_BBOX.west}`
    );

    if (!response.ok) return [];
    
    const data = await response.json();
    return data.features.map(eq => ({
      type: 'earthquake',
      coordinates: [eq.geometry.coordinates[1], eq.geometry.coordinates[0]],
      magnitude: eq.properties.mag,
      date: new Date(eq.properties.time)
    }));
  } catch (error) {
    console.error('Error fetching earthquake data:', error);
    return [];
  }
};

// Fetch weather-related disasters
const fetchWeatherDisasters = async () => {
  try {
    // Using OpenWeather API for demonstration
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/box/city?` +
      `bbox=${INDIA_BBOX.west},${INDIA_BBOX.south},${INDIA_BBOX.east},${INDIA_BBOX.north},8` +
      `&appid=${API_KEYS.OPENWEATHER}`
    );

    if (!response.ok) return [];

    const data = await response.json();
    return data.list
      .filter(city => {
        const weather = city.weather[0];
        return weather.main.toLowerCase().includes('extreme') ||
               weather.main.toLowerCase().includes('severe');
      })
      .map(city => ({
        type: 'weather',
        coordinates: [city.coord.lat, city.coord.lon],
        condition: city.weather[0].main,
        date: new Date()
      }));
  } catch (error) {
    console.error('Error fetching weather data:', error);
    return [];
  }
};

// Fetch landslide data
const fetchLandslides = async () => {
  try {
    const response = await fetch(
      `https://eonet.gsfc.nasa.gov/api/v3/events?category=landslides` +
      `&status=open&bbox=${INDIA_BBOX.west},${INDIA_BBOX.south},${INDIA_BBOX.east},${INDIA_BBOX.north}`
    );

    if (!response.ok) return [];

    const data = await response.json();
    return data.events.map(event => ({
      type: 'landslide',
      coordinates: event.geometry[0].coordinates.reverse(),
      title: event.title,
      date: new Date(event.geometry[0].date)
    }));
  } catch (error) {
    console.error('Error fetching landslide data:', error);
    return [];
  }
};

export const calculateDisasterRisk = (location, activeDisasters) => {
  let riskScore = 0;
  const [lat, lon] = location.coordinates;

  for (const disaster of activeDisasters) {
    const distance = calculateDistance(lat, lon, disaster.coordinates[0], disaster.coordinates[1]);
    
    // Add to risk score based on disaster type and distance
    if (disaster.type === 'earthquake' && distance < 100) {
      riskScore += (100 - distance) * (disaster.magnitude / 10);
    } else if (disaster.type === 'weather' && distance < 50) {
      riskScore += (50 - distance) * 0.5;
    } else if (disaster.type === 'landslide' && distance < 30) {
      riskScore += (30 - distance) * 0.8;
    }
  }

  return riskScore;
};

// Helper function to calculate distance between coordinates
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};