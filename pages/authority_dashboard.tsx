// import { useState, useEffect } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import dynamic from "next/dynamic";
// import useSWR from "swr";

// import Header from "@/components/authority/Header";
// import FiltersList from "@/components/authority/FiltersList";
// import IncidentList from "@/components/authority/IncidentList";
// import IncidentPane from "@/components/authority/IncidentPane";
// import KpiRibbon from "@/components/authority/KpiRibbon";

// import { Incident, Filters, NotificationData } from "@/lib/authority-types";

// // Dynamic import for Map to avoid SSR issues
// const MapPanel = dynamic(() => import("@/components/authority/MapPanel"), {
//   ssr: false,
// });

// const fetcher = (url: string) => fetch(url).then((res) => res.json());

// export default function AuthorityDashboard() {
//   const [selectedIncident, setSelectedIncident] = useState<Incident | null>(
//     null
//   );
//   const [filters, setFilters] = useState<Filters>({
//     dateRange: {
//       start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
//         .toISOString()
//         .split("T")[0],
//       end: new Date().toISOString().split("T")[0],
//     },
//     eventType: "all",
//     district: "all",
//     severity: "all",
//     confidenceRange: { min: 0, max: 1 },
//     verifiedOnly: true,
//   });

//   // Fetch incidents
//   const {
//     data: incidents,
//     mutate: mutateIncidents,
//     isLoading,
//     error,
//   } = useSWR<Incident[]>("/api/authority/incidents", fetcher, {
//     refreshInterval: 30000,
//     revalidateOnFocus: false,
//     dedupingInterval: 10000,
//   });

//   // Filter incidents based on current filters
//   const filteredIncidents =
//     incidents?.filter((incident) => {
//       const matchesEventType =
//         filters.eventType === "all" || incident.eventType === filters.eventType;
//       const matchesDistrict =
//         filters.district === "all" ||
//         incident.location.district === filters.district;
//       const matchesSeverity =
//         filters.severity === "all" || incident.severity === filters.severity;
//       const matchesConfidence =
//         incident.confidence >= filters.confidenceRange.min &&
//         incident.confidence <= filters.confidenceRange.max;

//       const incidentDate = new Date(incident.timestamp)
//         .toISOString()
//         .split("T")[0];
//       const matchesDateRange =
//         incidentDate >= filters.dateRange.start &&
//         incidentDate <= filters.dateRange.end;

//       return (
//         matchesEventType &&
//         matchesDistrict &&
//         matchesSeverity &&
//         matchesConfidence &&
//         matchesDateRange
//       );
//     }) || [];

//   // Server-Sent Events for real-time notifications
//   useEffect(() => {
//     const eventSource = new EventSource("/api/sse-notifications");

//     eventSource.onmessage = (event) => {
//       const notification: NotificationData = JSON.parse(event.data);
//       console.log("Received notification:", notification);

//       if (
//         notification.type === "new_incident" ||
//         notification.type === "dispatch_update"
//       ) {
//         mutateIncidents();
//       }
//     };

//     return () => {
//       eventSource.close();
//     };
//   }, [mutateIncidents]);

//   // Keyboard shortcuts
//   useEffect(() => {
//     const handleKeyDown = (e: KeyboardEvent) => {
//       if (!selectedIncident || selectedIncident.status === "closed") return;

//       if (e.key === "a" || e.key === "A") {
//         handleAction("acknowledge");
//       } else if (e.key === "d" || e.key === "D") {
//         handleAction("dispatch");
//       } else if (e.key === "p" || e.key === "P") {
//         handleAction("publish");
//       }
//     };

//     window.addEventListener("keydown", handleKeyDown);
//     return () => window.removeEventListener("keydown", handleKeyDown);
//   }, [selectedIncident]);

//   // Handle map interaction toggle
//   const handleMapFocus = () => {};
//   const handleMapBlur = () => {};

//   const handleAction = async (action: string, payload?: any) => {
//     if (!selectedIncident) return;

//     try {
//       const response = await fetch(
//         `/api/authority/incidents/${selectedIncident.id}/${action}`,
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: payload ? JSON.stringify(payload) : undefined,
//         }
//       );

