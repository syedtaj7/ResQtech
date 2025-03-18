// Add imports for disaster data handling
import { getActiveDisasters } from '../services/disasterService';

export const safeLocations = {
  // North India
  'shimla': {
    coordinates: [31.1048, 77.1734],
    score: 95,
    capacity: 'High',
    facilities: ['Medical Centers', 'Emergency Shelters', 'Food Supply', 'Helipad'],
    description: 'High altitude location safe from floods, good infrastructure',
    state: 'Himachal Pradesh',
    elevation: '2276m'
  },
  'manali': {
    coordinates: [32.2432, 77.1892],
    score: 93,
    capacity: 'Medium',
    facilities: ['Hospitals', 'Relief Camps', 'Communication Centers'],
    description: 'Protected valley location with multiple evacuation routes',
    state: 'Himachal Pradesh',
    elevation: '2050m'
  },
  'dehradun': {
    coordinates: [30.3165, 78.0322],
    score: 90,
    capacity: 'High',
    facilities: ['Major Hospitals', 'Army Base', 'Relief Centers'],
    description: 'Valley city with good connectivity and infrastructure',
    state: 'Uttarakhand',
    elevation: '640m'
  },

  // South India
  'ooty': {
    coordinates: [11.4102, 76.6950],
    score: 92,
    capacity: 'Medium',
    facilities: ['Hospitals', 'Relief Camps', 'Communication Centers'],
    description: 'Hill station with moderate climate, multiple evacuation routes',
    state: 'Tamil Nadu',
    elevation: '2240m'
  },
  'munnar': {
    coordinates: [10.0889, 77.0595],
    score: 91,
    capacity: 'Medium',
    facilities: ['Medical Facilities', 'Emergency Shelters', 'Food Storage'],
    description: 'High altitude tea plantation region with stable terrain',
    state: 'Kerala',
    elevation: '1532m'
  },

  // Central India
  'pachmarhi': {
    coordinates: [22.4675, 78.4345],
    score: 89,
    capacity: 'Medium',
    facilities: ['Military Station', 'Hospitals', 'Emergency Services'],
    description: 'Hill station with army presence and good facilities',
    state: 'Madhya Pradesh',
    elevation: '1067m'
  },

  // East India
  'gangtok': {
    coordinates: [27.3389, 88.6065],
    score: 88,
    capacity: 'Medium',
    facilities: ['Government Hospitals', 'Army Facilities', 'Relief Centers'],
    description: 'Capital city with good infrastructure and medical facilities',
    state: 'Sikkim',
    elevation: '1650m'
  },
  'darjeeling': {
    coordinates: [27.0410, 88.2663],
    score: 87,
    capacity: 'Medium',
    facilities: ['Hospitals', 'Relief Camps', 'Army Support'],
    description: 'Hill station with established evacuation protocols',
    state: 'West Bengal',
    elevation: '2042m'
  },

  // West India
  'mount abu': {
    coordinates: [24.5926, 72.7156],
    score: 86,
    capacity: 'Medium',
    facilities: ['Medical Centers', 'Emergency Shelters', 'Police HQ'],
    description: 'Only hill station in Rajasthan with good infrastructure',
    state: 'Rajasthan',
    elevation: '1220m'
  },
  'mahabaleshwar': {
    coordinates: [17.9307, 73.6477],
    score: 85,
    capacity: 'High',
    facilities: ['Hospitals', 'Relief Centers', 'Emergency Services'],
    description: 'Elevated plateau with multiple access routes',
    state: 'Maharashtra',
    elevation: '1353m'
  },

  // Northeast India
  'shillong': {
    coordinates: [25.5788, 91.8933],
    score: 88,
    capacity: 'High',
    facilities: ['Military Base', 'Government Hospitals', 'Relief Centers'],
    description: 'Capital city with good infrastructure and army presence',
    state: 'Meghalaya',
    elevation: '1496m'
  },
  'tawang': {
    coordinates: [27.5859, 91.8594],
    score: 87,
    capacity: 'Medium',
    facilities: ['Military Hospital', 'Emergency Bunkers', 'Food Storage'],
    description: 'Strategic location with military presence',
    state: 'Arunachal Pradesh',
    elevation: '2669m'
  },

  // Add more locations based on your existing locations list...
  // Continue adding for all states and major cities
};

// Add categorization by region
export const regionCategories = {
  'North India': ['shimla', 'manali', 'dehradun'],
  'South India': ['ooty', 'munnar'],
  'Central India': ['pachmarhi'],
  'East India': ['gangtok', 'darjeeling'],
  'West India': ['mount abu', 'mahabaleshwar'],
  'Northeast India': ['shillong', 'tawang']
};

