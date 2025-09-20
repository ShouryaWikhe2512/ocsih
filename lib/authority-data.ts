import { Incident, Resource, SopMapping, Contact, AuditEntry } from './authority-types';

export const mockIncidents: Incident[] = [
  {
    id: 'INC-001',
    title: 'High Waves - Mumbai Coastline',
    eventType: 'high_wave',
    location: {
      lat: 19.0760,
      lng: 72.8777,
      district: 'Mumbai',
      state: 'Maharashtra',
      address: 'Marine Drive, Mumbai'
    },
    severity: 'high',
    confidence: 0.92,
    status: 'open',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    description: 'Unusually high waves (4-5 meters) observed along Marine Drive. Multiple vehicles affected, coastal road partially flooded.',
    media: ['/api/media/1.jpg', '/api/media/2.jpg'],
    analystNotes: 'Verified through multiple sources. EXIF data confirms location and timestamp. Cross-referenced with IMD weather data.',
    validationEvidence: {
      exifValid: true,
      locationConfirmed: true,
      timelineConsistent: true,
      crossReferenced: true
    },
    affectedPopulation: 5000,
    resources: ['RES-001', 'RES-002'],
    contacts: [
      {
        name: 'Rajesh Kumar',
        role: 'District Collector',
        phone: '+91-98765-43210',
        email: 'rajesh.kumar@gov.in',
        department: 'Revenue Department'
      }
    ]
  },
  {
    id: 'INC-002',
    title: 'Coastal Flooding - Kochi',
    eventType: 'flood',
    location: {
      lat: 9.9312,
      lng: 76.2673,
      district: 'Ernakulam',
      state: 'Kerala',
      address: 'Fort Kochi Beach'
    },
    severity: 'moderate',
    confidence: 0.87,
    status: 'acknowledged',
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    description: 'Tidal surge causing localized flooding in low-lying coastal areas. Water level 2-3 feet in residential areas.',
    media: ['/api/media/3.jpg'],
    analystNotes: 'Incident validated. Correlates with high tide predictions. Local authorities informed.',
    validationEvidence: {
      exifValid: true,
      locationConfirmed: true,
      timelineConsistent: true,
      crossReferenced: true
    },
    affectedPopulation: 1200,
    resources: ['RES-003', 'RES-004'],
    contacts: [
      {
        name: 'Priya Nair',
        role: 'Emergency Response Officer',
        phone: '+91-98765-54321',
        email: 'priya.nair@kerala.gov.in',
        department: 'Disaster Management'
      }
    ]
  }
];

export const mockResources: Resource[] = [
  {
    id: 'RES-001',
    name: 'Mumbai Emergency Shelter',
    type: 'shelter',
    lat: 19.0726,
    lng: 72.8826,
    capacity: 500,
    contact: '+91-22-2266-1234',
    available: true
  },
  {
    id: 'RES-002',
    name: 'KEM Hospital',
    type: 'hospital',
    lat: 19.0095,
    lng: 72.8450,
    capacity: 800,
    contact: '+91-22-2413-6051',
    available: true
  }
];

export const mockSopMappings: SopMapping[] = [
  {
    eventType: 'high_wave',
    severity: 'high',
    steps: [
      {
        step: 1,
        action: 'Issue immediate public warning',
        responsible: 'Media Officer',
        timeframe: '15 minutes',
        priority: 'immediate'
      },
      {
        step: 2,
        action: 'Deploy coastal security teams',
        responsible: 'Police Commissioner',
        timeframe: '30 minutes',
        priority: 'immediate'
      },
      {
        step: 3,
        action: 'Activate emergency shelters',
        responsible: 'District Collector',
        timeframe: '45 minutes',
        priority: 'urgent'
      }
    ],
    contacts: [
      {
        name: 'Control Room',
        role: 'Emergency Coordinator',
        phone: '108',
        email: 'emergency@gov.in',
        department: 'Disaster Management'
      }
    ]
  }
];

let incidents = [...mockIncidents];
let resources = [...mockResources];
let auditLog: AuditEntry[] = [];

export { incidents, resources, auditLog };

export const generateMockAuditEntry = (incidentId: string, action: string): AuditEntry => ({
  id: `AUDIT-${Date.now()}`,
  incidentId,
  action,
  userId: 'USER-001',
  userRole: 'District Officer',
  timestamp: new Date().toISOString(),
  details: { action, timestamp: new Date().toISOString() },
  outcome: 'success'
});