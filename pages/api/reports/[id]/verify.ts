import { NextApiRequest, NextApiResponse } from 'next';
import { ReportService } from '@/lib/firestore';
import { IncidentService } from '@/lib/incidents-service';
import { Incident } from '@/lib/authority-types';
import { broadcastNotification } from '../../sse-notifications';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const reportId = req.query.id as string;
    
    // Get the report from Firestore
    const report = await ReportService.getReport(reportId);
    
    if (!report) {
      return res.status(404).json({ error: 'Report not found' });
    }

    // Update report status to verified
    await ReportService.updateReportStatus(reportId, 'verified');

    // Convert verified report to incident
    const incident: Incident = {
      id: `INC-${Date.now()}`,
      title: `${report.eventType.replace('_', ' ').toUpperCase()} - ${report.location?.address || 'Unknown Location'}`,
      eventType: report.eventType as any,
      location: {
        lat: report.lat,
        lng: report.lng,
        district: report.location?.district || 'Unknown',
        state: report.location?.state || 'Unknown',
        address: report.location?.address || `${report.lat}, ${report.lng}`
      },
      severity: determineSeverity(report),
      confidence: report.trust,
      status: 'open',
      timestamp: report.timestamp,
      description: report.text || report.description || 'No description provided',
      media: report.media || [],
      analystNotes: `Verified by analyst. Trust score: ${report.trust}. ${report.validationReasons?.join(', ') || 'No validation reasons provided.'}`,
      validationEvidence: {
        exifValid: !!report.exifData,
        locationConfirmed: true,
        timelineConsistent: true,
        crossReferenced: report.validationReasons?.length > 0
      },
      affectedPopulation: estimateAffectedPopulation(report),
      resources: [],
      contacts: []
    };

    // Save incident to Firestore
    const incidentId = await IncidentService.createIncident(incident);
    const savedIncident = { ...incident, id: incidentId };

    // Send SSE notification to authority dashboard
    broadcastNotification({
      type: 'new_incident',
      data: {
        incident: savedIncident,
        message: `New verified incident: ${savedIncident.title}`
      },
      timestamp: new Date().toISOString()
    });

    return res.status(200).json({
      success: true,
      incident: savedIncident,
      message: 'Report verified and incident created'
    });

  } catch (error) {
    console.error('Error verifying report:', error);
    return res.status(500).json({ error: 'Failed to verify report' });
  }
}

function determineSeverity(report: any): 'low' | 'moderate' | 'high' | 'extreme' {
  // Simple severity determination based on trust score and event type
  if (report.trust >= 0.9) {
    return report.eventType === 'cyclone' ? 'extreme' : 'high';
  } else if (report.trust >= 0.7) {
    return 'moderate';
  } else {
    return 'low';
  }
}

function estimateAffectedPopulation(report: any): number {
  // Simple estimation based on event type
  const basePopulations = {
    'high_wave': 1000,
    'unusual_tide': 500,
    'flood': 2000,
    'cyclone': 5000
  };
  
  return basePopulations[report.eventType as keyof typeof basePopulations] || 100;
}
