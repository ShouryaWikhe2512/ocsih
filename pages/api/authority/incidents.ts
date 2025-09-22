import { NextApiRequest, NextApiResponse } from 'next';
import { IncidentService } from '@/lib/incidents-service';
import { incidents as mockIncidents } from '@/lib/authority-data';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get incidents from Firestore
    const firestoreIncidents = await IncidentService.getAllIncidents();
    
    // Combine with mock incidents (for initial data)
    const allIncidents = [...firestoreIncidents, ...mockIncidents];

    const { status, district, start, end } = req.query;

    let filteredIncidents = allIncidents;

    if (status && status !== 'all') {
      filteredIncidents = filteredIncidents.filter(i => i.status === status);
    }

    if (district && district !== 'all') {
      filteredIncidents = filteredIncidents.filter(i => i.location.district === district);
    }

    if (start && end) {
      const startDate = new Date(start as string);
      const endDate = new Date(end as string);
      filteredIncidents = filteredIncidents.filter(i => {
        const incidentDate = new Date(i.timestamp);
        return incidentDate >= startDate && incidentDate <= endDate;
      });
    }

    return res.status(200).json(filteredIncidents);
  } catch (error) {
    console.error('Error fetching incidents:', error);
    // Fallback to mock data if Firestore fails
    return res.status(200).json(mockIncidents);
  }
}