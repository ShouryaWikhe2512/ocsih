// Types matching the Prisma schema
export interface CrimeReport {
  id: string;
  userId: string;
  timestamp: Date;
  location: string;
  description: string;
  mediaUrls: string; // JSON string of media URLs
  mediaType: 'PHOTO' | 'VIDEO';
  status: 'PENDING' | 'VERIFIED' | 'REJECTED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  category: string;
  latitude?: number;
  longitude?: number;
  walletAddress?: string;
  createdAt: Date;
  updatedAt: Date;
  
  // Relations
  user?: User;
  aiAnalysis?: AIAnalysis;
  humanVerification?: HumanVerification;
  solanaReward?: SolanaReward;
  escalation?: Escalation;
}

export interface User {
  id: string;
  email: string;
  name?: string;
  role: 'USER' | 'ADMIN' | 'MODERATOR';
  createdAt: Date;
  updatedAt: Date;
}

export interface AIAnalysis {
  id: string;
  crimeReportId: string;
  confidence: number; // 0-100
  crimeType: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  description: string;
  riskFactors: string; // JSON string
  recommendations: string; // JSON string
  people: string; // JSON string
  vehicles: string; // JSON string
  weapons: string; // JSON string
  locations: string; // JSON string
  objects: string; // JSON string
  createdAt: Date;
  updatedAt: Date;
}

export interface HumanVerification {
  id: string;
  crimeReportId: string;
  verifiedBy: string;
  verifiedAt: Date;
  isVerified: boolean;
  notes: string;
  confidence: number; // 0-100
  requiresFollowUp: boolean;
  createdAt: Date;
  updatedAt: Date;
  
  // Relations
  admin?: User;
}

export interface SolanaReward {
  id: string;
  crimeReportId: string;
  recipientAddress: string;
  amount: number; // Amount in SOL
  transactionId?: string;
  status: 'PENDING' | 'SENT' | 'FAILED';
  createdAt: Date;
  updatedAt: Date;
}

export interface Escalation {
  id: string;
  crimeReportId: string;
  escalatedTo: string; // Department name
  escalatedBy: string; // Who escalated it
  escalatedAt: Date;
  escalationNotes?: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'REJECTED';
  createdAt: Date;
  updatedAt: Date;
  
  // Relations
  crimeReport?: CrimeReport;
}

// Legacy interface for backward compatibility with existing components
export interface Report {
  id: string;
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
  
  // Additional fields for compatibility
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
  
  // Escalation fields
  escalatedTo?: string;
  escalatedAt?: string;
  escalatedBy?: string;
  escalationNotes?: string;
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

// Escalation mapping for crime categories to departments
export const ESCALATION_MAPPING: Record<string, string> = {
  'SEXUAL_VIOLENCE': "Women's Cell",
  'DOMESTIC_VIOLENCE': "Women's Cell", 
  'STREET_CRIMES': "Crime Branch",
  'MOB_VIOLENCE_LYNCHING': "Law & Order Division",
  'ROAD_RAGE_INCIDENTS': "Traffic Police",
  'CYBERCRIMES': "Cyber Crime Cell",
  'DRUG': "Anti Narcotics Cell",
};

// Escalation interface
export interface EscalationData {
  crimeReportId: string;
  escalatedTo: string;
  escalatedBy: string;
  escalationNotes?: string;
}