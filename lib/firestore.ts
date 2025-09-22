import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs, 
  getDoc,
  query, 
  where, 
  orderBy, 
  limit,
  onSnapshot,
  Timestamp,
  serverTimestamp
} from "firebase/firestore";
import { db } from "./firebase";
import { Report } from "./types";

// Collection references
const REPORTS_COLLECTION = "reports";

// Transform Firestore document to Report interface
function transformFirestoreReport(doc: any): Report {
  const data = doc.data();
  
  return {
    id: doc.id,
    // Map your Firestore fields to expected interface
    eventType: data.reportType || data.eventType,
    text: data.description || data.text,
    lat: data.location?.lat || data.lat,
    lng: data.location?.lng || data.lng,
    timestamp: data.submissionTimestamp || data.createdAt?.toDate?.()?.toISOString() || data.timestamp,
    trust: data.trustScore || data.trust || 0,
    status: data.status === 'pending' ? 'new' : data.status,
    media: data.media?.map((m: any) => m.url || m) || [],
    exifData: data.media?.[0]?.exifData ? {
      location: data.location?.address || '',
      timestamp: data.media[0].exifData.dateTimeOriginal || '',
      device: `${data.media[0].exifData.make || ''} ${data.media[0].exifData.model || ''}`.trim(),
    } : undefined,
    validationReasons: data.reportMetadata ? [
      data.reportMetadata.authority_contact ? "Authority contact mentioned" : null,
      data.reportMetadata.casualty_mentions ? "Casualty mentions detected" : null,
      data.reportMetadata.estimated_severity !== 'unknown' ? `Severity: ${data.reportMetadata.estimated_severity}` : null,
    ].filter((reason): reason is string => reason !== null) : undefined,
    
    // Keep original fields
    reportId: data.reportId,
    reportTitle: data.reportTitle,
    reportType: data.reportType,
    description: data.description,
    location: data.location,
    mediaCount: data.mediaCount,
    priorityLevel: data.priorityLevel,
    trustLevel: data.trustLevel,
    trustScore: data.trustScore,
    reportMetadata: data.reportMetadata,
    requiresManualReview: data.requiresManualReview,
    submissionTimestamp: data.submissionTimestamp,
    userId: data.userId,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
  };
}

// Report service functions
export class ReportService {
  // Create a new report
  static async createReport(reportData: Omit<Report, "id">): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, REPORTS_COLLECTION), {
        ...reportData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      return docRef.id;
    } catch (error) {
      console.error("Error creating report:", error);
      throw error;
    }
  }

  // Get all reports
  static async getAllReports(): Promise<Report[]> {
    try {
      const q = query(
        collection(db, REPORTS_COLLECTION),
        orderBy("submissionTimestamp", "desc")
      );
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => transformFirestoreReport(doc)) as Report[];
    } catch (error) {
      console.error("Error getting reports:", error);
      throw error;
    }
  }

  // Get reports by status
  static async getReportsByStatus(status: Report["status"]): Promise<Report[]> {
    try {
      // Map status to your Firestore status values
      const firestoreStatus = status === 'new' ? 'pending' : status;
      
      const q = query(
        collection(db, REPORTS_COLLECTION),
        where("status", "==", firestoreStatus),
        orderBy("submissionTimestamp", "desc")
      );
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => transformFirestoreReport(doc)) as Report[];
    } catch (error) {
      console.error("Error getting reports by status:", error);
      throw error;
    }
  }

  // Update report status
  static async updateReportStatus(reportId: string, status: Report["status"]): Promise<void> {
    try {
      const reportRef = doc(db, REPORTS_COLLECTION, reportId);
      // Map status back to your Firestore status values
      const firestoreStatus = status === 'new' ? 'pending' : status;
      
      await updateDoc(reportRef, {
        status: firestoreStatus,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error("Error updating report status:", error);
      throw error;
    }
  }

  // Get single report
  static async getReport(reportId: string): Promise<Report | null> {
    try {
      const reportRef = doc(db, REPORTS_COLLECTION, reportId);
      const reportSnap = await getDoc(reportRef);
      
      if (reportSnap.exists()) {
        return transformFirestoreReport(reportSnap);
      }
      return null;
    } catch (error) {
      console.error("Error getting report:", error);
      throw error;
    }
  }

  // Real-time listener for reports
  static subscribeToReports(
    callback: (reports: Report[]) => void,
    filters?: {
      status?: Report["status"];
      eventType?: string;
      limitCount?: number;
    }
  ): () => void {
    let q = query(collection(db, REPORTS_COLLECTION), orderBy("submissionTimestamp", "desc"));
    
    if (filters?.status) {
      const firestoreStatus = filters.status === 'new' ? 'pending' : filters.status;
      q = query(q, where("status", "==", firestoreStatus));
    }
    
    if (filters?.eventType && filters.eventType !== "all") {
      q = query(q, where("reportType", "==", filters.eventType));
    }
    
    if (filters?.limitCount) {
      q = query(q, limit(filters.limitCount));
    }

    return onSnapshot(q, (querySnapshot) => {
      const reports = querySnapshot.docs.map(doc => transformFirestoreReport(doc)) as Report[];
      
      callback(reports);
    }, (error) => {
      console.error("Error in reports subscription:", error);
    });
  }

  // Real-time listener for new reports
  static subscribeToNewReports(callback: (report: Report) => void): () => void {
    const q = query(
      collection(db, REPORTS_COLLECTION),
      where("status", "==", "pending"),
      orderBy("submissionTimestamp", "desc"),
      limit(1)
    );

    return onSnapshot(q, (querySnapshot) => {
      querySnapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
          const report = transformFirestoreReport(change.doc);
          callback(report);
        }
      });
    }, (error) => {
      console.error("Error in new reports subscription:", error);
    });
  }
}
