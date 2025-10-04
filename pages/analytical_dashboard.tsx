"use client";

import { useState, useEffect, useCallback } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/router";
import { Report, Filters, KPIData } from "@/lib/types";
import { ReportService } from "@/lib/prisma-service";
import { AnalyticsService } from "@/lib/analytics";
import MapPanel from "@/components/MapPanel";
import FilterPanel from "@/components/FilterPanel";
import QueueList from "@/components/QueueList";
import DetailDrawer from "@/components/DetailDrawer";
import KpiCards from "@/components/KpiCards";
import MediaModal from "@/components/MediaModal";
import VerifiedReports from "@/components/VerifiedReports";

export default function AnalystDashboard() {
  const { isLoaded, isSignedIn, user } = useUser();
  const router = useRouter();

  const [reports, setReports] = useState<Report[]>([]);
  const [filteredReports, setFilteredReports] = useState<Report[]>([]);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [selectedMedia, setSelectedMedia] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"queue" | "verified">("queue");
  const [filters, setFilters] = useState<Filters>({
    eventType: "all",
    minTrust: 0,
    timeWindow: 24,
    verifiedOnly: false,
  });

  // Auth protection (no role enforcement)
  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.replace("/sign-in");
    }
  }, [isLoaded, isSignedIn, router]);

  // Track dashboard view
  useEffect(() => {
    if (isLoaded && isSignedIn) {
      AnalyticsService.trackDashboardView("analyst");
      if (user) {
        AnalyticsService.setUserProperties(user.id, {
          role: user.publicMetadata?.role || "analyst",
        });
      }
    }
  }, [isLoaded, isSignedIn, user]);

  // Load reports from Prisma database
  useEffect(() => {
    if (!isSignedIn) return;

    const loadReports = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/reports");
        if (response.ok) {
          const reportsData = await response.json();
          setReports(reportsData);
        } else {
          console.error("Failed to fetch reports");
        }
      } catch (error) {
        console.error("Error loading reports:", error);
      } finally {
        setLoading(false);
      }
    };

    loadReports();

    // Set up polling for real-time updates (every 30 seconds)
    const interval = setInterval(loadReports, 30000);

    return () => clearInterval(interval);
  }, [isSignedIn]);

  // Filter reports based on current filters
  useEffect(() => {
    const filtered = reports.filter((report) => {
      const matchesEventType =
        filters.eventType === "all" || report.eventType === filters.eventType;
      const matchesTrust = report.trust >= filters.minTrust;
      const matchesTime =
        (Date.now() - new Date(report.timestamp).getTime()) /
          (1000 * 60 * 60) <=
        filters.timeWindow;
      const matchesVerified =
        !filters.verifiedOnly || report.status === "verified";

      return matchesEventType && matchesTrust && matchesTime && matchesVerified;
    });
    setFilteredReports(filtered);
  }, [reports, filters]);

  const kpiData: KPIData = {
    totalReports: reports.length,
    verifiedReports: reports.filter((r) => r.status === "verified").length,
    pendingReports: reports.filter(
      (r) => r.status === "new" || r.status === "pending"
    ).length,
    rejectedReports: reports.filter((r) => r.status === "rejected").length,
  };

  const handleReportAction = async (
    reportId: string,
    action: "verify" | "reject"
  ) => {
    try {
      const newStatus = action === "verify" ? "verified" : "rejected";

      // Call the API endpoint for verification/rejection
      const response = await fetch(`/api/reports/${reportId}/${action}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to ${action} report`);
      }

      const result = await response.json();

      // Track analytics
      AnalyticsService.trackReportVerification(reportId, action);

      // Update local state
      setReports((prev) =>
        prev.map((report) =>
          report.id === reportId
            ? { ...report, status: newStatus as Report["status"] }
            : report
        )
      );

      // Update selected report if it's the same one
      if (selectedReport?.id === reportId) {
        setSelectedReport((prev) =>
          prev ? { ...prev, status: newStatus as Report["status"] } : null
        );
      }

      // Show success message
      if (action === "verify") {
        console.log("Report verified successfully:", result.report);
      }
    } catch (error) {
      console.error(`Error ${action}ing report:`, error);
    }
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        selectedReport &&
        (selectedReport.status === "new" || selectedReport.status === "pending")
      ) {
        if (e.key === "v" || e.key === "V") {
          handleReportAction(selectedReport.id, "verify");
        } else if (e.key === "r" || e.key === "R") {
          handleReportAction(selectedReport.id, "reject");
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedReport]);

  // Conditional rendering after all hooks
  if (!isLoaded || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isSignedIn) {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen relative bg-gradient-to-b from-blue-50 via-gray-50 to-blue-50 overflow-auto">
      {/* Decorative background elements */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 -left-24 w-96 h-96 rounded-full bg-blue-600/5 blur-3xl transform -rotate-12"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute top-10 right-0 w-72 h-72 rounded-full bg-blue-800/5 blur-2xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-10 left-1/3 w-64 h-64 rounded-full bg-red-500/5 blur-2xl"
      />

      {/* Page wrapper — small left/right margins per request */}
      <div className="mx-5 my-8 flex flex-col gap-6">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-sm rounded-2xl px-6 py-6 shadow-lg border-2 border-blue-200">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-blue-900 tracking-tight">
                Crime Analysis Dashboard
              </h1>
              <p className="mt-1 text-sm text-gray-700 font-medium">
                Monitor, analyze and investigate crime reports for citizen
                safety.
              </p>
            </div>
            <KpiCards data={kpiData} />
          </div>
        </header>

        {/* Top row: 3-column layout (explicit percentage columns) */}
        <div
          className="grid gap-x-4"
          // explicit columns: 15% | 55% | 25% (approx). The remaining ~5% is the gaps/margins.
          style={{ gridTemplateColumns: "15% 57% 25%" }}
        >
          {/* Filter (left) — shorter height */}
          <div
            className="bg-white rounded-2xl shadow-lg border-2 border-blue-100 p-4"
            style={{ height: "46vh" }}
          >
            <FilterPanel filters={filters} onFiltersChange={setFilters} />
          </div>

          {/* Map (center) — main area, taller */}
          <div
            className="bg-white rounded-2xl shadow-lg border-2 border-blue-100 overflow-hidden flex flex-col"
            style={{ height: "70vh" }}
          >
            {/* Map header */}
            <div className="flex items-center justify-between px-6 py-3 border-b-2 border-blue-100 bg-blue-50">
              <div>
                <h3 className="text-sm font-bold text-blue-900">Crime Map</h3>
                <p className="text-xs text-gray-600 font-medium">
                  Interactive crime report locations
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    // center on reports: call MapPanel via ref or set a small state to trigger a re-center handler
                    // if you implement a center function, call it here (example placeholder).
                    const evt = new CustomEvent("center-on-reports");
                    window.dispatchEvent(evt);
                  }}
                  className="text-sm px-3 py-1 rounded-md bg-blue-800 text-white hover:bg-blue-900 transition-all duration-200 font-medium"
                >
                  Center on Crimes
                </button>

                <button className="text-sm px-3 py-1 rounded-md border-2 border-blue-200 text-blue-700 hover:bg-blue-50 transition-all duration-200 font-medium">
                  Layers
                </button>

                {/* NOTE: if you moved mapMode dropdown to this header, keep it here and hook it to state */}
                {/* Example (if you added mapMode state in the parent): */}
                {/* <select value={mapMode} onChange={(e)=>setMapMode(e.target.value)} ... /> */}
              </div>
            </div>

            {/* Map body */}
            <div className="flex-1">
              <MapPanel
                reports={filteredReports}
                selectedReport={selectedReport}
                onSelectReport={setSelectedReport}
                // if MapPanel expects mapMode prop, pass it here
                // mapMode={mapMode}
              />
            </div>
          </div>

          {/* Right column: Investigation Queue & Detail Drawer (same column) */}
          <div
            className="bg-white rounded-2xl shadow-lg border-2 border-blue-100 overflow-hidden flex flex-col"
            style={{ height: "70vh" }}
          >
            {/* Top toolbar in right column: Back button + tabs */}
            <div className="flex items-center justify-between px-4 py-3 border-b-2 border-blue-100 bg-blue-50">
              <div className="flex items-center gap-3">
                {/* Show back button only when viewing details */}
                {selectedReport ? (
                  <button
                    onClick={() => setSelectedReport(null)}
                    className="text-sm px-2 py-1 rounded-md border-2 border-blue-200 text-blue-700 hover:bg-blue-50 transition-all duration-200 font-medium"
                  >
                    ← Back
                  </button>
                ) : (
                  // Tab navigation when not viewing details
                  <div className="flex gap-1">
                    <button
                      onClick={() => setActiveTab("queue")}
                      className={`text-sm px-3 py-1 rounded-md font-medium transition-all duration-200 ${
                        activeTab === "queue"
                          ? "bg-blue-600 text-white"
                          : "border-2 border-blue-200 text-blue-700 hover:bg-blue-50"
                      }`}
                    >
                      Investigation Queue
                    </button>
                    <button
                      onClick={() => setActiveTab("verified")}
                      className={`text-sm px-3 py-1 rounded-md font-medium transition-all duration-200 ${
                        activeTab === "verified"
                          ? "bg-green-600 text-white"
                          : "border-2 border-green-200 text-green-700 hover:bg-green-50"
                      }`}
                    >
                      Verified Reports
                    </button>
                  </div>
                )}

                <h3 className="text-sm font-bold text-blue-900">
                  {selectedReport ? "Crime Report Details" : ""}
                </h3>
              </div>

              {/* Optional action(s) for the right column */}
              <div>
                {!selectedReport && (
                  <button
                    onClick={() =>
                      window.dispatchEvent(new CustomEvent("scroll-queue-top"))
                    }
                    className="text-sm px-3 py-1 rounded-md border-2 border-blue-200 text-blue-700 hover:bg-blue-50 transition-all duration-200 font-medium"
                  >
                    Refresh
                  </button>
                )}
              </div>
            </div>

            {/* Body: either the list (scrollable) OR the detail drawer */}
            {!selectedReport ? (
              <div
                className="p-4 overflow-y-auto scroll-smooth"
                // keep same visual height as map by flex layout parent; inner scrollable
              >
                {activeTab === "queue" ? (
                  <QueueList
                    reports={filteredReports.filter(
                      (r) => r.status === "new" || r.status === "pending"
                    )}
                    selectedReport={selectedReport}
                    onSelectReport={setSelectedReport}
                  />
                ) : (
                  <VerifiedReports
                    reports={filteredReports}
                    onReportSelect={setSelectedReport}
                  />
                )}
              </div>
            ) : (
              <div className="flex-1 overflow-hidden p-0">
                <DetailDrawer
                  report={selectedReport}
                  onClose={() => setSelectedReport(null)}
                  onAction={handleReportAction}
                  onMediaClick={setSelectedMedia}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
