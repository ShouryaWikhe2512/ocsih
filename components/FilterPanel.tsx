// import { Filters } from "@/lib/types";

// interface FilterPanelProps {
//   filters: Filters;
//   onFiltersChange: (filters: Filters) => void;
// }

// export default function FilterPanel({
//   filters,
//   onFiltersChange,
// }: FilterPanelProps) {
//   const handleFilterChange = (key: keyof Filters, value: any) => {
//     onFiltersChange({ ...filters, [key]: value });
//   };

//   return (
//     <div className="p-4 border-b border-gray-200">
//       <h2 className="font-semibold text-lg mb-4">Filters</h2>

//       <div className="space-y-4">
//         {/* Event Type */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">
//             Event Type
//           </label>
//           <select
//             className="w-full p-2 border border-gray-300 rounded-md text-sm"
//             value={filters.eventType}
//             onChange={(e) => handleFilterChange("eventType", e.target.value)}
//           >
//             <option value="all">All Types</option>
//             <option value="high_wave">High Wave</option>
//             <option value="flood">Flood</option>
//             <option value="unusual_tide">Unusual Tide</option>
//           </select>
//         </div>

//         {/* Trust Level */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">
//             Min Trust Level: {Math.round(filters.minTrust * 100)}%
//           </label>
//           <input
//             type="range"
//             min="0"
//             max="1"
//             step="0.1"
//             className="w-full"
//             value={filters.minTrust}
//             onChange={(e) =>
//               handleFilterChange("minTrust", parseFloat(e.target.value))
//             }
//           />
//         </div>

//         {/* Time Window */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">
//             Time Window
//           </label>
//           <select
//             className="w-full p-2 border border-gray-300 rounded-md text-sm"
//             value={filters.timeWindow}
//             onChange={(e) =>
//               handleFilterChange("timeWindow", parseInt(e.target.value))
//             }
//           >
//             <option value={1}>Last Hour</option>
//             <option value={6}>Last 6 Hours</option>
//             <option value={24}>Last 24 Hours</option>
//             <option value={168}>Last Week</option>
//           </select>
//         </div>

//         {/* Verified Only */}
//         <div>
//           <label className="flex items-center text-sm">
//             <input
//               type="checkbox"
//               className="mr-2"
//               checked={filters.verifiedOnly}
//               onChange={(e) =>
//                 handleFilterChange("verifiedOnly", e.target.checked)
//               }
//             />
//             Verified Reports Only
//           </label>
//         </div>
//       </div>
//     </div>
//   );
// }

import { Filters } from "@/lib/types";
import { AnalyticsService } from "@/lib/analytics";

interface FilterPanelProps {
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
}

export default function FilterPanel({
  filters,
  onFiltersChange,
}: FilterPanelProps) {
  const handleFilterChange = (key: keyof Filters, value: any) => {
    // Track filter usage
    AnalyticsService.trackFilterUsage(key, String(value));
    onFiltersChange({ ...filters, [key]: value });
  };

  return (
    <div className="p-5 border-2 border-blue-200 rounded-xl shadow-lg bg-white">
      <h2 className="font-bold text-lg mb-4 text-blue-900">Crime Filters</h2>

      <div className="space-y-5">
        {/* Crime Type */}
        <div>
          <label className="block text-sm font-semibold text-blue-800 mb-2">
            Crime Type
          </label>
          <select
            className="w-full p-2 border-2 border-blue-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white font-medium"
            value={filters.eventType}
            onChange={(e) => handleFilterChange("eventType", e.target.value)}
          >
            <option value="all">All Crime Types</option>
            <option value="theft">Theft</option>
            <option value="assault">Assault</option>
            <option value="burglary">Burglary</option>
            <option value="fraud">Fraud</option>
            <option value="vandalism">Vandalism</option>
            <option value="robbery">Robbery</option>
            <option value="domestic_violence">Domestic Violence</option>
            <option value="cyber_crime">Cyber Crime</option>
          </select>
        </div>

        {/* Trust Level */}
        <div>
          <label className="block text-sm font-semibold text-blue-800 mb-2">
            Report Reliability:{" "}
            <span className="font-bold text-blue-900">
              {Math.round(filters.minTrust * 100)}%
            </span>
          </label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            className="w-full accent-blue-600"
            value={filters.minTrust}
            onChange={(e) =>
              handleFilterChange("minTrust", parseFloat(e.target.value))
            }
          />
        </div>

        {/* Time Window */}
        <div>
          <label className="block text-sm font-semibold text-blue-800 mb-2">
            Time Period
          </label>
          <select
            className="w-full p-2 border-2 border-blue-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white font-medium"
            value={filters.timeWindow}
            onChange={(e) =>
              handleFilterChange("timeWindow", parseInt(e.target.value))
            }
          >
            <option value={1}>Last Hour</option>
            <option value={6}>Last 6 Hours</option>
            <option value={24}>Last 24 Hours</option>
            <option value={168}>Last Week</option>
          </select>
        </div>

        {/* Verified Only */}
        <div>
          <label className="flex items-center text-sm text-blue-800 font-semibold">
            <input
              type="checkbox"
              className="mr-2 accent-blue-600 h-4 w-4 rounded"
              checked={filters.verifiedOnly}
              onChange={(e) =>
                handleFilterChange("verifiedOnly", e.target.checked)
              }
            />
            Verified Reports Only
          </label>
        </div>
      </div>
    </div>
  );
}
