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
    console.log('🔴 Rejecting report:', reportId);
    
    // Get the report from Prisma database
    const report = await CrimeReportService.getReportById(reportId);
    console.log('🔴 Found report:', report ? 'Yes' : 'No');
    
    if (!report) {
      return res.status(404).json({ error: 'Report not found' });
    }

    // Update report status to rejected
    console.log('🔴 Updating report status to REJECTED');
    await CrimeReportService.updateReportStatus(reportId, 'REJECTED');

    console.log('🔴 Report rejected successfully (skipping human verification for now)');
    return res.status(200).json({
      success: true,
      message: 'Report rejected successfully',
    });

  } catch (error) {
    console.error('🔴 Error rejecting report:', error);
    return res.status(500).json({ error: 'Failed to reject report' });
  }
}