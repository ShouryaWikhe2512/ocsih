import { NextApiRequest, NextApiResponse } from 'next';
import { CrimeReportService } from '@/lib/prisma-service';
import { Incident } from '@/lib/authority-types';

// Convert CrimeReport to Incident format for authority dashboard
function convertCrimeReportToIncident(crimeReport: any): Incident {
  // Parse media URLs from JSON string
  let media: string[] = [];
  try {
    media = JSON.parse(crimeReport.mediaUrls || '[]');
  } catch {
    media = [];
  }

  // Map CrimeCategory to eventType (keep original category names)
  const categoryToEventType: Record<string, string> = {
    'SEXUAL_VIOLENCE': 'sexual_violence',
    'DOMESTIC_VIOLENCE': 'domestic_violence', 
    'STREET_CRIMES': 'street_crimes',
    'MOB_VIOLENCE_LYNCHING': 'mob_violence_lynching',
    'ROAD_RAGE_INCIDENTS': 'road_rage_incidents',
    'CYBERCRIMES': 'cybercrimes',
    'DRUG': 'drug',
  };

  // Map Priority to severity
  const priorityToSeverity: Record<string, string> = {
    'LOW': 'low',
    'MEDIUM': 'moderate',
    'HIGH': 'high',
    'CRITICAL': 'critical',
  };

  // Map Priority to confidence (approximation)
  const priorityToConfidence: Record<string, number> = {
    'LOW': 0.3,
    'MEDIUM': 0.6,
    'HIGH': 0.8,
    'CRITICAL': 0.9,
  };

  // Determine status based on escalation
  let status: 'open' | 'acknowledged' | 'dispatched' | 'published' | 'closed' = 'open';
  if (crimeReport.escalation) {
    switch (crimeReport.escalation.status) {
      case 'PENDING':
        status = 'open';
        break;
      case 'IN_PROGRESS':
        status = 'acknowledged';
        break;
      case 'COMPLETED':
        status = 'dispatched';
        break;
      case 'REJECTED':
        status = 'closed';
        break;
    }
  }

  return {
    id: generateIncidentId(crimeReport.id),
    title: `${crimeReport.category?.replace('_', ' ')} Report`,
    eventType: categoryToEventType[crimeReport.category] || 'theft',
    location: {
      lat: crimeReport.latitude || 0,
      lng: crimeReport.longitude || 0,
      district: extractDistrictFromLocation(crimeReport.location),
      state: 'Tamil Nadu', // Default state
      address: crimeReport.location,
    },
    severity: priorityToSeverity[crimeReport.priority] || 'moderate',
    confidence: priorityToConfidence[crimeReport.priority] || 0.6,
    status,
    timestamp: crimeReport.timestamp.toISOString(),
    description: crimeReport.description,
    media,
    analystNotes: crimeReport.humanVerification?.notes || 'Verified by analyst',
    validationEvidence: {
      exifValid: true,
      locationConfirmed: !!(crimeReport.latitude && crimeReport.longitude),
      timelineConsistent: true,
      crossReferenced: !!crimeReport.humanVerification,
    },
    affectedPopulation: 1, // Default
    resources: [],
    contacts: crimeReport.escalation ? [{
      name: crimeReport.escalation.escalatedTo,
      role: 'Department',
      phone: 'N/A',
      email: 'N/A',
      department: crimeReport.escalation.escalatedTo,
    }] : [],
  };
}

// Helper function to extract district from location string
function extractDistrictFromLocation(location: string): string {
  // Simple extraction - you might want to improve this
  const parts = location.split(',');
  return parts[parts.length - 1]?.trim() || 'Unknown District';
}

// Helper function to generate formatted incident ID
function generateIncidentId(originalId: string): string {
  // Extract first 8 characters and format like CMGBF2G7U-0004-FIB-411039
  const prefix = originalId.substring(0, 8).toUpperCase();
  const randomNum = Math.floor(Math.random() * 9999).toString().padStart(4, '0');
  const suffix = 'FIB-411039'; // Fixed suffix for demo
  return `${prefix}-${randomNum}-${suffix}`;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('🏛️ Authority Dashboard: Fetching verified reports from NeonDB');
    
    // Get all verified reports from Prisma database
    const verifiedReports = await CrimeReportService.getVerifiedReports();
    
    console.log(`🏛️ Found ${verifiedReports.length} verified reports`);
    
    // Convert CrimeReports to Incidents
    const incidents: Incident[] = verifiedReports.map(convertCrimeReportToIncident);
    
    // Apply filters
    const { eventType, timeFilter } = req.query;
    
    let filteredIncidents = incidents;
    
    // Event type filter
    if (eventType && eventType !== 'all') {
      filteredIncidents = filteredIncidents.filter(i => i.eventType === eventType);
    }
    
    // Time filter
    if (timeFilter && timeFilter !== 'all') {
      const now = new Date();
      filteredIncidents = filteredIncidents.filter(i => {
        const incidentTime = new Date(i.timestamp);
        const timeDiff = now.getTime() - incidentTime.getTime();
        
        switch (timeFilter) {
          case '24h':
            return timeDiff <= 24 * 60 * 60 * 1000;
          case '1w':
            return timeDiff <= 7 * 24 * 60 * 60 * 1000;
          case '1m':
            return timeDiff <= 30 * 24 * 60 * 60 * 1000;
          case '6m':
            return timeDiff <= 6 * 30 * 24 * 60 * 60 * 1000;
          default:
            return true;
        }
      });
    }
    
    console.log(`🏛️ Returning ${filteredIncidents.length} filtered incidents`);
    
    return res.status(200).json(filteredIncidents);
  } catch (error) {
    console.error('🏛️ Error fetching incidents for authority dashboard:', error);
    return res.status(500).json({ error: 'Failed to fetch incidents' });
  }
}