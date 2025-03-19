export const getTransportIcon = (mode) => {
  const icons = {
    air: '✈️',
    train: '🚂',
    bus: '🚌',
    car: '🚗'
  };
  return icons[mode] || '🚗';
};

export const formatDuration = (minutes) => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins}m`;
};

export const getCostEstimate = (mode, distance) => {
  const rates = {
    air: 8,    // Rs per km
    train: 2,  // Rs per km
    bus: 3,    // Rs per km
    car: 5     // Rs per km (including fuel)
  };
  return Math.round(distance * rates[mode]);
};

export const getWeatherImpact = (mode, weatherCondition) => {
  const impacts = {
    air: {
      clear: 'No delays expected',
      rain: 'Possible minor delays',
      storm: 'Major delays or cancellations likely'
    },
    train: {
      clear: 'Normal service',
      rain: 'Slight delays possible',
      storm: 'Reduced speed operations'
    },
    bus: {
      clear: 'Normal service',
      rain: 'Minor delays expected',
      storm: 'Limited service'
    },
    car: {
      clear: 'Normal driving conditions',
      rain: 'Drive with caution',
      storm: 'Not recommended'
    }
  };
  return impacts[mode][weatherCondition] || 'Status unknown';
};