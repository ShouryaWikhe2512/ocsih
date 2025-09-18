export interface Report {
  id: string;
  eventType: 'high_wave' | 'unusual_tide' | 'flood';
  text: string;
  lat: number;
  lng: number;
  timestamp: string;
  trust: number;
  status: 'new' | 'in_review' | 'verified' | 'rejected';
  media: string[];
  exifData?: {
    location: string;
    timestamp: string;
    device: string;
  };
  validationReasons?: string[];
}

export interface Filters {
  eventType: string;
  minTrust: number;
  timeWindow: number; // hours
  verifiedOnly: boolean;
}

export interface KPIData {
  totalReports: number;
  verifiedReports: number;
  pendingReports: number;
  rejectedReports: number;
}