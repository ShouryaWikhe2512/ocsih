export interface Report {
  id: string;
  // Crime analysis structure fields
  eventType?: 'theft' | 'assault' | 'burglary' | 'fraud' | 'vandalism' | 'robbery' | 'domestic_violence' | 'cyber_crime';
  text?: string;
  lat: number;
  lng: number;
  timestamp: string;
  trust?: number;
  status: 'new' | 'in_review' | 'verified' | 'rejected' | 'pending';
  media: string[];
  exifData?: {
    location: string;
    timestamp: string;
    device: string;
  };
  validationReasons?: string[];
  
  // New structure fields from your Firestore data
  reportId?: string;
  reportTitle?: string;
  reportType?: string;
  description?: string;
  location?: {
    address: string;
    lat: number;
    lng: number;
  };
  mediaCount?: number;
  priorityLevel?: string;
  trustLevel?: string;
  trustScore?: number;
  reportMetadata?: {
    affected_area_size?: any;
    authority_contact?: boolean;
    casualty_mentions?: boolean;
    estimated_severity?: string;
    time_indicators?: any[];
  };
  requiresManualReview?: boolean;
  submissionTimestamp?: string;
  userId?: string;
  createdAt?: any;
  updatedAt?: any;
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