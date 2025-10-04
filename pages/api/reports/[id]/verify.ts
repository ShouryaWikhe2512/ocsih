import { NextApiRequest, NextApiResponse } from 'next';
import { CrimeReportService } from '@/lib/prisma-service';
import { adaptCrimeReportToReport } from '@/lib/data-adapter';
import { prisma } from '@/lib/prisma-service';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const reportId = req.query.id as string;
    
    // Get the report from Prisma database
    const report = await CrimeReportService.getReportById(reportId);
    
    if (!report) {
      return res.status(404).json({ error: 'Report not found' });
    }

    // Update report status to verified
    await CrimeReportService.updateReportStatus(reportId, 'VERIFIED');

    return res.status(200).json({
      success: true,
      message: 'Report verified successfully',
    });

  } catch (error) {
    console.error('Error verifying report:', error);
    return res.status(500).json({ error: 'Failed to verify report' });
  }
}