// Add safety criteria explanations
export const safetyFactors = {
  elevation: 'Higher elevation provides protection from floods',
  infrastructure: 'Access to emergency services and evacuation routes',
  militaryPresence: 'Immediate response capability and security',
  medicalFacilities: 'Emergency healthcare access',
  connectivity: 'Multiple evacuation routes',
  climate: 'Stable weather conditions',
  terrain: 'Protected from natural disasters'
};

// Primary and fallback safe locations for each state
export const stateSafeLocations = {
  // North India
  'Jammu and Kashmir': {
    primary: 'gulmarg',
    fallback: ['pahalgam', 'sonamarg'],
    coordinates: {
      'gulmarg': [34.0484, 74.3805],
      'pahalgam': [34.0159, 75.3145],
      'sonamarg': [34.3087, 75.2167]
    }
  },
  'Ladakh': {
    primary: 'leh',
    fallback: ['kargil', 'nubra'],
    coordinates: {
      'leh': [34.1526, 77.5771],
      'kargil': [34.5539, 76.1349],
      'nubra': [34.6868, 77.5534]
    }
  },
  'Himachal Pradesh': {
    primary: 'shimla',
    fallback: ['manali', 'dharamshala', 'kullu'],
    coordinates: {
      'shimla': [31.1048, 77.1734],
      'manali': [32.2432, 77.1892],
      'dharamshala': [32.2190, 76.3234],
      'kullu': [31.9592, 77.1089]
    }
  },
  'Punjab': {
    primary: 'chandigarh',
    fallback: ['amritsar', 'ludhiana', 'pathankot'],
    coordinates: {
      'chandigarh': [30.7333, 76.7794],
      'amritsar': [31.6340, 74.8723],
      'ludhiana': [30.9010, 75.8573],
      'pathankot': [32.2643, 75.6525]
    }
  },
  'Uttarakhand': {
    primary: 'dehradun',
    fallback: ['mussoorie', 'nainital', 'haridwar'],
    coordinates: {
      'dehradun': [30.3165, 78.0322],
      'mussoorie': [30.4598, 78.0644],
      'nainital': [29.3919, 79.4542],
      'haridwar': [29.9457, 78.1642]
    }
  },

  // Central India
  'Madhya Pradesh': {
    primary: 'bhopal',
    fallback: ['indore', 'gwalior', 'jabalpur'],
    coordinates: {
      'bhopal': [23.2599, 77.4126],
      'indore': [22.7196, 75.8577],
      'gwalior': [26.2183, 78.1828],
      'jabalpur': [23.1815, 79.9864]
    }
  },
  'Chhattisgarh': {
    primary: 'raipur',
    fallback: ['bilaspur', 'jagdalpur'],
    coordinates: {
      'raipur': [21.2514, 81.6296],
      'bilaspur': [22.0797, 82.1409],
      'jagdalpur': [19.0785, 82.0149]
    }
  },

  // South India
  'Tamil Nadu': {
    primary: 'ooty',
    fallback: ['kodaikanal', 'yelagiri', 'coonoor'],
    coordinates: {
      'ooty': [11.4102, 76.6950],
      'kodaikanal': [10.2381, 77.4892],
      'yelagiri': [12.5816, 78.6471],
      'coonoor': [11.3530, 76.7859]
    }
  },
  'Kerala': {
    primary: 'munnar',
    fallback: ['wayanad', 'thekkady', 'vagamon'],
    coordinates: {
      'munnar': [10.0889, 77.0595],
      'wayanad': [11.6854, 76.1320],
      'thekkady': [9.6000, 77.1667],
      'vagamon': [9.6859, 76.9025]
    }
  },
  'Karnataka': {
    primary: 'coorg',
    fallback: ['chikmagalur', 'agumbe', 'madikeri'],
    coordinates: {
      'coorg': [12.4244, 75.7382],
      'chikmagalur': [13.3161, 75.7720],
      'agumbe': [13.5025, 75.0939],
      'madikeri': [12.4200, 75.7300]
    }
  },

  // East India
  'West Bengal': {
    primary: 'darjeeling',
    fallback: ['kalimpong', 'kurseong'],
    coordinates: {
      'darjeeling': [27.0410, 88.2663],
      'kalimpong': [27.0660, 88.4740],
      'kurseong': [26.8800, 88.2800]
    }
  },
  'Sikkim': {
    primary: 'gangtok',
    fallback: ['pelling', 'lachung', 'ravangla'],
    coordinates: {
      'gangtok': [27.3389, 88.6065],
      'pelling': [27.3000, 88.2400],
      'lachung': [27.6909, 88.7460],
      'ravangla': [27.3070, 88.3630]
    }
  },

  // Northeast India
  'Arunachal Pradesh': {
    primary: 'tawang',
    fallback: ['bomdila', 'itanagar'],
    coordinates: {
      'tawang': [27.5859, 91.8594],
      'bomdila': [27.2650, 92.4200],
      'itanagar': [27.0844, 93.6053]
    }
  },
  'Meghalaya': {
    primary: 'shillong',
    fallback: ['cherrapunji', 'mawlynnong'],
    coordinates: {
      'shillong': [25.5788, 91.8933],
      'cherrapunji': [25.2800, 91.7200],
      'mawlynnong': [25.2031, 91.9318]
    }
  },

  // West India
  'Gujarat': {
    primary: 'mount abu',
    fallback: ['saputara', 'girnar'],
    coordinates: {
      'mount abu': [24.5926, 72.7156],
      'saputara': [20.5744, 73.7570],
      'girnar': [21.4959, 70.5000]
    }
  },
  'Maharashtra': {
    primary: 'mahabaleshwar',
    fallback: ['lonavala', 'matheran', 'panchgani'],
    coordinates: {
      'mahabaleshwar': [17.9307, 73.6477],
      'lonavala': [18.7546, 73.4062],
      'matheran': [18.9866, 73.2707],
      'panchgani': [17.9240, 73.8140]
    }
  },
  
  // Add more states and union territories...
};

