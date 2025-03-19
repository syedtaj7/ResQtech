export const getNearestSafeZone = (currentLocation, safeLocations) => {
  const [userLat, userLon] = currentLocation;
  
  let nearest = null;
  let shortestDistance = Infinity;

  Object.entries(safeLocations).forEach(([name, location]) => {
    const distance = calculateDistance(
      userLat, 
      userLon, 
      location.coordinates[0], 
      location.coordinates[1]
    );

    if (distance < shortestDistance) {
      shortestDistance = distance;
      nearest = {
        ...location,
        name,
        distance: Math.round(distance)
      };
    }
  });

  return nearest;
};

export const calculateDistance = (lat1, lon1, lat2, lon2) => {
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