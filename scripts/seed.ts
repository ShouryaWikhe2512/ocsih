import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedDatabase() {
  try {
    console.log('🌱 Seeding database with sample crime reports...');

    // Create sample users first
    const users = await Promise.all([
      prisma.user.upsert({
        where: { email: 'citizen1@example.com' },
        update: {},
        create: {
          email: 'citizen1@example.com',
          name: 'John Doe',
          role: 'USER',
        },
      }),
      prisma.user.upsert({
        where: { email: 'citizen2@example.com' },
        update: {},
        create: {
          email: 'citizen2@example.com',
          name: 'Jane Smith',
          role: 'USER',
        },
      }),
      prisma.user.upsert({
        where: { email: 'analyst@police.gov' },
        update: {},
        create: {
          email: 'analyst@police.gov',
          name: 'Inspector Rajesh Kumar',
          role: 'ADMIN',
        },
      }),
    ]);

    console.log('✅ Created users:', users.length);

    // Create sample crime reports
    const sampleReports = [
      {
        userId: users[0].id,
        location: 'Mumbai Central Station, Mumbai',
        description: 'Suspicious activity near the ticket counter. Someone was trying to pickpocket passengers.',
        mediaUrls: JSON.stringify(['https://example.com/image1.jpg']),
        mediaType: 'PHOTO' as const,
        status: 'PENDING' as const,
        priority: 'HIGH' as const,
        category: 'theft',
        latitude: 19.0176,
        longitude: 72.8562,
        walletAddress: 'ABC123...',
      },
      {
        userId: users[1].id,
        location: 'Delhi Metro Station, New Delhi',
        description: 'Fight broke out between two passengers over seat. Security was called.',
        mediaUrls: JSON.stringify(['https://example.com/video1.mp4']),
        mediaType: 'VIDEO' as const,
        status: 'PENDING' as const,
        priority: 'MEDIUM' as const,
        category: 'assault',
        latitude: 28.6139,
        longitude: 77.2090,
        walletAddress: 'DEF456...',
      },
      {
        userId: users[0].id,
        location: 'Bangalore IT Park, Bangalore',
        description: 'Car break-in reported in parking lot. Window was smashed.',
        mediaUrls: JSON.stringify(['https://example.com/image2.jpg', 'https://example.com/image3.jpg']),
        mediaType: 'PHOTO' as const,
        status: 'VERIFIED' as const,
        priority: 'CRITICAL' as const,
        category: 'burglary',
        latitude: 12.9716,
        longitude: 77.5946,
        walletAddress: 'GHI789...',
      },
      {
        userId: users[1].id,
        location: 'Chennai Beach, Chennai',
        description: 'Online fraud case - someone impersonating bank officials asking for OTP.',
        mediaUrls: JSON.stringify(['https://example.com/screenshot1.png']),
        mediaType: 'PHOTO' as const,
        status: 'PENDING' as const,
        priority: 'HIGH' as const,
        category: 'fraud',
        latitude: 13.0827,
        longitude: 80.2707,
        walletAddress: 'JKL012...',
      },
      {
        userId: users[0].id,
        location: 'Kolkata Metro, Kolkata',
        description: 'Graffiti and vandalism on metro walls. Property damage reported.',
        mediaUrls: JSON.stringify(['https://example.com/image4.jpg']),
        mediaType: 'PHOTO' as const,
        status: 'REJECTED' as const,
        priority: 'LOW' as const,
        category: 'vandalism',
        latitude: 22.5726,
        longitude: 88.3639,
        walletAddress: 'MNO345...',
      },
    ];

    const createdReports = await Promise.all(
      sampleReports.map(report => prisma.crimeReport.create({ data: report }))
    );

    console.log('✅ Created crime reports:', createdReports.length);

    // Create AI analysis for some reports
    const aiAnalyses = [
      {
        crimeReportId: createdReports[0].id,
        confidence: 85,
        crimeType: 'Pickpocketing',
        severity: 'HIGH' as const,
        description: 'High confidence pickpocketing activity detected based on behavior patterns.',
        riskFactors: JSON.stringify(['Crowded area', 'High foot traffic', 'Multiple victims']),
        recommendations: JSON.stringify(['Increase security presence', 'Install CCTV', 'Public awareness campaign']),
        people: JSON.stringify(['Suspect: Male, 25-30 years, wearing blue shirt']),
        vehicles: JSON.stringify([]),
        weapons: JSON.stringify([]),
        locations: JSON.stringify(['Ticket counter area', 'Platform 1']),
        objects: JSON.stringify(['Wallet', 'Mobile phone']),
      },
      {
        crimeReportId: createdReports[1].id,
        confidence: 70,
        crimeType: 'Public Disturbance',
        severity: 'MEDIUM' as const,
        description: 'Physical altercation between passengers over seating dispute.',
        riskFactors: JSON.stringify(['Peak hours', 'Limited seating', 'Tension between passengers']),
        recommendations: JSON.stringify(['Mediation training for staff', 'Clear seating policies']),
        people: JSON.stringify(['Two male passengers, ages 35-40']),
        vehicles: JSON.stringify([]),
        weapons: JSON.stringify([]),
        locations: JSON.stringify(['Metro coach', 'Seating area']),
        objects: JSON.stringify(['Seat', 'Personal belongings']),
      },
    ];

    await Promise.all(
      aiAnalyses.map(analysis => prisma.aIAnalysis.create({ data: analysis }))
    );

    console.log('✅ Created AI analyses:', aiAnalyses.length);

    // Create human verification for verified report
    await prisma.humanVerification.create({
      data: {
        crimeReportId: createdReports[2].id,
        verifiedBy: users[2].id,
        isVerified: true,
        notes: 'Verified by Inspector Rajesh Kumar. Evidence is clear and credible.',
        confidence: 95,
        requiresFollowUp: true,
      },
    });

    console.log('✅ Created human verification');

    console.log('🎉 Database seeding completed successfully!');
    console.log(`📊 Created ${users.length} users, ${createdReports.length} crime reports, ${aiAnalyses.length} AI analyses, and 1 human verification`);

  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedDatabase();