// Function to get safe location based on current disasters
export const getSafeLocation = async (state) => {
  const activeDisasters = await getActiveDisasters();
  const stateLocations = stateSafeLocations[state];
  
  if (!stateLocations) return null;

  // Check primary location first
  const primaryLocation = stateLocations.primary;
  const primaryCoords = stateLocations.coordinates[primaryLocation];
  
  if (!isLocationAffected(primaryCoords, activeDisasters)) {
    return {
      name: primaryLocation,
      coordinates: primaryCoords,
      ...safeLocations[primaryLocation]
    };
  }

  // Check fallback locations
  for (const fallbackName of stateLocations.fallback) {
    const fallbackCoords = stateLocations.coordinates[fallbackName];
    if (!isLocationAffected(fallbackCoords, activeDisasters)) {
      return {
        name: fallbackName,
        coordinates: fallbackCoords,
        ...safeLocations[fallbackName]
      };
    }
  }

  // If no safe location found in state, find nearest safe location in neighboring states
  return findNearestSafeLocation(state, activeDisasters);
};

// Helper function to check if location is affected by disasters
const isLocationAffected = (coordinates, disasters) => {
  const [lat, lon] = coordinates;
  const SAFE_DISTANCE = 50; // kilometers

  return disasters.some(disaster => {
    const [disasterLat, disasterLon] = disaster.coordinates;
    const distance = calculateDistance(lat, lon, disasterLat, disasterLon);
    return distance < SAFE_DISTANCE;
  });
};

// Calculate distance between two points using Haversine formula
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

// Find nearest safe location in neighboring states
const findNearestSafeLocation = (state, activeDisasters) => {
  // Implementation to find nearest safe location in neighboring states
  // This would use a graph of state adjacency and check all nearby states
  // for safe locations
};

// Add severity thresholds for different types of disasters
export const disasterThresholds = {
  'flood': {
    minElevation: 100, // meters
    safeDistance: 50 // kilometers
  },
  'earthquake': {
    safeDistance: 100,
    minInfrastructureScore: 8
  },
  'landslide': {
    minStabilityScore: 7,
    safeDistance: 30
  },
  'cyclone': {
    minInfrastructureScore: 9,
    safeDistance: 200
  }
};

// Update safety criteria based on different disaster types
export const disasterSafetyCriteria = {
  'flood': {
    minElevation: 100,
    preferredTerrain: ['hills', 'plateau'],
    infraRequirements: ['drainage', 'flood barriers']
  },
  'earthquake': {
    buildingCodes: 'seismic-resistant',
    emergencyServices: ['medical', 'search-rescue'],
    communicationBackup: true
  },
  'cyclone': {
    shelterType: 'reinforced',
    warningSystem: true,
    evacuationRoutes: ['primary', 'secondary']
  },
  'landslide': {
    soilStability: 'high',
    vegetationCover: 'dense',
    drainageSystem: 'efficient'
  }
};