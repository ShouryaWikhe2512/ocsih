"use client";

import { useState, useEffect, useCallback } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/router";
import { Report, Filters, KPIData } from "@/lib/types";
import { mockReports } from "@/lib/mock-data";
import { useWebSocket } from "@/hooks/useWebSocket";
import MapPanel from "@/components/MapPanel";
import FilterPanel from "@/components/FilterPanel";
import QueueList from "@/components/QueueList";
import DetailDrawer from "@/components/DetailDrawer";
import KpiCards from "@/components/KpiCards";
import MediaModal from "@/components/MediaModal";
import TimeSeriesStackedArea from "@/components/TimeSeriesStackedArea";

export default function AnalystDashboard() {
  const { isLoaded, isSignedIn, user } = useUser();
  const router = useRouter();

  const [reports, setReports] = useState<Report[]>(mockReports);
  const [filteredReports, setFilteredReports] = useState<Report[]>(mockReports);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [selectedMedia, setSelectedMedia] = useState<string | null>(null);
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

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isSignedIn) {
    return null; // Will redirect
  }

  // WebSocket for real-time updates
  const handleWebSocketMessage = useCallback((message: any) => {
    if (message.event === "new_report") {
      setReports((prev) => [message.data, ...prev]);
    }
  }, []);

  useWebSocket(handleWebSocketMessage);

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
      (r) => r.status === "new" || r.status === "in_review"
    ).length,
    rejectedReports: reports.filter((r) => r.status === "rejected").length,
  };

  const handleReportAction = async (
    reportId: string,
    action: "verify" | "reject"
  ) => {
    try {
      const response = await fetch(`/api/reports/${reportId}/${action}`, {
        method: "POST",
      });

      if (response.ok) {
        const newStatus = action === "verify" ? "verified" : "rejected";
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
        (selectedReport.status === "new" ||
          selectedReport.status === "in_review")
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

  return (
    <div className="min-h-screen relative bg-gradient-to-b from-[#d1f0eb] via-[#b6e6de] to-[#d1f0eb] overflow-auto">
      {/* Decorative background blobs */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 -left-24 w-96 h-96 rounded-full bg-[#4FB7B3]/10 blur-3xl transform -rotate-12"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute top-10 right-0 w-72 h-72 rounded-full bg-[#4FB7B3]/6 blur-2xl"
      />

      {/* Page wrapper — small left/right margins per request */}
      <div className="mx-5 my-8 flex flex-col gap-6">
        {/* Header */}
        <header className="bg-white/70 backdrop-blur-sm rounded-2xl px-6 py-6 shadow-sm border border-gray-100">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-semibold text-[#0f1724] tracking-tight">
                Ocean Hazard Analysis
              </h1>
              <p className="mt-1 text-sm text-gray-600">
                Monitor, validate and act on incoming ocean hazard reports.
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
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4"
            style={{ height: "46vh" }}
          >
            <FilterPanel filters={filters} onFiltersChange={setFilters} />
          </div>

          {/* Map (center) — main area, taller */}
          <div
            className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col"
            style={{ height: "70vh" }}
          >
            {/* Map header */}
            <div className="flex items-center justify-between px-6 py-3 border-b border-gray-100">
              <div>
                <h3 className="text-sm font-semibold text-gray-800">Map</h3>
                <p className="text-xs text-gray-500">
                  Interactive report locations
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
                  className="text-sm px-3 py-1 rounded-md bg-[#4FB7B3] text-white hover:bg-[#429e99] transition"
                >
                  Center on reports
                </button>

                <button className="text-sm px-3 py-1 rounded-md border border-gray-200 text-gray-700 hover:bg-gray-50 transition">
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

          {/* Right column: Verification Queue & Detail Drawer (same column) */}
          <div
            className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col"
            style={{ height: "70vh" }}
          >
            {/* Top toolbar in right column: Back button + title */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
              <div className="flex items-center gap-3">
                {/* Show back button only when viewing details */}
                {selectedReport ? (
                  <button
                    onClick={() => setSelectedReport(null)}
                    className="text-sm px-2 py-1 rounded-md border border-gray-200 text-gray-700 hover:bg-gray-50 transition"
                  >
                    ← Back
                  </button>
                ) : (
                  // keep a small placeholder to preserve layout
                  <div className="w-12" />
                )}

                <h3 className="text-sm font-semibold text-gray-800">
                  {selectedReport ? "Report Details" : "Verification Queue"}
                </h3>
              </div>

              {/* Optional action(s) for the right column */}
              <div>
                {!selectedReport && (
                  <button
                    onClick={() =>
                      window.dispatchEvent(new CustomEvent("scroll-queue-top"))
                    }
                    className="text-sm px-3 py-1 rounded-md border border-gray-200 text-gray-700 hover:bg-gray-50 transition"
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
                <QueueList
                  reports={filteredReports.filter(
                    (r) => r.status === "new" || r.status === "in_review"
                  )}
                  selectedReport={selectedReport}
                  onSelectReport={setSelectedReport}
                />
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

        {/* Bottom row — full width Disaster Trends chart */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-800">
                Disaster Trends
              </h2>
              <p className="text-sm text-gray-500">
                Stacked counts by event type with average trust overlay
              </p>
            </div>

            <div className="flex gap-2">
              {["24h", "7d", "30d"].map((range) => (
                <button
                  key={range}
                  className="px-3 py-1 text-sm rounded-md border border-gray-200 hover:bg-gray-50 transition"
                >
                  {range}
                </button>
              ))}
            </div>
          </div>

          <TimeSeriesStackedArea bucket="hour" periodHours={168} height={300} />
        </div>
      </div>
    </div>
  );
}
