import { Report } from './types';

export const mockReports: Report[] = [
  {
    id: '1',
    eventType: 'high_wave',
    text: 'Unusually large waves hitting the Mumbai coastline, approximately 4-5 meters high. Vehicles near the promenade getting splashed.',
    lat: 19.0760,
    lng: 72.8777,
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    trust: 0.87,
    status: 'new',
    media: ['/api/placeholder-image/1', '/api/placeholder-image/2'],
    exifData: {
      location: 'Mumbai, Maharashtra, India',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      device: 'iPhone 14 Pro'
    },
    validationReasons: ['EXIF verified', 'Location matches report', 'Multiple media sources']
  },
  {
    id: '2',
    eventType: 'flood',
    text: 'Street flooding reported near Chennai marina area. Water levels blocking small vehicles and local shops affected.',
    lat: 13.0827,
    lng: 80.2707,
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
    trust: 0.73,
    status: 'in_review',
    media: ['/api/placeholder-image/3'],
    exifData: {
      location: 'Chennai, Tamil Nadu, India',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      device: 'Samsung Galaxy S23'
    },
    validationReasons: ['EXIF timestamp valid', 'GPS coordinates accurate']
  },
  {
    id: '3',
    eventType: 'unusual_tide',
    text: 'Extremely low tide near Kolkata coast exposing areas usually underwater. Fishermen reporting exposed reef patches far from normal shorelines.',
    lat: 22.5726,
    lng: 88.3639,
    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), // 1 hour ago
    trust: 0.92,
    status: 'verified',
    media: ['/api/placeholder-image/4', '/api/placeholder-image/5'],
    exifData: {
      location: 'Kolkata, West Bengal, India',
      timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
      device: 'iPhone 15'
    },
    validationReasons: ['EXIF verified', 'Cross-referenced with tide data', 'Multiple witnesses']
  }
];

// Time decay function: exponential decay with τ = 6 hours
export const calculateTimeDecay = (timestamp: string, tauHours: number = 6): number => {
  const reportTime = new Date(timestamp).getTime();
  const currentTime = Date.now();
  const hoursElapsed = (currentTime - reportTime) / (1000 * 60 * 60);
  
  // Exponential decay: e^(-t/τ)
  return Math.exp(-hoursElapsed / tauHours);
};

export const calculateTrustWeightedIntensity = (report: Report): number => {
  const timeDecay = calculateTimeDecay(report.timestamp);
  return report.trust * timeDecay;
};

export const generateMockReport = (): Report => {
  const eventTypes: Report['eventType'][] = ['high_wave', 'unusual_tide', 'flood'];
  const locations = [
    { lat: 19.0760, lng: 72.8777, name: 'Mumbai' },
    { lat: 13.0827, lng: 80.2707, name: 'Chennai' },
    { lat: 22.5726, lng: 88.3639, name: 'Kolkata' },
    { lat: 9.9312, lng: 76.2673, name: 'Kochi' },
    { lat: 17.6868, lng: 83.2185, name: 'Visakhapatnam' },
    { lat: 15.4909, lng: 73.8278, name: 'Panaji (Goa)' },
    { lat: 11.9416, lng: 79.8083, name: 'Pondicherry' }
  ];
  
  const eventType = eventTypes[Math.floor(Math.random() * eventTypes.length)];
  const location = locations[Math.floor(Math.random() * locations.length)];
  
  return {
    id: Date.now().toString(),
    eventType,
    text: `New ${eventType.replace('_', ' ')} report from ${location.name}. Citizen observation indicates significant ${eventType.replace('_', ' ')} activity.`,
    lat: location.lat + (Math.random() - 0.5) * 0.01, // Small random offset
    lng: location.lng + (Math.random() - 0.5) * 0.01,
    timestamp: new Date().toISOString(),
    trust: 0.6 + Math.random() * 0.4, // Trust between 0.6-1.0
    status: 'new',
    media: [`/api/placeholder-image/${Date.now()}`],
    exifData: {
      location: location.name + ', India',
      timestamp: new Date().toISOString(),
      device: 'Mobile Device'
    },
    validationReasons: ['Real-time report', 'Automated verification pending']
  };
};
