import { PrismaClient } from '@prisma/client';

// Global Prisma client instance
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// Crime Report Service using Prisma
export class CrimeReportService {
  // Get all crime reports with relations
  static async getAllReports(options?: {
    limit?: number;
    status?: 'PENDING' | 'VERIFIED' | 'REJECTED';
    priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  }) {
    const { limit = 100, status, priority } = options || {};
    
    return await prisma.crimeReport.findMany({
      where: {
        ...(status && { status }),
        ...(priority && { priority }),
      },
      include: {
        user: true,
        aiAnalysis: true,
        humanVerification: {
          include: {
            admin: true,
          },
        },
        solanaReward: true,
        escalation: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
    });
  }

  // Get a single crime report by ID
  static async getReportById(id: string) {
    return await prisma.crimeReport.findUnique({
      where: { id },
      include: {
        user: true,
        aiAnalysis: true,
        humanVerification: {
          include: {
            admin: true,
          },
        },
        solanaReward: true,
        escalation: true,
      },
    });
  }

  // Update report status
  static async updateReportStatus(id: string, status: 'PENDING' | 'VERIFIED' | 'REJECTED') {
    return await prisma.crimeReport.update({
      where: { id },
      data: { status },
    });
  }

  // Create human verification
  static async createHumanVerification(data: {
    crimeReportId: string;
    verifiedBy: string;
    isVerified: boolean;
    notes: string;
    confidence: number;
    requiresFollowUp?: boolean;
  }) {
    return await prisma.humanVerification.upsert({
      where: { crimeReportId: data.crimeReportId },
      update: {
        verifiedBy: data.verifiedBy,
        isVerified: data.isVerified,
        notes: data.notes,
        confidence: data.confidence,
        requiresFollowUp: data.requiresFollowUp,
      },
      create: data,
    });
  }

  // Escalate a report to a specific department
  static async escalateReport(reportId: string, escalatedTo: string, escalatedBy: string, escalationNotes?: string) {
    // First, update the report status to verified
    await prisma.crimeReport.update({
      where: { id: reportId },
      data: {
        status: 'VERIFIED',
      },
    });

    // Then create an escalation record
    return await prisma.escalation.create({
      data: {
        crimeReportId: reportId,
        escalatedTo,
        escalatedBy,
        escalationNotes,
        status: 'PENDING',
      },
    });
  }

  // Get all escalations
  static async getAllEscalations() {
    return await prisma.escalation.findMany({
      include: {
        crimeReport: {
          include: {
            user: true,
            aiAnalysis: true,
            humanVerification: true,
          },
        },
      },
      orderBy: {
        escalatedAt: 'desc',
      },
    });
  }

  // Get escalations by status
  static async getEscalationsByStatus(status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'REJECTED') {
    return await prisma.escalation.findMany({
      where: { status },
      include: {
        crimeReport: {
          include: {
            user: true,
            aiAnalysis: true,
            humanVerification: true,
          },
        },
      },
      orderBy: {
        escalatedAt: 'desc',
      },
    });
  }

  // Get reports by status for dashboard
  static async getReportsByStatus() {
    const [pending, verified, rejected] = await Promise.all([
      prisma.crimeReport.count({ where: { status: 'PENDING' } }),
      prisma.crimeReport.count({ where: { status: 'VERIFIED' } }),
      prisma.crimeReport.count({ where: { status: 'REJECTED' } }),
    ]);

    return {
      pending,
      verified,
      rejected,
      total: pending + verified + rejected,
    };
  }

  // Get verified reports for authority dashboard
  static async getVerifiedReports() {
    return await prisma.crimeReport.findMany({
      where: { status: 'VERIFIED' },
      include: {
        aiAnalysis: true,
        humanVerification: true,
        escalation: true,
        user: true,
      },
      orderBy: { timestamp: 'desc' },
    });
  }

  // Get reports with AI analysis
  static async getReportsWithAIAnalysis() {
    return await prisma.crimeReport.findMany({
      where: {
        aiAnalysis: {
          isNot: null,
        },
      },
      include: {
        aiAnalysis: true,
        user: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  // Get reports by priority
  static async getReportsByPriority() {
    const [critical, high, medium, low] = await Promise.all([
      prisma.crimeReport.count({ where: { priority: 'CRITICAL' } }),
      prisma.crimeReport.count({ where: { priority: 'HIGH' } }),
      prisma.crimeReport.count({ where: { priority: 'MEDIUM' } }),
      prisma.crimeReport.count({ where: { priority: 'LOW' } }),
    ]);

    return { critical, high, medium, low };
  }

  // Get recent reports (last 24 hours)
  static async getRecentReports(hours: number = 24) {
    const since = new Date(Date.now() - hours * 60 * 60 * 1000);
    
    return await prisma.crimeReport.findMany({
      where: {
        createdAt: {
          gte: since,
        },
      },
      include: {
        user: true,
        aiAnalysis: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  // Search reports by location or description
  static async searchReports(query: string) {
    return await prisma.crimeReport.findMany({
      where: {
        OR: [
          { location: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
          { category: { contains: query, mode: 'insensitive' } },
        ],
      },
      include: {
        user: true,
        aiAnalysis: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  // Get reports by coordinates (for map view)
  static async getReportsByCoordinates(
    bounds: {
      north: number;
      south: number;
      east: number;
      west: number;
    }
  ) {
    return await prisma.crimeReport.findMany({
      where: {
        latitude: {
          gte: bounds.south,
          lte: bounds.north,
        },
        longitude: {
          gte: bounds.west,
          lte: bounds.east,
        },
      },
      include: {
        user: true,
        aiAnalysis: true,
      },
    });
  }
}
