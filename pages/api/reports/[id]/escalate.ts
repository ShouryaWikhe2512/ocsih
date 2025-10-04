import { NextApiRequest, NextApiResponse } from 'next';
import { CrimeReportService } from '@/lib/prisma-service';
import { adaptCrimeReportToReport } from '@/lib/data-adapter';
import { ESCALATION_MAPPING } from '@/lib/types';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const reportId = req.query.id as string;
    const { escalationNotes } = req.body;
    
    console.log('🚨 Escalating report:', reportId);
    
    // Get the report from Prisma database
    const report = await CrimeReportService.getReportById(reportId);
    console.log('🚨 Found report:', report ? 'Yes' : 'No');
    
    if (!report) {
      return res.status(404).json({ error: 'Report not found' });
    }

    // Get the department to escalate to based on crime category
    const escalatedTo = ESCALATION_MAPPING[report.category];
    console.log('🚨 Escalating to department:', escalatedTo);
    
    if (!escalatedTo) {
      return res.status(400).json({ error: 'No escalation department found for this crime category' });
    }

    // Escalate the report
    const escalation = await CrimeReportService.escalateReport(
      reportId, 
      escalatedTo, 
      'analyst', // You can get this from auth context
      escalationNotes
    );

    // Get updated report with relations
    console.log('🚨 Getting updated report');
    const updatedReport = await CrimeReportService.getReportById(reportId);
    const adaptedReport = adaptCrimeReportToReport(updatedReport!);

    console.log('🚨 Report escalated successfully');
    return res.status(200).json({
      success: true,
      message: `Report escalated to ${escalatedTo}`,
      report: adaptedReport,
      escalatedTo,
    });

  } catch (error) {
    console.error('🚨 Error escalating report:', error);
    return res.status(500).json({ error: 'Failed to escalate report' });
  }
}
