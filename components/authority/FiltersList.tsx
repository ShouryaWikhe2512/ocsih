import { motion } from "framer-motion";
import { Filters } from "@/lib/authority-types";

interface FiltersListProps {
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
}

export default function FiltersList({
  filters,
  onFiltersChange,
}: FiltersListProps) {
  const handleFilterChange = (key: keyof Filters, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  // Crime categories from the database
  const eventTypes = [
    "all",
    "sexual_violence",
    "domestic_violence",
    "street_crimes",
    "mob_violence_lynching",
    "road_rage_incidents",
    "cybercrimes",
    "drug",
  ];

  // Time filter options
  const timeFilters = [
    { value: "all", label: "All Time" },
    { value: "24h", label: "Last 24 Hours" },
    { value: "1w", label: "Last 1 Week" },
    { value: "1m", label: "Last 1 Month" },
    { value: "6m", label: "Last 6 Months" },
  ];

  return (
    <motion.div
      className="p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
    >
      <h2 className="font-semibold text-lg mb-4 text-gray-900">
        Crime Filters
      </h2>

      <div className="space-y-4">
        {/* Crime Category Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Crime Category
          </label>
          <select
            className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={filters.eventType}
            onChange={(e) => handleFilterChange("eventType", e.target.value)}
          >
            {eventTypes.map((type) => (
              <option key={type} value={type}>
                {type === "all"
                  ? "All Crime Categories"
                  : type.replace("_", " ").toUpperCase()}
              </option>
            ))}
          </select>
        </div>

        {/* Time Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Time Period
          </label>
          <select
            className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={filters.timeFilter || "all"}
            onChange={(e) => handleFilterChange("timeFilter", e.target.value)}
          >
            {timeFilters.map((filter) => (
              <option key={filter.value} value={filter.value}>
                {filter.label}
              </option>
            ))}
          </select>
        </div>

        {/* Info Text */}
        <div className="mt-6 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-xs text-blue-800">
            <strong>Note:</strong> Only verified reports from analysts are
            displayed here.
          </p>
        </div>
      </div>
    </motion.div>
  );
}
