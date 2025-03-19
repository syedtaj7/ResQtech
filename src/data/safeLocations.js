// Add imports for disaster data handling
import { getActiveDisasters } from '../services/disasterService';
import { Popup } from 'react-leaflet';

export const safeLocations = {
  // North India
  'shimla': {
    coordinates: [31.1048, 77.1734],
    score: 95,
    capacity: 'High',
    facilities: ['Medical Centers', 'Emergency Shelters', 'Food Supply', 'Helipad'],
    description: 'High altitude location safe from floods, good infrastructure',
    state: 'Himachal Pradesh',
    elevation: '2276m',
    hasAirport: true,
    hasRailway: true,
    transportInfo: {
      nearestAirport: 'Shimla Airport (SLV)',
      nearestStation: 'Shimla Railway Station',
      majorHighways: ['NH-5', 'NH-22'],
      busTerminal: 'ISBT Shimla'
    }
  },
  'srinagar': {
    coordinates: [34.0837, 74.7973],
    score: 88,
    capacity: 'High',
    facilities: ['Military Base', 'Hospitals', 'Emergency Response'],
    description: 'Well-equipped capital city with military presence',
    state: 'Jammu & Kashmir',
    elevation: '1585m',
    hasAirport: true,
    hasRailway: false,
    transportInfo: {
      nearestAirport: 'Sheikh ul-Alam International Airport (SXR)',
      nearestStation: 'Udhampur Railway Station (150km)',
      majorHighways: ['NH-1', 'NH-501'],
      busTerminal: 'Srinagar Central Bus Stand'
    }
  },
  'dehradun': {
    coordinates: [30.3165, 78.0322],
    score: 90,
    capacity: 'High',
    facilities: ['Major Hospitals', 'Army Base', 'Relief Centers'],
    description: 'Valley city with good connectivity and infrastructure',
    state: 'Uttarakhand',
    elevation: '640m',
    hasAirport: true,
    hasRailway: true,
    transportInfo: {
      nearestAirport: 'Jolly Grant Airport (DED)',
      nearestStation: 'Dehradun Railway Station',
      majorHighways: ['NH-72', 'NH-7'],
      busTerminal: 'Dehradun ISBT'
    }
  },
  'chandigarh': {
    coordinates: [30.7333, 76.7794],
    score: 92,
    capacity: 'High',
    facilities: ['Modern Hospitals', 'Emergency Services', 'Government Support'],
    description: 'Well-planned city with excellent infrastructure',
    state: 'Punjab',
    elevation: '350m',
    hasAirport: true,
    hasRailway: true,
    transportInfo: {
      nearestAirport: 'Chandigarh International Airport (IXC)',
      nearestStation: 'Chandigarh Junction',
      majorHighways: ['NH-5', 'NH-7', 'NH-152'],
      busTerminal: 'ISBT Sector 17'
    }
  },
  'jaipur': {
    coordinates: [26.9124, 75.7873],
    score: 87,
    capacity: 'High',
    facilities: ['Medical Hubs', 'Relief Centers', 'Command Center'],
    description: 'Capital city with robust emergency response',
    state: 'Rajasthan',
    elevation: '431m',
    hasAirport: true,
    hasRailway: true,
    transportInfo: {
      nearestAirport: 'Jaipur International Airport (JAI)',
      nearestStation: 'Jaipur Junction',
      majorHighways: ['NH-8', 'NH-11', 'NH-12'],
      busTerminal: 'Sindhi Camp Bus Stand'
    }
  },

  // Central India
  'bhopal': {
    coordinates: [23.2599, 77.4126],
    score: 89,
    capacity: 'High',
    facilities: ['Disaster Response Center', 'Hospitals', 'Relief Camps'],
    description: 'Capital with established disaster management',
    state: 'Madhya Pradesh',
    elevation: '527m',
    hasAirport: true,
    hasRailway: true,
    transportInfo: {
      nearestAirport: 'Raja Bhoj Airport (BHO)',
      nearestStation: 'Bhopal Junction',
      majorHighways: ['NH-12', 'NH-46'],
      busTerminal: 'ISBT Bhopal'
    }
  },
  'raipur': {
    coordinates: [21.2514, 81.6296],
    score: 86,
    capacity: 'High',
    facilities: ['Medical Facilities', 'Emergency Services', 'Relief Centers'],
    description: 'Well-connected city with good infrastructure',
    state: 'Chhattisgarh',
    elevation: '298m',
    hasAirport: true,
    hasRailway: true,
    transportInfo: {
      nearestAirport: 'Swami Vivekananda Airport (RPR)',
      nearestStation: 'Raipur Junction',
      majorHighways: ['NH-6', 'NH-43'],
      busTerminal: 'Raipur Central Bus Stand'
    }
  },

  // South India
  'bangalore': {
    coordinates: [12.9716, 77.5946],
    score: 93,
    capacity: 'Very High',
    facilities: ['Tech-enabled Response', 'Medical Centers', 'Relief Coordination'],
    description: 'Tech hub with advanced disaster management',
    state: 'Karnataka',
    elevation: '920m',
    hasAirport: true,
    hasRailway: true,
    transportInfo: {
      nearestAirport: 'Kempegowda International Airport (BLR)',
      nearestStation: 'KSR Bangalore City Junction',
      majorHighways: ['NH-44', 'NH-75'],
      busTerminal: 'Majestic Bus Terminal'
    }
  },
  'chennai': {
    coordinates: [13.0827, 80.2707],
    score: 88,
    capacity: 'High',
    facilities: ['Coastal Defense', 'Medical Hubs', 'Emergency Response'],
    description: 'Coastal city with cyclone preparation',
    state: 'Tamil Nadu',
    elevation: '6m',
    hasAirport: true,
    hasRailway: true,
    transportInfo: {
      nearestAirport: 'Chennai International Airport (MAA)',
      nearestStation: 'Chennai Central',
      majorHighways: ['NH-16', 'NH-32'],
      busTerminal: 'Chennai Mofussil Bus Terminus'
    }
  },
  'thiruvananthapuram': {
    coordinates: [8.5241, 76.9366],
    score: 87,
    capacity: 'High',
    facilities: ['Flood Response', 'Medical Centers', 'Relief Camps'],
    description: 'Capital with flood management system',
    state: 'Kerala',
    elevation: '3m',
    hasAirport: true,
    hasRailway: true,
    transportInfo: {
      nearestAirport: 'Trivandrum International Airport (TRV)',
      nearestStation: 'Thiruvananthapuram Central',
      majorHighways: ['NH-66', 'NH-744'],
      busTerminal: 'KSRTC Central Bus Station'
    }
  },
  'hyderabad': {
    coordinates: [17.3850, 78.4867],
    score: 91,
    capacity: 'High',
    facilities: ['Tech Centers', 'Medical Hubs', 'Emergency Services'],
    description: 'Modern city with advanced infrastructure',
    state: 'Telangana',
    elevation: '542m',
    hasAirport: true,
    hasRailway: true,
    transportInfo: {
      nearestAirport: 'Rajiv Gandhi International Airport (HYD)',
      nearestStation: 'Secunderabad Junction',
      majorHighways: ['NH-44', 'NH-65'],
      busTerminal: 'MGBS'
    }
  },
  'amaravati': {
    coordinates: [16.5113, 80.5149],
    score: 85,
    capacity: 'Medium',
    facilities: ['Relief Centers', 'Medical Facilities', 'Emergency Response'],
    description: 'Planned capital with modern infrastructure',
    state: 'Andhra Pradesh',
    elevation: '30m',
    hasAirport: false,
    hasRailway: true,
    transportInfo: {
      nearestAirport: 'Vijayawada Airport (VGA) - 50km',
      nearestStation: 'Amaravati Station',
      majorHighways: ['NH-65', 'NH-16'],
      busTerminal: 'Amaravati Bus Stand'
    }
  },

  // East India
  'kolkata': {
    coordinates: [22.5726, 88.3639],
    score: 86,
    capacity: 'Very High',
    facilities: ['Cyclone Shelters', 'Medical Centers', 'Relief Coordination'],
    description: 'Metro city with disaster experience',
    state: 'West Bengal',
    elevation: '9m',
    hasAirport: true,
    hasRailway: true,
    transportInfo: {
      nearestAirport: 'Netaji Subhas Chandra Bose International Airport (CCU)',
      nearestStation: 'Howrah Junction',
      majorHighways: ['NH-16', 'NH-19'],
      busTerminal: 'Esplanade Bus Terminus'
    }
  },
  'bhubaneswar': {
    coordinates: [20.2961, 85.8245],
    score: 88,
    capacity: 'High',
    facilities: ['Cyclone Centers', 'Hospitals', 'Relief Management'],
    description: 'Capital with cyclone preparation',
    state: 'Odisha',
    elevation: '45m',
    hasAirport: true,
    hasRailway: true,
    transportInfo: {
      nearestAirport: 'Biju Patnaik International Airport (BBI)',
      nearestStation: 'Bhubaneswar Railway Station',
      majorHighways: ['NH-16', 'NH-203'],
      busTerminal: 'Baramunda Bus Stand'
    }
  },
  'patna': {
    coordinates: [25.5941, 85.1376],
    score: 84,
    capacity: 'High',
    facilities: ['Flood Centers', 'Medical Hubs', 'Relief Camps'],
    description: 'Historical city with flood management',
    state: 'Bihar',
    elevation: '53m',
    hasAirport: true,
    hasRailway: true,
    transportInfo: {
      nearestAirport: 'Jay Prakash Narayan Airport (PAT)',
      nearestStation: 'Patna Junction',
      majorHighways: ['NH-19', 'NH-31'],
      busTerminal: 'Patna ISBT'
    }
  },
  'gangtok': {
    coordinates: [27.3389, 88.6065],
    score: 88,
    capacity: 'Medium',
    facilities: ['Mountain Rescue', 'Medical Centers', 'Relief Points'],
    description: 'Mountain capital with rescue facilities',
    state: 'Sikkim',
    elevation: '1650m',
    hasAirport: false,
    hasRailway: false,
    transportInfo: {
      nearestAirport: 'Pakyong Airport (PYG) - 35km',
      nearestStation: 'New Jalpaiguri (NJP) - 148km',
      majorHighways: ['NH-10', 'NH-31A'],
      busTerminal: 'SNT Bus Terminal'
    }
  },

  // Northeast India
  'guwahati': {
    coordinates: [26.1445, 91.7362],
    score: 85,
    capacity: 'High',
    facilities: ['River Management', 'Medical Hubs', 'Relief Centers'],
    description: 'Gateway city with flood management',
    state: 'Assam',
    elevation: '55m',
    hasAirport: true,
    hasRailway: true,
    transportInfo: {
      nearestAirport: 'Lokpriya Gopinath Bordoloi Airport (GAU)',
      nearestStation: 'Guwahati Railway Station',
      majorHighways: ['NH-27', 'NH-37'],
      busTerminal: 'ISBT Guwahati'
    }
  },
  'itanagar': {
    coordinates: [27.0844, 93.6053],
    score: 86,
    capacity: 'Medium',
    facilities: ['Mountain Response', 'Medical Centers', 'Relief Camps'],
    description: 'Hill capital with rescue facilities',
    state: 'Arunachal Pradesh',
    elevation: '440m',
    hasAirport: false,
    hasRailway: true,
    transportInfo: {
      nearestAirport: 'Hollongi Airport (IXH) - 15km',
      nearestStation: 'Naharlagun Railway Station',
      majorHighways: ['NH-415', 'NH-713'],
      busTerminal: 'ISBT Itanagar'
    }
  },
  'imphal': {
    coordinates: [24.8170, 93.9368],
    score: 85,
    capacity: 'Medium',
    facilities: ['Emergency Services', 'Medical Units', 'Relief Points'],
    description: 'Valley capital with good connectivity',
    state: 'Manipur',
    elevation: '786m',
    hasAirport: true,
    hasRailway: false,
    transportInfo: {
      nearestAirport: 'Imphal International Airport (IMF)',
      nearestStation: 'Dimapur Railway Station (215km)',
      majorHighways: ['NH-2', 'NH-37'],
      busTerminal: 'ISBT Imphal'
    }
  },
  'aizawl': {
    coordinates: [23.7307, 92.7173],
    score: 84,
    capacity: 'Medium',
    facilities: ['Hill Rescue', 'Medical Centers', 'Relief Camps'],
    description: 'Hill station with emergency services',
    state: 'Mizoram',
    elevation: '1132m',
    hasAirport: true,
    hasRailway: false,
    transportInfo: {
      nearestAirport: 'Lengpui Airport (AJL)',
      nearestStation: 'Silchar Railway Station (180km)',
      majorHighways: ['NH-54', 'NH-306'],
      busTerminal: 'Zarkawt Bus Terminal'
    }
  },

  // West India
  'mumbai': {
    coordinates: [19.0760, 72.8777],
    score: 89,
    capacity: 'Very High',
    facilities: ['Coastal Defense', 'Major Hospitals', 'Emergency Response'],
    description: 'Metro with advanced disaster management',
    state: 'Maharashtra',
    elevation: '14m',
    hasAirport: true,
    hasRailway: true,
    transportInfo: {
      nearestAirport: 'Chhatrapati Shivaji International Airport (BOM)',
      nearestStation: 'CSMT Railway Station',
      majorHighways: ['NH-48', 'NH-66'],
      busTerminal: 'Mumbai Central Bus Depot'
    }
  },
  'gandhinagar': {
    coordinates: [23.2156, 72.6369],
    score: 90,
    capacity: 'High',
    facilities: ['Emergency Command', 'Medical Hubs', 'Relief Centers'],
    description: 'Planned capital with modern infrastructure',
    state: 'Gujarat',
    elevation: '81m',
    hasAirport: false,
    hasRailway: true,
    transportInfo: {
      nearestAirport: 'Ahmedabad International Airport (AMD) - 18km',
      nearestStation: 'Gandhinagar Capital',
      majorHighways: ['NH-48', 'NH-147'],
      busTerminal: 'Gandhinagar Bus Port'
    }
  },
  'panaji': {
    coordinates: [15.4909, 73.8278],
    score: 87,
    capacity: 'Medium',
    facilities: ['Coastal Protection', 'Medical Services', 'Relief Points'],
    description: 'Coastal capital with safety measures',
    state: 'Goa',
    elevation: '7m',
    hasAirport: true,
    hasRailway: true,
    transportInfo: {
      nearestAirport: 'Dabolim Airport (GOI)',
      nearestStation: 'Madgaon Junction',
      majorHighways: ['NH-66', 'NH-748'],
      busTerminal: 'Kadamba Bus Stand'
    }
  }
};

