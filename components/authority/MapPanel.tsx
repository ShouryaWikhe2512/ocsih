// "use client";

// import { useEffect, useRef } from "react";
// import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
// import L from "leaflet";
// import { motion } from "framer-motion";
// import { Incident } from "@/lib/authority-types";
// import { getSeverityColor, getEventTypeIcon } from "@/lib/utils";

// // Fix for default markers in react-leaflet
// import "leaflet/dist/leaflet.css";

// // Custom icon creation
// const createCustomIcon = (severity: string, eventType: string) => {
//   const color =
//     severity === "extreme"
//       ? "#dc2626"
//       : severity === "high"
//       ? "#ea580c"
//       : severity === "moderate"
//       ? "#ca8a04"
//       : "#16a34a";

//   return L.divIcon({
//     className: "custom-marker",
//     html: `
//       <div style="
//         background-color: ${color};
//         width: 24px;
//         height: 24px;
//         border-radius: 50%;
//         border: 2px solid white;
//         box-shadow: 0 2px 4px rgba(0,0,0,0.3);
//         display: flex;
//         align-items: center;
//         justify-content: center;
//         font-size: 12px;
//       ">
//         ${getEventTypeIcon(eventType)}
//       </div>
//     `,
//     iconSize: [24, 24],
//     iconAnchor: [12, 12],
//     popupAnchor: [0, -12],
//   });
// };

// interface MapPanelProps {
//   incidents: Incident[];
//   selectedIncident: Incident | null;
//   onSelectIncident: (incident: Incident) => void;
// }

// // Component to handle map updates
// function MapUpdater({
//   selectedIncident,
// }: {
//   selectedIncident: Incident | null;
// }) {
//   const map = useMap();

//   useEffect(() => {
//     if (selectedIncident) {
//       map.setView(
//         [selectedIncident.location.lat, selectedIncident.location.lng],
//         12
//       );
//     }
//   }, [selectedIncident, map]);

//   return null;
// }

// export default function MapPanel({
//   incidents,
//   selectedIncident,
//   onSelectIncident,
// }: MapPanelProps) {
//   const mapRef = useRef<L.Map | null>(null);

//   return (
//     <div className="relative h-full">
//       <MapContainer
//         center={[20.5937, 78.9629]} // Center of India
//         zoom={6}
//         className="h-full w-full"
//         ref={mapRef}
//       >
//         <TileLayer
//           attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//           url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//         />

//         <MapUpdater selectedIncident={selectedIncident} />

//         {incidents.map((incident) => (
//           <Marker
//             key={incident.id}
//             position={[incident.location.lat, incident.location.lng]}
//             icon={createCustomIcon(incident.severity, incident.eventType)}
//             eventHandlers={{
//               click: () => onSelectIncident(incident),
//             }}
//           >
//             <Popup>
//               <div className="text-sm max-w-xs">
//                 <div className="flex items-center justify-between mb-2">
//                   <span className="font-semibold">{incident.title}</span>
//                   <span
//                     className={`px-2 py-1 rounded text-xs ${getSeverityColor(
//                       incident.severity
//                     )}`}
//                   >
//                     {incident.severity.toUpperCase()}
//                   </span>
//                 </div>
//                 <p className="text-gray-600 mb-2">
//                   {incident.description.substring(0, 100)}...
//                 </p>
//                 <div className="flex justify-between items-center">
//                   <span className="text-green-600 text-xs">
//                     {Math.round(incident.confidence * 100)}% confidence
//                   </span>
//                   <button
//                     onClick={() => onSelectIncident(incident)}
//                     className="text-xs bg-accent-500 text-white px-2 py-1 rounded hover:bg-accent-600"
//                   >
//                     Open Dossier
//                   </button>
//                 </div>
//               </div>
//             </Popup>
//           </Marker>
//         ))}
//       </MapContainer>

//       {/* Map Legend */}
//       <motion.div
//         className="absolute bottom-4 left-4 bg-white p-3 rounded-lg shadow-lg"
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ delay: 0.5 }}
//       >
//         <h4 className="font-semibold text-sm mb-2">Severity Levels</h4>
//         <div className="space-y-1">
//           {[
//             { severity: "extreme", color: "#dc2626", label: "Extreme" },
//             { severity: "high", color: "#ea580c", label: "High" },
//             { severity: "moderate", color: "#ca8a04", label: "Moderate" },
//             { severity: "low", color: "#16a34a", label: "Low" },
//           ].map(({ severity, color, label }) => (
//             <div key={severity} className="flex items-center text-xs">
//               <div
//                 className="w-3 h-3 rounded-full mr-2 border border-white"
//                 style={{ backgroundColor: color }}
//               ></div>
//               {label}
//             </div>
//           ))}
//         </div>

//         {/* Resource Toggle */}
//         <div className="mt-3 pt-2 border-t border-gray-200">
//           <label className="flex items-center text-xs">
//             <input type="checkbox" className="mr-2" />
//             Show Resources
//           </label>
//         </div>
//       </motion.div>
//     </div>
//   );
// }

"use client";

import { useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { motion } from "framer-motion";
import { Incident } from "@/lib/authority-types";
import { getSeverityColor, getEventTypeIcon } from "@/lib/utils";

// Fix for default markers in react-leaflet
import "leaflet/dist/leaflet.css";

// Custom icon creation
const createCustomIcon = (severity: string, eventType: string) => {
  const color =
    severity === "extreme"
      ? "#dc2626"
      : severity === "high"
      ? "#ea580c"
      : severity === "moderate"
      ? "#ca8a04"
      : "#16a34a";

  return L.divIcon({
    className: "custom-marker",
    html: `
      <div style="
        background-color: ${color};
        width: 24px;
        height: 24px;
        border-radius: 50%;
        border: 2px solid white;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;
        position: relative;
        z-index: 1;
      ">
        ${getEventTypeIcon(eventType)}
      </div>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12],
  });
};

interface MapPanelProps {
  incidents: Incident[];
  selectedIncident: Incident | null;
  onSelectIncident: (incident: Incident) => void;
}

// Component to handle map updates
function MapUpdater({
  selectedIncident,
}: {
  selectedIncident: Incident | null;
}) {
  const map = useMap();

  useEffect(() => {
    if (selectedIncident) {
      map.setView(
        [selectedIncident.location.lat, selectedIncident.location.lng],
        12
      );
    }
  }, [selectedIncident, map]);

  return null;
}

export default function MapPanel({
  incidents,
  selectedIncident,
  onSelectIncident,
}: MapPanelProps) {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Ensure map container doesn't capture events outside its bounds
    if (mapContainerRef.current) {
      const container = mapContainerRef.current;

      // Prevent event bubbling for certain events
      const stopEventPropagation = (e: Event) => {
        e.stopPropagation();
      };

      // Only stop propagation for map-specific events, not all events
      container.addEventListener("wheel", stopEventPropagation, {
        passive: false,
      });

      return () => {
        container.removeEventListener("wheel", stopEventPropagation);
      };
    }
  }, []);

  // Handle popup button clicks properly
  const handlePopupButtonClick = (e: React.MouseEvent, incident: Incident) => {
    e.preventDefault();
    e.stopPropagation();
    onSelectIncident(incident);
  };

  return (
    <div
      ref={mapContainerRef}
      className="relative h-full w-full"
      style={{
        isolation: "isolate",
        contain: "layout style",
      }}
    >
      <MapContainer
        center={[20.5937, 78.9629]} // Center of India
        zoom={6}
        className="h-full w-full"
        ref={mapRef}
        style={{
          zIndex: 1,
          position: "relative",
        }}
        // Add map options to prevent interference
        zoomControl={true}
        scrollWheelZoom={true}
        doubleClickZoom={true}
        touchZoom={true}
        keyboard={false} // Disable keyboard navigation to prevent conflicts
        closePopupOnClick={true}
        // Restrict interaction bounds
        maxBounds={[
          [-90, -180],
          [90, 180],
        ]}
        bounceAtZoomLimits={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          // Add error handling for tile loading
          errorTileUrl="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=="
        />

        <MapUpdater selectedIncident={selectedIncident} />

        {incidents.map((incident) => (
          <Marker
            key={incident.id}
            position={[incident.location.lat, incident.location.lng]}
            icon={createCustomIcon(incident.severity, incident.eventType)}
            eventHandlers={{
              click: (e) => {
                // Prevent event from bubbling up
                e.originalEvent?.stopPropagation();
                onSelectIncident(incident);
              },
            }}
          >
            <Popup
              closeOnClick={false}
              autoClose={false}
              closeOnEscapeKey={true}
              className="custom-popup"
              // Set max width to prevent overflow
              maxWidth={300}
              minWidth={250}
            >
              <div
                className="text-sm max-w-xs"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-gray-800">
                    {incident.title}
                  </span>
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${getSeverityColor(
                      incident.severity
                    )}`}
                  >
                    {incident.severity.toUpperCase()}
                  </span>
                </div>
                <p className="text-gray-600 mb-2 text-xs">
                  {incident.description.substring(0, 100)}...
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-green-600 text-xs font-medium">
                    {Math.round(incident.confidence * 100)}% confidence
                  </span>
                  <button
                    onClick={(e) => handlePopupButtonClick(e, incident)}
                    className="text-xs bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition-colors duration-200 font-medium"
                    type="button"
                  >
                    Open Details
                  </button>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Map Legend - Fixed positioning */}
      <motion.div
        className="absolute bottom-4 left-4 bg-white p-3 rounded-lg shadow-lg border border-gray-200"
        style={{
          zIndex: 1000,
          pointerEvents: "auto",
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        onClick={(e) => e.stopPropagation()}
      >
        <h4 className="font-semibold text-sm mb-2 text-gray-800">
          Severity Levels
        </h4>
        <div className="space-y-1">
          {[
            { severity: "extreme", color: "#dc2626", label: "Extreme" },
            { severity: "high", color: "#ea580c", label: "High" },
            { severity: "moderate", color: "#ca8a04", label: "Moderate" },
            { severity: "low", color: "#16a34a", label: "Low" },
          ].map(({ severity, color, label }) => (
            <div key={severity} className="flex items-center text-xs">
              <div
                className="w-3 h-3 rounded-full mr-2 border border-white shadow-sm"
                style={{ backgroundColor: color }}
              ></div>
              <span className="text-gray-700">{label}</span>
            </div>
          ))}
        </div>

        {/* Resource Toggle */}
        <div className="mt-3 pt-2 border-t border-gray-200">
          <label className="flex items-center text-xs cursor-pointer">
            <input
              type="checkbox"
              className="mr-2 rounded border-gray-300 focus:ring-blue-500 focus:ring-2 cursor-pointer"
              onChange={(e) => e.stopPropagation()}
              onClick={(e) => e.stopPropagation()}
            />
            <span className="text-gray-700">Show Resources</span>
          </label>
        </div>
      </motion.div>
    </div>
  );
}
