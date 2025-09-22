import { NextApiRequest, NextApiResponse } from 'next';
import { ReportService } from '@/lib/firestore';

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

    // Update report status to rejected
    await ReportService.updateReportStatus(reportId, 'rejected');

    return res.status(200).json({
      success: true,
      message: 'Report rejected'
    });

  } catch (error) {
    console.error('Error rejecting report:', error);
    return res.status(500).json({ error: 'Failed to reject report' });
  }
}