//       if (response.ok) {
//         mutateIncidents();
//         const updatedIncident = await response.json();
//         setSelectedIncident(updatedIncident.incident);
//       }
//     } catch (error) {
//       console.error(`Error performing ${action}:`, error);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <Header />

//       {/* KPI Ribbon */}
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.5 }}
//         className="shadow-sm relative z-10"
//       >
//         <KpiRibbon incidents={filteredIncidents} />
//       </motion.div>

//       {/* Main Content Area */}
//       <div className="flex h-[calc(100vh-140px)] relative">
//         {/* Left Panel - Filters & Incident List */}
//         <motion.div
//           className="w-80 bg-white border-r border-gray-200 flex flex-col shadow-sm relative z-20"
//           initial={{ x: -320 }}
//           animate={{ x: 0 }}
//           transition={{ type: "spring", stiffness: 300, damping: 30 }}
//           onMouseEnter={() => {}}
//           onMouseLeave={() => {}}
//         >
//           {/* Filters Section with subtle spacing */}
//           <div className="border-b border-gray-100">
//             <FiltersList filters={filters} onFiltersChange={setFilters} />
//           </div>

//           {/* Incident List Section */}
//           <div className="flex-1 overflow-hidden">
//             <IncidentList
//               incidents={filteredIncidents}
//               selectedIncident={selectedIncident}
//               onSelectIncident={setSelectedIncident}
//               onQuickAction={handleAction}
//             />
//           </div>
//         </motion.div>

//         {/* Center Panel - Map with controlled interaction */}
//         <div className="flex-1 relative bg-gray-100">
//           {/* Map container with controlled pointer events */}
//           <div
//             className="absolute inset-2 rounded-lg overflow-hidden shadow-sm bg-white"
//             style={{
//               pointerEvents: "auto",
//               zIndex: 1,
//             }}
//           >
//             <MapPanel
//               incidents={filteredIncidents}
//               selectedIncident={selectedIncident}
//               onSelectIncident={setSelectedIncident}
//             />
//           </div>
//         </div>

//         {/* Right Panel - Incident Details */}
//         <AnimatePresence>
//           {selectedIncident && (
//             <motion.div
//               className="w-96 bg-white border-l border-gray-200 shadow-sm relative z-20"
//               initial={{ x: 384 }}
//               animate={{ x: 0 }}
//               exit={{ x: 384 }}
//               transition={{ type: "spring", stiffness: 300, damping: 30 }}
//               onMouseEnter={() => {}}
//               onMouseLeave={() => {}}
//             >
//               <IncidentPane
//                 incident={selectedIncident}
//                 onClose={() => setSelectedIncident(null)}
//                 onAction={handleAction}
//               />
//             </motion.div>
//           )}
//         </AnimatePresence>
//       </div>

//       {/* Quick Action Button */}
//       {!selectedIncident && filteredIncidents.length > 0 && (
//         <motion.div
//           className="fixed bottom-6 right-6 z-30"
//           initial={{ scale: 0, opacity: 0 }}
//           animate={{ scale: 1, opacity: 1 }}
//           transition={{ delay: 1, type: "spring", stiffness: 300 }}
//         >
//           <div className="relative group">
//             <button
//               onClick={() => setSelectedIncident(filteredIncidents[0])}
//               className="bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
//             >
//               <svg
//                 className="w-6 h-6 transform group-hover:scale-110 transition-transform"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M12 6v6m0 0v6m0-6h6m-6 0H6"
//                 />
//               </svg>
//             </button>
//             <div className="absolute -top-12 -left-12 bg-gray-900 text-white px-3 py-1 rounded-lg text-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
//               Select Latest Incident
//             </div>
//           </div>
//         </motion.div>
//       )}

//       {/* Map Interaction Status (optional) */}
//       <motion.div
//         className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-30"
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ delay: 0.5 }}
//       >
//         <div className="px-4 py-2 bg-green-500 text-white rounded-full text-sm font-medium shadow-lg">
//           Map: Interactive
//         </div>
//       </motion.div>

//       {/* Loading state - only show on initial load */}
//       {isLoading && !incidents && (
//         <motion.div
//           className="fixed inset-0 bg-black bg-opacity-20 flex items-center justify-center z-50"
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//         >
//           <div className="bg-white p-6 rounded-lg shadow-lg flex items-center space-x-4">
//             <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-200 border-t-blue-600"></div>
//             <span className="text-gray-700 font-medium">
//               Loading incidents...
//             </span>
//           </div>
//         </motion.div>
//       )}

