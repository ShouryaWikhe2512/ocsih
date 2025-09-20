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

  const districts = [
    "all",
    "Mumbai",
    "Ernakulam",
    "Chennai",
    "Kolkata",
    "Visakhapatnam",
  ];
  const eventTypes = ["all", "high_wave", "flood", "unusual_tide", "cyclone"];
  const severityLevels = ["all", "low", "moderate", "high", "extreme"];

  return (
    <motion.div
      className="p-4 border-b border-gray-200"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
    >
      <h2 className="font-semibold text-lg mb-4 text-gray-900">Filters</h2>

      <div className="space-y-4">
        {/* Date Range */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date Range
          </label>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="date"
              className="text-xs p-2 border border-gray-300 rounded focus:ring-2 focus:ring-accent-500"
              value={filters.dateRange.start}
              onChange={(e) =>
                handleFilterChange("dateRange", {
                  ...filters.dateRange,
                  start: e.target.value,
                })
              }
            />
            <input
              type="date"
              className="text-xs p-2 border border-gray-300 rounded focus:ring-2 focus:ring-accent-500"
              value={filters.dateRange.end}
              onChange={(e) =>
                handleFilterChange("dateRange", {
                  ...filters.dateRange,
                  end: e.target.value,
                })
              }
            />
          </div>
        </div>

        {/* Event Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Event Type
          </label>
          <select
            className="w-full p-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-accent-500"
            value={filters.eventType}
            onChange={(e) => handleFilterChange("eventType", e.target.value)}
          >
            {eventTypes.map((type) => (
              <option key={type} value={type}>
                {type === "all"
                  ? "All Events"
                  : type.replace("_", " ").toUpperCase()}
              </option>
            ))}
          </select>
        </div>

        {/* District */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            District
          </label>
          <select
            className="w-full p-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-accent-500"
            value={filters.district}
            onChange={(e) => handleFilterChange("district", e.target.value)}
          >
            {districts.map((district) => (
              <option key={district} value={district}>
                {district === "all" ? "All Districts" : district}
              </option>
            ))}
          </select>
        </div>

        {/* Severity */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Severity
          </label>
          <select
            className="w-full p-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-accent-500"
            value={filters.severity}
            onChange={(e) => handleFilterChange("severity", e.target.value)}
          >
            {severityLevels.map((severity) => (
              <option key={severity} value={severity}>
                {severity === "all" ? "All Severities" : severity.toUpperCase()}
              </option>
            ))}
          </select>
        </div>

        {/* Confidence Range */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Confidence Range: {Math.round(filters.confidenceRange.min * 100)}% -{" "}
            {Math.round(filters.confidenceRange.max * 100)}%
          </label>
          <div className="space-y-2">
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              className="w-full"
              value={filters.confidenceRange.min}
              onChange={(e) =>
                handleFilterChange("confidenceRange", {
                  ...filters.confidenceRange,
                  min: parseFloat(e.target.value),
                })
              }
            />
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              className="w-full"
              value={filters.confidenceRange.max}
              onChange={(e) =>
                handleFilterChange("confidenceRange", {
                  ...filters.confidenceRange,
                  max: parseFloat(e.target.value),
                })
              }
            />
          </div>
        </div>

        {/* Verified Only Toggle */}
        <div>
          <label className="flex items-center text-sm">
            <input
              type="checkbox"
              className="mr-2 rounded focus:ring-accent-500"
              checked={filters.verifiedOnly}
              onChange={(e) =>
                handleFilterChange("verifiedOnly", e.target.checked)
              }
            />
            Verified Incidents Only
          </label>
        </div>
      </div>
    </motion.div>
  );
}
