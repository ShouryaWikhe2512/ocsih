import { ReportService } from "./firestore";
import { Report } from "./types";

// Sample reports data to seed Firestore
const sampleReports: Omit<Report, "id">[] = [
  {
    eventType: "high_wave",
    text: "Massive waves observed near Marina Beach. Water levels rising rapidly. Multiple reports from beachgoers.",
    lat: 13.0475,
    lng: 80.2825,
    trust: 0.85,
    status: "new",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    media: [
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400",
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400",
    ],
    location: {
      lat: 13.0475,
      lng: 80.2825,
      district: "Chennai",
      state: "Tamil Nadu",
      address: "Marina Beach, Chennai"
    },
    exifData: {
      device: "iPhone 13 Pro",
      location: "Marina Beach, Chennai",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    },
    validationReasons: [
      "Multiple independent reports",
      "Consistent location data",
      "Recent timestamp",
      "High-quality media evidence",
    ],
  },
  {
    eventType: "flood",
    text: "Severe flooding in low-lying areas near Adyar River. Water entering residential buildings.",
    lat: 13.0067,
    lng: 80.2206,
    trust: 0.92,
    status: "in_review",
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
    media: [
      "https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=400",
    ],
    location: {
      lat: 13.0067,
      lng: 80.2206,
      district: "Chennai",
      state: "Tamil Nadu",
      address: "Adyar, Chennai"
    },
    exifData: {
      device: "Samsung Galaxy S21",
      location: "Adyar, Chennai",
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    },
    validationReasons: [
      "Official weather service confirmation",
      "Multiple media sources",
      "Geographic consistency",
      "Emergency services response",
    ],
  },
  {
    eventType: "unusual_tide",
    text: "Unusual tidal patterns observed at Besant Nagar Beach. Tide levels significantly higher than predicted.",
    lat: 12.9998,
    lng: 80.2632,
    trust: 0.78,
    status: "verified",
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
    media: [
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400",
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400",
    ],
    exifData: {
      device: "iPhone 12",
      location: "Besant Nagar Beach, Chennai",
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    },
    validationReasons: [
      "Tidal gauge confirmation",
      "Consistent with weather patterns",
      "Multiple observer reports",
    ],
  },
  {
    eventType: "high_wave",
    text: "Large waves crashing against the breakwater at Chennai Port. Shipping operations affected.",
    lat: 13.0900,
    lng: 80.2900,
    trust: 0.88,
    status: "verified",
    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(), // 8 hours ago
    media: [
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400",
    ],
    exifData: {
      device: "Port Authority Camera",
      location: "Chennai Port",
      timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    },
    validationReasons: [
      "Official port authority report",
      "Automated monitoring system",
      "Impact on operations confirmed",
    ],
  },
  {
    eventType: "flood",
    text: "Flash flooding in Velachery area. Roads submerged, traffic disrupted.",
    lat: 12.9816,
    lng: 80.2200,
    trust: 0.75,
    status: "rejected",
    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), // 12 hours ago
    media: [
      "https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=400",
    ],
    exifData: {
      device: "Android Device",
      location: "Velachery, Chennai",
      timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    },
    validationReasons: [
      "Insufficient evidence",
      "Contradictory reports",
      "Location verification failed",
    ],
  },
];

export async function seedFirestoreData() {
  try {
    console.log("Starting to seed Firestore with sample data...");
    
    for (const reportData of sampleReports) {
      await ReportService.createReport(reportData);
      console.log(`Created report: ${reportData.eventType} at ${reportData.exifData?.location}`);
    }
    
    console.log("Successfully seeded Firestore with sample data!");
    return true;
  } catch (error) {
    console.error("Error seeding Firestore:", error);
    return false;
  }
}

// Function to clear all reports (for testing)
export async function clearAllReports() {
  try {
    const reports = await ReportService.getAllReports();
    // Note: You'd need to implement a delete function in ReportService
    console.log(`Found ${reports.length} reports to clear`);
    return true;
  } catch (error) {
    console.error("Error clearing reports:", error);
    return false;
  }
}