//       {/* Background refresh indicator */}
//       {isLoading && incidents && (
//         <motion.div
//           className="fixed top-20 right-6 z-30"
//           initial={{ opacity: 0, x: 50 }}
//           animate={{ opacity: 1, x: 0 }}
//           exit={{ opacity: 0, x: 50 }}
//         >
//           <div className="bg-blue-500 text-white px-3 py-2 rounded-lg shadow-lg flex items-center space-x-2 text-sm">
//             <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-200 border-t-white"></div>
//             <span>Updating...</span>
//           </div>
//         </motion.div>
//       )}

//       {/* Error state */}
//       {error && (
//         <motion.div
//           className="fixed top-20 right-6 z-30"
//           initial={{ opacity: 0, x: 50 }}
//           animate={{ opacity: 1, x: 0 }}
//         >
//           <div className="bg-red-500 text-white px-3 py-2 rounded-lg shadow-lg flex items-center space-x-2 text-sm">
//             <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
//               <path
//                 fillRule="evenodd"
//                 d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
//                 clipRule="evenodd"
//               />
//             </svg>
//             <span>Failed to load incidents</span>
//           </div>
//         </motion.div>
//       )}
//     </div>
//   );
// }

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import useSWR from "swr";

import Header from "@/components/authority/Header";
import FiltersList from "@/components/authority/FiltersList";
import IncidentList from "@/components/authority/IncidentList";
import IncidentPane from "@/components/authority/IncidentPane";
import KpiRibbon from "@/components/authority/KpiRibbon";

import { Incident, Filters, NotificationData } from "@/lib/authority-types";
import { IncidentService } from "@/lib/incidents-service";
import { incidents as mockIncidents } from "@/lib/authority-data";

