import { NextApiRequest, NextApiResponse } from 'next';
import { CrimeReportService } from '@/lib/prisma-service';
import { adaptCrimeReportToReport, filterCrimeReports } from '@/lib/data-adapter';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { 
      status, 
      priority, 
      limit = '100',
      eventType,
      minTrust,
      timeWindow,
      verifiedOnly 
    } = req.query;

    // Get all reports from Prisma
    const crimeReports = await CrimeReportService.getAllReports({
      limit: parseInt(limit as string),
      status: status as any,
      priority: priority as any,
    });

    // Apply legacy filters if provided
    let filteredReports = crimeReports;
    if (eventType || minTrust || timeWindow || verifiedOnly) {
      filteredReports = filterCrimeReports(crimeReports, {
        eventType: eventType as string || 'all',
        minTrust: parseFloat(minTrust as string) || 0,
        timeWindow: parseInt(timeWindow as string) || 24,
        verifiedOnly: verifiedOnly === 'true',
      });
    }

    // Convert to legacy format for compatibility
    const adaptedReports = filteredReports.map(adaptCrimeReportToReport);

    return res.status(200).json(adaptedReports);

  } catch (error) {
    console.error('Error fetching reports:', error);
    return res.status(500).json({ error: 'Failed to fetch reports' });
  }
}
