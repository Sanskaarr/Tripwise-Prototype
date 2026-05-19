export interface Place {
  id: string;
  name: string;
  address: string;
  lat?: number;
  lng?: number;
}

/**
 * Extracts place names from markdown text (looking for **Place Name**)
 * and returns a list of places.
 */
export const extractPlacesFromText = (text: string): string[] => {
  const placeRegex = /\*\*(.*?)\*\*/g;
  const matches = [];
  let match;
  
  while ((match = placeRegex.exec(text)) !== null) {
    // Only count as a place if it's not a day header like "Day 1"
    const name = match[1];
    if (name && !name.toLowerCase().startsWith('day ') && name.length > 2) {
      matches.push(name);
    }
  }
  
  return [...new Set(matches)]; // Return unique matches
};

/**
 * Mock geocoding for now - in production this would call Google Maps Geocoding API
 */
export const extractAndGeocodePlaces = async (text: string, destination: string): Promise<Place[]> => {
  const names = extractPlacesFromText(text);
  
  return names.map((name, index) => ({
    id: `place-${Date.now()}-${index}`,
    name: name,
    address: `${name}, ${destination}`,
    // Mock coordinates around a center point for demo
    lat: 0, 
    lng: 0
  }));
};