// Dynamic import for Map to avoid SSR issues
const MapPanel = dynamic(() => import("@/components/authority/MapPanel"), {
  ssr: false,
});

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function AuthorityDashboard() {
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(
    null
  );
  const [filters, setFilters] = useState<Filters>({
    dateRange: {
      start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      end: new Date().toISOString().split("T")[0],
    },
    eventType: "all",
    district: "all",
    severity: "all",
    confidenceRange: { min: 0, max: 1 },
    verifiedOnly: true,
  });
  const [newIncidentNotification, setNewIncidentNotification] = useState<{
    incident: Incident;
    timestamp: string;
  } | null>(null);

  // State for incidents
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Load incidents from Firestore with real-time updates
  useEffect(() => {
    setIsLoading(true);

    const unsubscribe = IncidentService.subscribeToIncidents(
      (firestoreIncidents) => {
        // Combine Firestore incidents with mock incidents
        const allIncidents = [...firestoreIncidents, ...mockIncidents];
        setIncidents(allIncidents);
        setIsLoading(false);
        setError(null);
      },
      {
        limitCount: 100, // Limit to prevent performance issues
      }
    );

    return () => unsubscribe();
  }, []);

  // Filter incidents based on current filters
  const filteredIncidents =
    incidents?.filter((incident) => {
      const matchesEventType =
        filters.eventType === "all" || incident.eventType === filters.eventType;
      const matchesDistrict =
        filters.district === "all" ||
        incident.location.district === filters.district;
      const matchesSeverity =
        filters.severity === "all" || incident.severity === filters.severity;
      const matchesConfidence =
        incident.confidence >= filters.confidenceRange.min &&
        incident.confidence <= filters.confidenceRange.max;

      const incidentDate = new Date(incident.timestamp)
        .toISOString()
        .split("T")[0];
      const matchesDateRange =
        incidentDate >= filters.dateRange.start &&
        incidentDate <= filters.dateRange.end;

      return (
        matchesEventType &&
        matchesDistrict &&
        matchesSeverity &&
        matchesConfidence &&
        matchesDateRange
      );
    }) || [];

  // Server-Sent Events for real-time notifications
  useEffect(() => {
    const eventSource = new EventSource("/api/sse-notifications");

    eventSource.onmessage = (event) => {
      const notification: NotificationData = JSON.parse(event.data);
      console.log("Received notification:", notification);

      if (
        notification.type === "new_incident" ||
        notification.type === "dispatch_update"
      ) {
        // Show notification to user
        if (notification.type === "new_incident") {
          console.log("New incident received:", notification.data.incident);
          setNewIncidentNotification({
            incident: notification.data.incident,
            timestamp: notification.timestamp,
          });

          // Auto-hide notification after 5 seconds
          setTimeout(() => {
            setNewIncidentNotification(null);
          }, 5000);
        }

        // Note: Real-time updates are handled by Firestore subscription
        // No need to manually refresh data
      }
    };

    eventSource.onerror = (error) => {
      console.error("SSE connection error:", error);
    };

    return () => {
      eventSource.close();
    };
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedIncident || selectedIncident.status === "closed") return;

      if (e.key === "a" || e.key === "A") {
        handleAction("acknowledge");
      } else if (e.key === "d" || e.key === "D") {
        handleAction("dispatch");
      } else if (e.key === "p" || e.key === "P") {
        handleAction("publish");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedIncident]);

  const handleAction = async (action: string, payload?: any) => {
    if (!selectedIncident) return;

    try {
      const response = await fetch(
        `/api/authority/incidents/${selectedIncident.id}/${action}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: payload ? JSON.stringify(payload) : undefined,
        }
      );

      if (response.ok) {
        const updatedIncident = await response.json();
        setSelectedIncident(updatedIncident.incident);
        // Real-time updates are handled by Firestore subscription
      }
    } catch (error) {
      console.error(`Error performing ${action}:`, error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-gray-50 to-blue-50">
      <Header />

      {/* KPI Ribbon */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="shadow-lg relative z-10"
      >
        <KpiRibbon incidents={filteredIncidents} />
      </motion.div>

      {/* Main Content Area - 3 Column Layout */}
      <div className="p-4">
        <div
          className="grid gap-4 h-[calc(100vh-200px)]"
          style={{ gridTemplateColumns: "15% 57% 25%" }}
        >
          {/* Left Panel - Filters */}
          <motion.div
            className="bg-white rounded-lg shadow-lg border-2 border-blue-100 p-4 flex flex-col"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            style={{ height: "72vh" }}
          >
            <h3 className="text-sm font-bold text-blue-900 mb-4">
              Crime Filters
            </h3>
            <FiltersList filters={filters} onFiltersChange={setFilters} />
          </motion.div>

          {/* Center Panel - Map */}
          <motion.div
            className="bg-white rounded-lg shadow-lg border-2 border-blue-100 overflow-hidden flex flex-col"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            style={{ height: "70vh" }}
          >
            {/* Map header */}
            <div className="flex items-center justify-between px-6 py-3 border-b-2 border-blue-100 bg-blue-50">
              <div>
                <h3 className="text-sm font-bold text-blue-900">
                  Crime Incident Map
                </h3>
                <p className="text-xs text-gray-600 font-medium">
                  {filteredIncidents.length} incidents displayed
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    const evt = new CustomEvent("center-on-incidents");
                    window.dispatchEvent(evt);
                  }}
                  className="text-sm px-3 py-1 rounded-md bg-blue-800 text-white hover:bg-blue-900 transition-all duration-200 font-medium"
                >
                  Center View
                </button>

                <button className="text-sm px-3 py-1 rounded-md border-2 border-blue-200 text-blue-700 hover:bg-blue-50 transition-all duration-200 font-medium">
                  Layers
                </button>
              </div>
            </div>

            {/* Map body */}
            <div className="flex-1">
              <MapPanel
                incidents={filteredIncidents}
                selectedIncident={selectedIncident}
                onSelectIncident={setSelectedIncident}
              />
            </div>
          </motion.div>

          {/* Right Panel - Incident List/Details */}
          <motion.div
            className="bg-white rounded-lg shadow-lg border-2 border-blue-100 overflow-hidden flex flex-col"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            style={{ height: "70vh" }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b-2 border-blue-100 bg-blue-50">
              <div className="flex items-center gap-3">
                {selectedIncident ? (
                  <button
                    onClick={() => setSelectedIncident(null)}
                    className="text-sm px-2 py-1 rounded-md border-2 border-blue-200 text-blue-700 hover:bg-blue-50 transition-all duration-200 font-medium"
                  >
                    ← Back
                  </button>
                ) : (
                  <div className="w-12" />
                )}

                <h3 className="text-sm font-bold text-blue-900">
                  {selectedIncident ? "Crime Details" : "Crime Queue"}
                </h3>
              </div>

              {!selectedIncident && (
                <div className="flex items-center gap-2">
                  <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2.5 py-0.5 rounded-full">
                    {filteredIncidents.length}
                  </span>
                  <button
                    onClick={() => {
                      // Real-time updates are handled by Firestore subscription
                      console.log(
                        "Refresh requested - data updates automatically"
                      );
                    }}
                    className="text-sm px-3 py-1 rounded-md border-2 border-blue-200 text-blue-700 hover:bg-blue-50 transition-all duration-200 font-medium"
                  >
                    Refresh
                  </button>
                </div>
              )}
            </div>

            {/* Body */}
            {!selectedIncident ? (
              <div className="flex-1 overflow-y-auto">
                <IncidentList
                  incidents={filteredIncidents}
                  selectedIncident={selectedIncident}
                  onSelectIncident={setSelectedIncident}
                  onQuickAction={handleAction}
                />
              </div>
            ) : (
              <div className="flex-1 overflow-hidden">
                <IncidentPane
                  incident={selectedIncident}
                  onClose={() => setSelectedIncident(null)}
                  onAction={handleAction}
                />
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Quick Action Button */}
      {!selectedIncident && filteredIncidents.length > 0 && (
        <motion.div
          className="fixed bottom-6 right-6 z-30"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 1, type: "spring", stiffness: 300 }}
        >
          <div className="relative group">
            <button
              onClick={() => setSelectedIncident(filteredIncidents[0])}
              className="bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <svg
                className="w-6 h-6 transform group-hover:scale-110 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
            </button>
            <div className="absolute -top-12 -left-12 bg-gray-900 text-white px-3 py-1 rounded-lg text-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
              Select Latest Incident
            </div>
          </div>
        </motion.div>
      )}

      {/* Keyboard Shortcuts Indicator */}
      {selectedIncident && selectedIncident.status !== "closed" && (
        <motion.div
          className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-30"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="bg-gray-800 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg">
            Press A to acknowledge • D to dispatch • P to publish
          </div>
        </motion.div>
      )}

      {/* Loading state - only show on initial load */}
      {isLoading && !incidents && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-20 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="bg-white p-6 rounded-lg shadow-lg flex items-center space-x-4">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-200 border-t-blue-600"></div>
            <span className="text-gray-700 font-medium">
              Loading incidents...
            </span>
          </div>
        </motion.div>
      )}

      {/* Background refresh indicator */}
      {isLoading && incidents && (
        <motion.div
          className="fixed top-20 right-6 z-30"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 50 }}
        >
          <div className="bg-blue-500 text-white px-3 py-2 rounded-lg shadow-lg flex items-center space-x-2 text-sm">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-200 border-t-white"></div>
            <span>Updating...</span>
          </div>
        </motion.div>
      )}

      {/* New Incident Notification */}
      {newIncidentNotification && (
        <motion.div
          className="fixed top-20 right-6 z-40"
          initial={{ opacity: 0, x: 50, scale: 0.9 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 50, scale: 0.9 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <div className="bg-green-500 text-white px-4 py-3 rounded-lg shadow-lg max-w-sm">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-sm">New Verified Incident</h4>
                <p className="text-xs mt-1 opacity-90">
                  {newIncidentNotification.incident.title}
                </p>
                <p className="text-xs mt-1 opacity-75">
                  {newIncidentNotification.incident.location.district} •{" "}
                  {newIncidentNotification.incident.severity.toUpperCase()}
                </p>
              </div>
              <button
                onClick={() => setNewIncidentNotification(null)}
                className="flex-shrink-0 text-white hover:text-gray-200"
              >
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Error state */}
      {error && (
        <motion.div
          className="fixed top-20 right-6 z-30"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div className="bg-red-500 text-white px-3 py-2 rounded-lg shadow-lg flex items-center space-x-2 text-sm">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            <span>Failed to load incidents</span>
          </div>
        </motion.div>
      )}
    </div>
  );
}