// Update regionCategories
export const regionCategories = {
  'North India': [
    'shimla',
    'srinagar',
    'dehradun',
    'chandigarh',
    'jaipur',
    'new delhi',
    'gulmarg',
    'pahalgam',
    'sonamarg',
    'leh',
    'kargil',
    'nubra',
    'manali',
    'dharamshala',
    'kullu'
  ],
  'South India': [
    'bangalore',
    'chennai',
    'thiruvananthapuram',
    'hyderabad',
    'amaravati',
    'mysore',
    'bangalore_east',
    'ooty',
    'kodaikanal',
    'yelagiri',
    'coonoor',
    'munnar',
    'wayanad',
    'thekkady',
    'vagamon',
    'coorg',
    'chikmagalur',
    'agumbe',
    'madikeri'
  ],
  'Central India': [
    'bhopal',
    'raipur',
    'indore',
    'gwalior',
    'jabalpur',
    'bilaspur',
    'jagdalpur'
  ],
  'East India': [
    'kolkata',
    'bhubaneswar',
    'patna',
    'gangtok',
    'darjeeling',
    'kalimpong',
    'kurseong',
    'pelling',
    'lachung',
    'ravangla',
    'rourkela',
    'sambalpur',
    'ranchi',
    'jamshedpur',
    'dhanbad'
  ],
  'West India': [
    'mumbai',
    'gandhinagar',
    'panaji',
    'pune',
    'nasik',
    'ahmedabad_east',
    'vadodara',
    'mount abu',
    'saputara',
    'girnar',
    'mahabaleshwar',
    'lonavala',
    'matheran',
    'panchgani'
  ],
  'Northeast India': [
    'guwahati',
    'itanagar',
    'imphal',
    'aizawl',
    'shillong',
    'cherrapunji',
    'mawlynnong',
    'tawang',
    'bomdila',
    'guwahati_hills',
    'kohima',
    'dimapur',
    'mokokchung',
    'agartala',
    'udaipur',
    'dharmanagar'
  ],
  'Union Territories': [
    'new delhi',
    'dwarka',
    'rohini',
    'puducherry',
    'karaikal',
    'mahe',
    'port blair',
    'havelock',
    'diglipur',
    'daman',
    'silvassa',
    'diu'
  ]
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

  // Additional States
  'Jharkhand': {
    primary: 'ranchi',
    fallback: ['jamshedpur', 'dhanbad'],
    coordinates: {
      'ranchi': [23.3441, 85.3096],
      'jamshedpur': [22.8046, 86.2029],
      'dhanbad': [23.7957, 86.4304]
    }
  },
  'Tripura': {
    primary: 'agartala',
    fallback: ['udaipur', 'dharmanagar'],
    coordinates: {
      'agartala': [23.8315, 91.2868],
      'udaipur': [23.5333, 91.4833],
      'dharmanagar': [24.3667, 92.1667]
    }
  },
  'Nagaland': {
    primary: 'kohima',
    fallback: ['dimapur', 'mokokchung'],
    coordinates: {
      'kohima': [25.6747, 94.1086],
      'dimapur': [25.9091, 93.7266],
      'mokokchung': [26.3297, 94.5235]
    }
  },

  // Union Territories
  'Delhi': {
    primary: 'new delhi',
    fallback: ['dwarka', 'rohini'],
    coordinates: {
      'new delhi': [28.6139, 77.2090],
      'dwarka': [28.5921, 77.0460],
      'rohini': [28.7480, 77.0679]
    }
  },
  'Puducherry': {
    primary: 'puducherry',
    fallback: ['karaikal', 'mahe'],
    coordinates: {
      'puducherry': [11.9416, 79.8083],
      'karaikal': [10.9254, 79.8380],
      'mahe': [11.7026, 75.5369]
    }
  },
  'Andaman and Nicobar': {
    primary: 'port blair',
    fallback: ['havelock', 'diglipur'],
    coordinates: {
      'port blair': [11.6234, 92.7265],
      'havelock': [12.0120, 92.9863],
      'diglipur': [13.2400, 93.9600]
    }
  }
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

// Add this after the existing imports
export const disasterToSafeZoneMapping = {
  'Assam Floods': {
    affected: [26.2006, 92.9376],
    safeZones: [
      {
        name: 'shillong',
        coordinates: [25.5788, 91.8933],
        score: 92,
        capacity: 'High',
        facilities: ['Flood Relief Center', 'Medical Centers', 'Emergency Response'],
        description: 'Highland city safe from floods with good infrastructure',
        state: 'Meghalaya',
        elevation: '1525m'
      },
      {
        name: 'guwahati_hills',
        coordinates: [26.1445, 91.7362],
        score: 88,
        capacity: 'High',
        facilities: ['Highland Shelter', 'Medical Facilities', 'Relief Camp'],
        description: 'Elevated areas within Guwahati city',
        state: 'Assam',
        elevation: '120m'
      }
    ]
  },
  'Karnataka Landslides': {
    affected: [12.9141, 75.7154],
    safeZones: [
      {
        name: 'mysore',
        coordinates: [12.2958, 76.6394],
        score: 90,
        capacity: 'High',
        facilities: ['Emergency Centers', 'Medical Hubs', 'Relief Camps'],
        description: 'Stable terrain with good infrastructure',
        state: 'Karnataka',
        elevation: '763m'
      },
      {
        name: 'bangalore_east',
        coordinates: [12.9716, 77.6561],
        score: 94,
        capacity: 'Very High',
        facilities: ['Tech-enabled Response', 'Medical Centers', 'Relief Coordination'],
        description: 'Safe urban area with advanced facilities',
        state: 'Karnataka',
        elevation: '920m'
      }
    ]
  },
  'Maharashtra Drought': {
    affected: [19.7515, 75.7139],
    safeZones: [
      {
        name: 'pune',
        coordinates: [18.5204, 73.8567],
        score: 91,
        capacity: 'Very High',
        facilities: ['Water Supply', 'Medical Centers', 'Relief Distribution'],
        description: 'Well-equipped city with water management',
        state: 'Maharashtra',
        elevation: '560m'
      },
      {
        name: 'nasik',
        coordinates: [19.9975, 73.7898],
        score: 88,
        capacity: 'High',
        facilities: ['Water Resources', 'Medical Facilities', 'Relief Centers'],
        description: 'City with good water infrastructure',
        state: 'Maharashtra',
        elevation: '584m'
      }
    ]
  },
  'Gujarat Cyclone': {
    affected: [22.2587, 71.1924],
    safeZones: [
      {
        name: 'ahmedabad_east',
        coordinates: [23.0225, 72.5714],
        score: 89,
        capacity: 'Very High',
        facilities: ['Cyclone Shelter', 'Medical Centers', 'Emergency Response'],
        description: 'Inland city with cyclone protection',
        state: 'Gujarat',
        elevation: '53m'
      },
      {
        name: 'vadodara',
        coordinates: [22.3072, 73.1812],
        score: 87,
        capacity: 'High',
        facilities: ['Storm Shelter', 'Medical Facilities', 'Relief Center'],
        description: 'Protected inland location',
        state: 'Gujarat',
        elevation: '39m'
      }
    ]
  },
  'Odisha Cyclone': {
    affected: [20.2961, 85.8245],
    safeZones: [
      {
        name: 'rourkela',
        coordinates: [22.2604, 84.8536],
        score: 86,
        capacity: 'High',
        facilities: ['Storm Shelter', 'Medical Hub', 'Relief Camp'],
        description: 'Industrial city with strong infrastructure',
        state: 'Odisha',
        elevation: '219m'
      },
      {
        name: 'sambalpur',
        coordinates: [21.4669, 83.9756],
        score: 85,
        capacity: 'Medium',
        facilities: ['Cyclone Center', 'Medical Facilities', 'Emergency Services'],
        description: 'Inland city protected from coastal effects',
        state: 'Odisha',
        elevation: '134m'
      }
    ]
  }
};

// Add a function to find nearest safe zone based on disaster location
export const findNearestSafeZoneFromDisaster = (disasterLocation) => {
  let nearestZone = null;
  let shortestDistance = Infinity;

  Object.values(disasterToSafeZoneMapping).forEach(mapping => {
    mapping.safeZones.forEach(zone => {
      const distance = calculateDistance(
        disasterLocation[0],
        disasterLocation[1],
        zone.coordinates[0],
        zone.coordinates[1]
      );
      
      if (distance < shortestDistance) {
        shortestDistance = distance;
        nearestZone = {
          ...zone,
          distance: Math.round(distance)
        };
      }
    });
  });

  return nearestZone;
};

// Add these new safe zones to the main safeLocations object
Object.values(disasterToSafeZoneMapping).forEach(mapping => {
  mapping.safeZones.forEach(zone => {
    if (!safeLocations[zone.name]) {
      safeLocations[zone.name] = zone;
    }
  });
});

// Add transportation options data
const transportModes = {
  air: {
    icon: '✈️',
    name: 'Air Travel',
    conditions: ['Distance > 700km', 'Airport available']
  },
  train: {
    icon: '🚂',
    name: 'Railway',
    conditions: ['Distance > 100km', 'Railway station available']
  },
  bus: {
    icon: '🚌',
    name: 'Bus',
    conditions: ['Distance < 700km', 'Road connectivity']
  },
  car: {
    icon: '🚗',
    name: 'Road',
    conditions: ['Distance < 500km', 'Highway available']
  }
};

// Add this function to determine best transport modes
const getBestTransportModes = (distance, destination) => {
  const modes = [];
  
  // Air Travel for long distances
  if (distance > 700 && destination.hasAirport) {
    modes.push({
      ...transportModes.air,
      recommended: true,
      duration: `${Math.round(distance/800)} hours`,
      details: 'Fastest option for long-distance relocation'
    });
  }

  // Train for medium to long distances
  if (distance > 100 && destination.hasRailway) {
    modes.push({
      ...transportModes.train,
      recommended: distance > 300 && distance < 800,
      duration: `${Math.round(distance/60)} hours`,
      details: 'Reliable option with good capacity'
    });
  }

  // Bus for medium distances
  if (distance < 700) {
    modes.push({
      ...transportModes.bus,
      recommended: distance < 300,
      duration: `${Math.round(distance/40)} hours`,
      details: 'Flexible and widely available'
    });
  }

  // Car for shorter distances
  if (distance < 500) {
    modes.push({
      ...transportModes.car,
      recommended: distance < 200,
      duration: `${Math.round(distance/50)} hours`,
      details: 'Personal vehicle for maximum flexibility'
    });
  }

  return modes.sort((a, b) => b.recommended - a.recommended);
};

// Create a SafeLocationPopup component
export const SafeLocationPopup = ({ zone, userLocation }) => (
  <Popup>
    <div className="bg-white p-4 rounded-lg">
      <h3 className="font-bold text-gray-900">{zone.name.toUpperCase()}</h3>
      <p className="text-green-600">Safety Score: {zone.score}%</p>
      <p className="text-gray-600">Capacity: {zone.capacity}</p>
    
    {userLocation && (
      <div className="mt-4 border-t pt-4">
        <h4 className="font-semibold text-gray-800 mb-2">Transportation Options</h4>
        <div className="space-y-2">
          {getBestTransportModes(
            calculateDistance(
              userLocation[0],
              userLocation[1],
              zone.coordinates[0],
              zone.coordinates[1]
            ),
            zone
          ).map((mode, index) => (
            <div 
              key={mode.name}
              className={`flex items-center p-2 rounded ${
                mode.recommended ? 'bg-blue-50' : 'bg-gray-50'
              }`}
            >
              <span className="text-xl mr-2">{mode.icon}</span>
              <div>
                <p className="font-medium text-gray-900">
                  {mode.name}
                  {mode.recommended && (
                    <span className="ml-2 text-xs text-blue-600 font-semibold">
                      RECOMMENDED
                    </span>
                  )}
                </p>
                <p className="text-sm text-gray-600">
                  Duration: {mode.duration}
                </p>
                <p className="text-xs text-gray-500">{mode.details}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    )}

    <div className="mt-4">
      <p className="font-semibold text-gray-700">Available Facilities:</p>
      <ul className="list-disc list-inside text-gray-600">
        {zone.facilities.map((facility, index) => (
          <li key={index}>{facility}</li>
        ))}
      </ul>
    </div>
  </div>
</Popup>);

// Add a function to get optimal transport mode based on real-time conditions
export const getOptimalTransport = (from, to, conditions = {}) => {
  const distance = calculateDistance(
    from[0], from[1],
    to.coordinates[0], to.coordinates[1]
  );

  const transportOptions = [];

  if (to.hasAirport && distance > 500) {
    transportOptions.push({
      mode: 'air',
      priority: 1,
      duration: Math.round(distance / 800 * 60), // minutes
      cost: 'High',
      reliability: conditions.weather === 'clear' ? 'High' : 'Medium',
      details: to.transportInfo.nearestAirport
    });
  }

  if (to.hasRailway && distance > 100) {
    transportOptions.push({
      mode: 'train',
      priority: 2,
      duration: Math.round(distance / 60 * 60), // minutes
      cost: 'Medium',
      reliability: 'High',
      details: to.transportInfo.nearestStation
    });
  }

  if (distance < 700) {
    transportOptions.push({
      mode: 'bus',
      priority: 3,
      duration: Math.round(distance / 40 * 60), // minutes
      cost: 'Low',
      reliability: 'Medium',
      details: to.transportInfo.busTerminal
    });
  }

  if (distance < 500) {
    transportOptions.push({
      mode: 'car',
      priority: 4,
      duration: Math.round(distance / 50 * 60), // minutes
      cost: 'Medium',
      reliability: 'High',
      details: `Via ${to.transportInfo.majorHighways.join(', ')}`
    });
  }

  // Sort by priority and conditions
  return transportOptions.sort((a, b) => {
    if (conditions.preferSpeed) return a.duration - b.duration;
    if (conditions.preferCost) return a.cost === 'Low' ? -1 : 1;
    return a.priority - b.priority;
  });
};