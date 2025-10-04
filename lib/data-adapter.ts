import { CrimeReport, AIAnalysis, HumanVerification } from '@/lib/types';

// Adapter to convert Prisma CrimeReport to legacy Report format
export function adaptCrimeReportToReport(crimeReport: CrimeReport): any {
  // Parse media URLs from JSON string
  let media: string[] = [];
  try {
    media = JSON.parse(crimeReport.mediaUrls || '[]');
  } catch {
    media = [];
  }

  // Parse AI analysis data
  let aiAnalysisData = null;
  if (crimeReport.aiAnalysis) {
    try {
      aiAnalysisData = {
        confidence: crimeReport.aiAnalysis.confidence,
        crimeType: crimeReport.aiAnalysis.crimeType,
        severity: crimeReport.aiAnalysis.severity,
        riskFactors: JSON.parse(crimeReport.aiAnalysis.riskFactors || '{}'),
        recommendations: JSON.parse(crimeReport.aiAnalysis.recommendations || '{}'),
        people: JSON.parse(crimeReport.aiAnalysis.people || '[]'),
        vehicles: JSON.parse(crimeReport.aiAnalysis.vehicles || '[]'),
        weapons: JSON.parse(crimeReport.aiAnalysis.weapons || '[]'),
        locations: JSON.parse(crimeReport.aiAnalysis.locations || '[]'),
        objects: JSON.parse(crimeReport.aiAnalysis.objects || '[]'),
      };
    } catch {
      aiAnalysisData = null;
    }
  }

  // Convert status from Prisma enum to legacy format
  const statusMap = {
    'PENDING': 'new',
    'VERIFIED': 'verified',
    'REJECTED': 'rejected',
  };

  // Convert priority to trust score approximation
  const priorityToTrust = {
    'LOW': 0.3,
    'MEDIUM': 0.6,
    'HIGH': 0.8,
    'CRITICAL': 0.9,
  };

  // Map CrimeCategory enum to legacy eventType format
  const categoryToEventType = {
    'SEXUAL_VIOLENCE': 'sexual_violence',
    'DOMESTIC_VIOLENCE': 'domestic_violence', 
    'STREET_CRIMES': 'street_crimes',
    'MOB_VIOLENCE_LYNCHING': 'mob_violence_lynching',
    'ROAD_RAGE_INCIDENTS': 'road_rage_incidents',
    'CYBERCRIMES': 'cybercrimes',
    'DRUG': 'drug',
  };

  return {
    id: crimeReport.id,
    eventType: categoryToEventType[crimeReport.category] || crimeReport.category?.toLowerCase(),
    text: crimeReport.description,
    lat: crimeReport.latitude || 0,
    lng: crimeReport.longitude || 0,
    timestamp: crimeReport.timestamp.toISOString(),
    trust: priorityToTrust[crimeReport.priority] || 0.5,
    status: statusMap[crimeReport.status] || 'pending',
    media,
    mediaCount: media.length,
    
    // Additional fields for compatibility
    reportId: crimeReport.id,
    reportTitle: `${crimeReport.category?.replace('_', ' ')} Report`,
    reportType: crimeReport.mediaType,
    description: crimeReport.description,
    location: {
      address: crimeReport.location,
      lat: crimeReport.latitude || 0,
      lng: crimeReport.longitude || 0,
    },
    priorityLevel: crimeReport.priority,
    trustLevel: crimeReport.priority,
    trustScore: priorityToTrust[crimeReport.priority] || 0.5,
    
    // AI Analysis data
    aiAnalysis: aiAnalysisData,
    
    // Human verification data
    humanVerification: crimeReport.humanVerification ? {
      isVerified: crimeReport.humanVerification.isVerified,
      notes: crimeReport.humanVerification.notes,
      confidence: crimeReport.humanVerification.confidence,
      verifiedBy: crimeReport.humanVerification.verifiedBy,
      verifiedAt: crimeReport.humanVerification.verifiedAt,
    } : null,
    
    // Metadata
    userId: crimeReport.userId,
    createdAt: crimeReport.createdAt,
    updatedAt: crimeReport.updatedAt,
    walletAddress: crimeReport.walletAddress,
    
    // Escalation data
    escalatedTo: crimeReport.escalation?.escalatedTo,
    escalatedAt: crimeReport.escalation?.escalatedAt,
    escalatedBy: crimeReport.escalation?.escalatedBy,
    escalationNotes: crimeReport.escalation?.escalationNotes,
  };
}

// Adapter to convert legacy Report format to Prisma CrimeReport format
export function adaptReportToCrimeReport(report: any): Partial<CrimeReport> {
  return {
    id: report.id,
    userId: report.userId || 'anonymous',
    location: report.location?.address || report.text || 'Unknown location',
    description: report.description || report.text || '',
    mediaUrls: JSON.stringify(report.media || []),
    mediaType: report.reportType === 'VIDEO' ? 'VIDEO' : 'PHOTO',
    status: report.status === 'verified' ? 'VERIFIED' : 
            report.status === 'rejected' ? 'REJECTED' : 'PENDING',
    priority: report.priorityLevel || 'MEDIUM',
    category: report.eventType || 'theft',
    latitude: report.lat || report.location?.lat,
    longitude: report.lng || report.location?.lng,
    walletAddress: report.walletAddress,
  };
}

// Helper to get KPI data from crime reports
export function getKPIDataFromCrimeReports(crimeReports: CrimeReport[]) {
  const totalReports = crimeReports.length;
  const verifiedReports = crimeReports.filter(r => r.status === 'VERIFIED').length;
  const pendingReports = crimeReports.filter(r => r.status === 'PENDING').length;
  const rejectedReports = crimeReports.filter(r => r.status === 'REJECTED').length;

  return {
    totalReports,
    verifiedReports,
    pendingReports,
    rejectedReports,
  };
}

// Helper to filter crime reports based on legacy filters
export function filterCrimeReports(
  crimeReports: CrimeReport[],
  filters: {
    eventType: string;
    minTrust: number;
    timeWindow: number;
    verifiedOnly: boolean;
  }
) {
  const priorityToTrust = {
    'LOW': 0.3,
    'MEDIUM': 0.6,
    'HIGH': 0.8,
    'CRITICAL': 0.9,
  };

  // Map CrimeCategory enum to legacy eventType format for filtering
  const categoryToEventType = {
    'SEXUAL_VIOLENCE': 'sexual_violence',
    'DOMESTIC_VIOLENCE': 'domestic_violence', 
    'STREET_CRIMES': 'street_crimes',
    'MOB_VIOLENCE_LYNCHING': 'mob_violence_lynching',
    'ROAD_RAGE_INCIDENTS': 'road_rage_incidents',
    'CYBERCRIMES': 'cybercrimes',
    'DRUG': 'drug',
  };

  return crimeReports.filter((report) => {
    const reportEventType = categoryToEventType[report.category] || report.category?.toLowerCase();
    const matchesEventType = 
      filters.eventType === 'all' || 
      reportEventType === filters.eventType.toLowerCase();
    
    const trust = priorityToTrust[report.priority] || 0.5;
    const matchesTrust = trust >= filters.minTrust;
    
    const timeDiff = (Date.now() - new Date(report.timestamp).getTime()) / (1000 * 60 * 60);
    const matchesTime = timeDiff <= filters.timeWindow;
    
    const matchesVerified = !filters.verifiedOnly || report.status === 'VERIFIED';

    return matchesEventType && matchesTrust && matchesTime && matchesVerified;
  });
}
