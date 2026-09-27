export interface CityLocation {
  city: string;
  country: string;
  latitude: number;
  longitude: number;
  timezone: number; // UTC offset in hours
  state?: string;
}

export const CITIES_DATABASE: CityLocation[] = [
  // India Major Cities
  { city: 'New Delhi', country: 'India', state: 'Delhi', latitude: 28.6139, longitude: 77.2090, timezone: 5.5 },
  { city: 'Mumbai', country: 'India', state: 'Maharashtra', latitude: 19.0760, longitude: 72.8777, timezone: 5.5 },
  { city: 'Bengaluru', country: 'India', state: 'Karnataka', latitude: 12.9716, longitude: 77.5946, timezone: 5.5 },
  { city: 'Kolkata', country: 'India', state: 'West Bengal', latitude: 22.5726, longitude: 88.3639, timezone: 5.5 },
  { city: 'Chennai', country: 'India', state: 'Tamil Nadu', latitude: 13.0827, longitude: 80.2707, timezone: 5.5 },
  { city: 'Hyderabad', country: 'India', state: 'Telangana', latitude: 17.3850, longitude: 78.4867, timezone: 5.5 },
  { city: 'Ahmedabad', country: 'India', state: 'Gujarat', latitude: 23.0225, longitude: 72.5714, timezone: 5.5 },
  { city: 'Pune', country: 'India', state: 'Maharashtra', latitude: 18.5204, longitude: 73.8567, timezone: 5.5 },
  { city: 'Jaipur', country: 'India', state: 'Rajasthan', latitude: 26.9124, longitude: 75.7873, timezone: 5.5 },
  { city: 'Lucknow', country: 'India', state: 'Uttar Pradesh', latitude: 26.8467, longitude: 80.9462, timezone: 5.5 },
  { city: 'Varanasi', country: 'India', state: 'Uttar Pradesh', latitude: 25.3176, longitude: 82.9739, timezone: 5.5 },
  { city: 'Chandigarh', country: 'India', state: 'Punjab/Haryana', latitude: 30.7333, longitude: 76.7794, timezone: 5.5 },
  { city: 'Surat', country: 'India', state: 'Gujarat', latitude: 21.1702, longitude: 72.8311, timezone: 5.5 },
  { city: 'Bhopal', country: 'India', state: 'Madhya Pradesh', latitude: 23.2599, longitude: 77.4126, timezone: 5.5 },
  { city: 'Indore', country: 'India', state: 'Madhya Pradesh', latitude: 22.7196, longitude: 75.8577, timezone: 5.5 },
  { city: 'Nagpur', country: 'India', state: 'Maharashtra', latitude: 21.1458, longitude: 79.0882, timezone: 5.5 },
  { city: 'Patna', country: 'India', state: 'Bihar', latitude: 25.5941, longitude: 85.1376, timezone: 5.5 },
  { city: 'Kochi', country: 'India', state: 'Kerala', latitude: 9.9312, longitude: 76.2673, timezone: 5.5 },
  { city: 'Thiruvananthapuram', country: 'India', state: 'Kerala', latitude: 8.5241, longitude: 76.9366, timezone: 5.5 },
  { city: 'Coimbatore', country: 'India', state: 'Tamil Nadu', latitude: 11.0168, longitude: 76.9558, timezone: 5.5 },
  { city: 'Guwahati', country: 'India', state: 'Assam', latitude: 26.1445, longitude: 91.7362, timezone: 5.5 },
  { city: 'Bhubaneswar', country: 'India', state: 'Odisha', latitude: 20.2961, longitude: 85.8245, timezone: 5.5 },
  { city: 'Dehradun', country: 'India', state: 'Uttarakhand', latitude: 30.3165, longitude: 78.0322, timezone: 5.5 },
  { city: 'Amritsar', country: 'India', state: 'Punjab', latitude: 31.6340, longitude: 74.8723, timezone: 5.5 },
  { city: 'Agra', country: 'India', state: 'Uttar Pradesh', latitude: 27.1767, longitude: 78.0081, timezone: 5.5 },
  { city: 'Nashik', country: 'India', state: 'Maharashtra', latitude: 19.9975, longitude: 73.7898, timezone: 5.5 },
  { city: 'Vadodara', country: 'India', state: 'Gujarat', latitude: 22.3072, longitude: 73.1812, timezone: 5.5 },
  { city: 'Visakhapatnam', country: 'India', state: 'Andhra Pradesh', latitude: 17.6868, longitude: 83.2185, timezone: 5.5 },

  // USA Major Cities
  { city: 'New York', country: 'United States', state: 'NY', latitude: 40.7128, longitude: -74.0060, timezone: -5 },
  { city: 'Los Angeles', country: 'United States', state: 'CA', latitude: 34.0522, longitude: -118.2437, timezone: -8 },
  { city: 'Chicago', country: 'United States', state: 'IL', latitude: 41.8781, longitude: -87.6298, timezone: -6 },
  { city: 'San Francisco', country: 'United States', state: 'CA', latitude: 37.7749, longitude: -122.4194, timezone: -8 },
  { city: 'Houston', country: 'United States', state: 'TX', latitude: 29.7604, longitude: -95.3698, timezone: -6 },
  { city: 'Seattle', country: 'United States', state: 'WA', latitude: 47.6062, longitude: -122.3321, timezone: -8 },
  { city: 'Austin', country: 'United States', state: 'TX', latitude: 30.2672, longitude: -97.7431, timezone: -6 },
  { city: 'Boston', country: 'United States', state: 'MA', latitude: 42.3601, longitude: -71.0589, timezone: -5 },
  { city: 'Miami', country: 'United States', state: 'FL', latitude: 25.7617, longitude: -80.1918, timezone: -5 },
  { city: 'Dallas', country: 'United States', state: 'TX', latitude: 32.7767, longitude: -96.7970, timezone: -6 },
  { city: 'Denver', country: 'United States', state: 'CO', latitude: 39.7392, longitude: -104.9903, timezone: -7 },
  { city: 'Atlanta', country: 'United States', state: 'GA', latitude: 33.7490, longitude: -84.3880, timezone: -5 },

  // UK & Europe
  { city: 'London', country: 'United Kingdom', state: 'England', latitude: 51.5074, longitude: -0.1278, timezone: 0 },
  { city: 'Birmingham', country: 'United Kingdom', state: 'England', latitude: 52.4862, longitude: -1.8904, timezone: 0 },
  { city: 'Manchester', country: 'United Kingdom', state: 'England', latitude: 53.4808, longitude: -2.2426, timezone: 0 },
  { city: 'Paris', country: 'France', latitude: 48.8566, longitude: 2.3522, timezone: 1 },
  { city: 'Berlin', country: 'Germany', latitude: 52.5200, longitude: 13.4050, timezone: 1 },
  { city: 'Frankfurt', country: 'Germany', latitude: 50.1109, longitude: 8.6821, timezone: 1 },
  { city: 'Amsterdam', country: 'Netherlands', latitude: 52.3676, longitude: 4.9041, timezone: 1 },
  { city: 'Zurich', country: 'Switzerland', latitude: 47.3769, longitude: 8.5417, timezone: 1 },
  { city: 'Madrid', country: 'Spain', latitude: 40.4168, longitude: -3.7038, timezone: 1 },
  { city: 'Rome', country: 'Italy', latitude: 41.9028, longitude: 12.4964, timezone: 1 },
  { city: 'Vienna', country: 'Austria', latitude: 48.2082, longitude: 16.3738, timezone: 1 },
  { city: 'Dublin', country: 'Ireland', latitude: 53.3498, longitude: -6.2603, timezone: 0 },

  // Canada
  { city: 'Toronto', country: 'Canada', state: 'ON', latitude: 43.6532, longitude: -79.3832, timezone: -5 },
  { city: 'Vancouver', country: 'Canada', state: 'BC', latitude: 49.2827, longitude: -123.1207, timezone: -8 },
  { city: 'Montreal', country: 'Canada', state: 'QC', latitude: 45.5017, longitude: -73.5673, timezone: -5 },
  { city: 'Calgary', country: 'Canada', state: 'AB', latitude: 51.0447, longitude: -114.0719, timezone: -7 },

  // Middle East & Asia Pacific
  { city: 'Dubai', country: 'United Arab Emirates', latitude: 25.2048, longitude: 55.2708, timezone: 4 },
  { city: 'Abu Dhabi', country: 'United Arab Emirates', latitude: 24.4539, longitude: 54.3773, timezone: 4 },
  { city: 'Singapore', country: 'Singapore', latitude: 1.3521, longitude: 103.8198, timezone: 8 },
  { city: 'Kuala Lumpur', country: 'Malaysia', latitude: 3.1390, longitude: 101.6869, timezone: 8 },
  { city: 'Tokyo', country: 'Japan', latitude: 35.6762, longitude: 139.6503, timezone: 9 },
  { city: 'Sydney', country: 'Australia', state: 'NSW', latitude: -33.8688, longitude: 151.2093, timezone: 10 },
  { city: 'Melbourne', country: 'Australia', state: 'VIC', latitude: -37.8136, longitude: 144.9631, timezone: 10 },
  { city: 'Auckland', country: 'New Zealand', latitude: -36.8485, longitude: 174.7633, timezone: 12 },
  { city: 'Bangkok', country: 'Thailand', latitude: 13.7563, longitude: 100.5018, timezone: 7 },
  { city: 'Hong Kong', country: 'Hong Kong', latitude: 22.3193, longitude: 114.1694, timezone: 8 },
  { city: 'Kathmandu', country: 'Nepal', latitude: 27.7172, longitude: 85.3240, timezone: 5.75 },
  { city: 'Colombo', country: 'Sri Lanka', latitude: 6.9271, longitude: 79.8612, timezone: 5.5 },
  { city: 'Dhaka', country: 'Bangladesh', latitude: 23.8103, longitude: 90.4125, timezone: 6 },
  { city: 'Doha', country: 'Qatar', latitude: 25.2854, longitude: 51.5310, timezone: 3 },
  { city: 'Riyadh', country: 'Saudi Arabia', latitude: 24.7136, longitude: 46.6753, timezone: 3 },
];

export function searchCities(query: string): CityLocation[] {
  if (!query || query.trim().length === 0) return CITIES_DATABASE.slice(0, 10);
  const q = query.toLowerCase().trim();
  return CITIES_DATABASE.filter(c =>
    c.city.toLowerCase().includes(q) ||
    c.country.toLowerCase().includes(q) ||
    (c.state && c.state.toLowerCase().includes(q))
  ).slice(0, 10);
}

export function resolveCityCoordinates(cityName: string, countryName?: string): CityLocation {
  const match = CITIES_DATABASE.find(c => 
    c.city.toLowerCase() === cityName.toLowerCase() &&
    (!countryName || c.country.toLowerCase() === countryName.toLowerCase())
  );
  if (match) return match;

  // Fallback default: New Delhi
  return {
    city: cityName,
    country: countryName || 'India',
    latitude: 28.6139,
    longitude: 77.2090,
    timezone: 5.5,
  };
}
