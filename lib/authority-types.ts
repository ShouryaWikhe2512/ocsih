export interface Incident {
  id: string;
  title: string;
  eventType: 'high_wave' | 'unusual_tide' | 'flood' | 'cyclone';
  location: {
    lat: number;
    lng: number;
    district: string;
    state: string;
    address: string;
  };
  severity: 'low' | 'moderate' | 'high' | 'extreme';
  confidence: number; // 0-1
  status: 'open' | 'acknowledged' | 'dispatched' | 'published' | 'closed';
  timestamp: string;
  description: string;
  media: string[];
  analystNotes: string;
  validationEvidence: {
    exifValid: boolean;
    locationConfirmed: boolean;
    timelineConsistent: boolean;
    crossReferenced: boolean;
  };
  affectedPopulation?: number;
  resources?: string[];
  contacts?: Contact[];
}

export interface Contact {
  name: string;
  role: string;
  phone: string;
  email: string;
  department: string;
}

export interface Resource {
  id: string;
  name: string;
  type: 'shelter' | 'hospital' | 'fire_station' | 'police' | 'coast_guard';
  lat: number;
  lng: number;
  capacity?: number;
  contact: string;
  available: boolean;
}

export interface AuditEntry {
  id: string;
  incidentId: string;
  action: string;
  userId: string;
  userRole: string;
  timestamp: string;
  details: Record<string, any>;
  outcome?: string;
}

export interface SopStep {
  step: number;
  action: string;
  responsible: string;
  timeframe: string;
  priority: 'immediate' | 'urgent' | 'normal';
}

export interface SopMapping {
  eventType: string;
  severity: string;
  steps: SopStep[];
  contacts: Contact[];
}

export interface KpiData {
  openIncidents: number;
  newToday: number;
  avgConfidence: number;
  medianAcknowledgeTime: number; // minutes
}

export interface Filters {
  dateRange: { start: string; end: string };
  eventType: string;
  district: string;
  severity: string;
  confidenceRange: { min: number; max: number };
  verifiedOnly: boolean;
}

export interface NotificationData {
  type: 'new_incident' | 'dispatch_update' | 'system_alert';
  data: any;
  timestamp: string;
}