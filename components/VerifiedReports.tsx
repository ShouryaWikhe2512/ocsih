import { useState, useEffect } from "react";
import { Report } from "@/lib/types";
import {
  Check,
  AlertTriangle,
  ArrowUpRight,
  Clock,
  MapPin,
  User,
} from "lucide-react";

interface VerifiedReportsProps {
  reports: Report[];
  onReportSelect: (report: Report) => void;
}

export default function VerifiedReports({
  reports,
  onReportSelect,
}: VerifiedReportsProps) {
  const [filteredReports, setFilteredReports] = useState<Report[]>([]);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);

  // Filter verified reports
  useEffect(() => {
    const verified = reports.filter((report) => report.status === "verified");
    setFilteredReports(verified);
  }, [reports]);

  const getEscalationDepartment = (category: string) => {
    const mapping: Record<string, string> = {
      SEXUAL_VIOLENCE: "Women's Cell",
      DOMESTIC_VIOLENCE: "Women's Cell",
      STREET_CRIMES: "Crime Branch",
      MOB_VIOLENCE_LYNCHING: "Law & Order Division",
      ROAD_RAGE_INCIDENTS: "Traffic Police",
      CYBERCRIMES: "Cyber Crime Cell",
      DRUG: "Anti Narcotics Cell",
    };
    return mapping[category] || "General Department";
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "CRITICAL":
        return "bg-red-100 text-red-800";
      case "HIGH":
        return "bg-orange-100 text-orange-800";
      case "MEDIUM":
        return "bg-yellow-100 text-yellow-800";
      case "LOW":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleReportClick = (report: Report) => {
    setSelectedReport(report);
    onReportSelect(report);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200 h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-green-900">
              Verified Reports
            </h2>
            <p className="text-sm text-gray-600">Escalation Management</p>
          </div>
          <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
            {filteredReports.length} Reports
          </div>
        </div>
      </div>

      {/* Reports List */}
      <div className="flex-1 overflow-y-auto">
        {filteredReports.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500">
            <div className="text-center">
              <Check className="w-12 h-12 mx-auto mb-2 text-gray-300" />
              <p>No verified reports yet</p>
            </div>
          </div>
        ) : (
          <div className="p-4 space-y-3">
            {filteredReports.map((report) => (
              <div
                key={report.id}
                onClick={() => handleReportClick(report)}
                className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md ${
                  selectedReport?.id === report.id
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                {/* Report Header */}
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 capitalize">
                      {report.eventType?.replace("_", " ") || "Unknown Crime"}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                      {report.text ||
                        report.description ||
                        "No description available"}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2 ml-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(
                        report.priorityLevel || "MEDIUM"
                      )}`}
                    >
                      {report.priorityLevel || "MEDIUM"}
                    </span>
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      VERIFIED
                    </span>
                  </div>
                </div>

                {/* Report Details */}
                <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span className="truncate">
                      {report.location?.address || "Unknown Location"}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    <span>
                      {new Date(report.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* Escalation Info - Read Only */}
                {report.escalatedTo ? (
                  <div className="mt-3 p-2 bg-green-50 rounded border border-green-200">
                    <div className="flex items-center">
                      <ArrowUpRight className="w-4 h-4 mr-1 text-green-600" />
                      <span className="text-sm font-medium text-green-800">
                        Escalated to: {report.escalatedTo}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="mt-3 p-2 bg-gray-50 rounded border border-gray-200">
                    <div className="flex items-center">
                      <ArrowUpRight className="w-4 h-4 mr-1 text-gray-600" />
                      <span className="text-sm font-medium text-gray-800">
                        Suggested Department:{" "}
                        {getEscalationDepartment(report.eventType || "")}
                      </span>
                    </div>
                    <div className="text-xs text-gray-600 mt-1">
                      Ready for escalation by authorized personnel
                    </div>
                  </div>
                )}

                {/* Media Count */}
                {report.media && report.media.length > 0 && (
                  <div className="mt-2 flex items-center text-sm text-gray-500">
                    <span>{report.media.length} media file(s)</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
