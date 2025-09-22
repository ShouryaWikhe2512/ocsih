import { analytics } from "./firebase";
import { logEvent, setUserId, setUserProperties } from "firebase/analytics";

export class AnalyticsService {
  // Helper function to safely call analytics functions
  private static safeAnalyticsCall(callback: (analytics: any) => void) {
    if (typeof window !== 'undefined' && analytics) {
      try {
        callback(analytics);
      } catch (error) {
        console.warn("Analytics call failed:", error);
      }
    }
  }

  // Track user login
  static trackLogin(method: string = "clerk") {
    this.safeAnalyticsCall((analytics) => {
      logEvent(analytics, "login", { method });
    });
  }

  // Track user logout
  static trackLogout() {
    this.safeAnalyticsCall((analytics) => {
      logEvent(analytics, "logout");
    });
  }

  // Track report verification
  static trackReportVerification(reportId: string, action: "verify" | "reject") {
    this.safeAnalyticsCall((analytics) => {
      logEvent(analytics, "report_verification", {
        report_id: reportId,
        action,
      });
    });
  }

  // Track report view
  static trackReportView(reportId: string, reportType: string) {
    this.safeAnalyticsCall((analytics) => {
      logEvent(analytics, "report_view", {
        report_id: reportId,
        report_type: reportType,
      });
    });
  }

  // Track filter usage
  static trackFilterUsage(filterType: string, filterValue: string) {
    this.safeAnalyticsCall((analytics) => {
      logEvent(analytics, "filter_used", {
        filter_type: filterType,
        filter_value: filterValue,
      });
    });
  }

  // Track map interaction
  static trackMapInteraction(action: string, details?: any) {
    this.safeAnalyticsCall((analytics) => {
      logEvent(analytics, "map_interaction", {
        action,
        ...details,
      });
    });
  }

  // Track dashboard view
  static trackDashboardView(dashboardType: "analyst" | "authority") {
    this.safeAnalyticsCall((analytics) => {
      logEvent(analytics, "dashboard_view", {
        dashboard_type: dashboardType,
      });
    });
  }

  // Track media interaction
  static trackMediaInteraction(reportId: string, action: "view" | "download") {
    this.safeAnalyticsCall((analytics) => {
      logEvent(analytics, "media_interaction", {
        report_id: reportId,
        action,
      });
    });
  }

  // Track search
  static trackSearch(searchTerm: string, resultsCount: number) {
    this.safeAnalyticsCall((analytics) => {
      logEvent(analytics, "search", {
        search_term: searchTerm,
        results_count: resultsCount,
      });
    });
  }

  // Set user properties
  static setUserProperties(userId: string, properties: Record<string, any>) {
    this.safeAnalyticsCall((analytics) => {
      setUserId(analytics, userId);
      setUserProperties(analytics, properties);
    });
  }

  // Track custom event
  static trackCustomEvent(eventName: string, parameters?: Record<string, any>) {
    this.safeAnalyticsCall((analytics) => {
      logEvent(analytics, eventName, parameters);
    });
  }
}
