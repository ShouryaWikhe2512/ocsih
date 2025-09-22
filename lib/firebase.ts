// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getFunctions } from "firebase/functions";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDGOd3sl0rXwaWOY2_gVs4M-_HYEuow980",
  authDomain: "sentinel-ed93e.firebaseapp.com",
  projectId: "sentinel-ed93e",
  storageBucket: "sentinel-ed93e.firebasestorage.app",
  messagingSenderId: "79511292062",
  appId: "1:79511292062:web:1cc08429c96c1de695538f",
  measurementId: "G-B0HRNHGEHR"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize Firebase services
export const db = getFirestore(app);
export const storage = getStorage(app);
export const functions = getFunctions(app);

// Initialize Analytics only on the client side
let analytics: any = null;

// Function to get analytics instance
export const getAnalyticsInstance = async () => {
  if (typeof window === 'undefined') return null;
  
  if (analytics) return analytics;
  
  try {
    const supported = await isSupported();
    if (supported) {
      analytics = getAnalytics(app);
      return analytics;
    }
  } catch (error) {
    console.warn("Analytics initialization failed:", error);
  }
  
  return null;
};

export { analytics };

export default app;
