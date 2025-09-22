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
import { Incident } from "./authority-types";

// Collection references
const INCIDENTS_COLLECTION = "incidents";

// Transform Firestore document to Incident interface
function transformFirestoreIncident(doc: any): Incident {
  const data = doc.data();
  
  return {
    id: doc.id,
    title: data.title,
    eventType: data.eventType,
    location: data.location,
    severity: data.severity,
    confidence: data.confidence,
    status: data.status,
    timestamp: data.timestamp,
    description: data.description,
    media: data.media || [],
    analystNotes: data.analystNotes,
    validationEvidence: data.validationEvidence,
    affectedPopulation: data.affectedPopulation,
    resources: data.resources || [],
    contacts: data.contacts || [],
  };
}

// Incident service functions
export class IncidentService {
  // Create a new incident
  static async createIncident(incidentData: Omit<Incident, "id">): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, INCIDENTS_COLLECTION), {
        ...incidentData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      return docRef.id;
    } catch (error) {
      console.error("Error creating incident:", error);
      throw error;
    }
  }

  // Get all incidents
  static async getAllIncidents(): Promise<Incident[]> {
    try {
      const q = query(
        collection(db, INCIDENTS_COLLECTION),
        orderBy("timestamp", "desc")
      );
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => transformFirestoreIncident(doc)) as Incident[];
    } catch (error) {
      console.error("Error getting incidents:", error);
      throw error;
    }
  }

  // Get incidents by status
  static async getIncidentsByStatus(status: Incident["status"]): Promise<Incident[]> {
    try {
      const q = query(
        collection(db, INCIDENTS_COLLECTION),
        where("status", "==", status),
        orderBy("timestamp", "desc")
      );
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => transformFirestoreIncident(doc)) as Incident[];
    } catch (error) {
      console.error("Error getting incidents by status:", error);
      throw error;
    }
  }

  // Update incident status
  static async updateIncidentStatus(incidentId: string, status: Incident["status"]): Promise<void> {
    try {
      const incidentRef = doc(db, INCIDENTS_COLLECTION, incidentId);
      
      await updateDoc(incidentRef, {
        status: status,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error("Error updating incident status:", error);
      throw error;
    }
  }

  // Get single incident
  static async getIncident(incidentId: string): Promise<Incident | null> {
    try {
      const incidentRef = doc(db, INCIDENTS_COLLECTION, incidentId);
      const incidentSnap = await getDoc(incidentRef);
      
      if (incidentSnap.exists()) {
        return transformFirestoreIncident(incidentSnap);
      }
      return null;
    } catch (error) {
      console.error("Error getting incident:", error);
      throw error;
    }
  }

  // Real-time listener for incidents
  static subscribeToIncidents(
    callback: (incidents: Incident[]) => void,
    filters?: {
      status?: Incident["status"];
      eventType?: string;
      limitCount?: number;
    }
  ): () => void {
    let q = query(collection(db, INCIDENTS_COLLECTION), orderBy("timestamp", "desc"));
    
    if (filters?.status) {
      q = query(q, where("status", "==", filters.status));
    }
    
    if (filters?.eventType && filters.eventType !== "all") {
      q = query(q, where("eventType", "==", filters.eventType));
    }
    
    if (filters?.limitCount) {
      q = query(q, limit(filters.limitCount));
    }

    return onSnapshot(q, (querySnapshot) => {
      const incidents = querySnapshot.docs.map(doc => transformFirestoreIncident(doc)) as Incident[];
      
      callback(incidents);
    }, (error) => {
      console.error("Error in incidents subscription:", error);
    });
  }

  // Real-time listener for new incidents
  static subscribeToNewIncidents(callback: (incident: Incident) => void): () => void {
    const q = query(
      collection(db, INCIDENTS_COLLECTION),
      orderBy("timestamp", "desc"),
      limit(1)
    );

    return onSnapshot(q, (querySnapshot) => {
      querySnapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
          const incident = transformFirestoreIncident(change.doc);
          callback(incident);
        }
      });
    }, (error) => {
      console.error("Error in new incidents subscription:", error);
    });
  }
}
