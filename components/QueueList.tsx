import { Report } from "@/lib/types";
import { Clock, AlertTriangle, Shield, FileText } from "lucide-react";

interface QueueListProps {
  reports: Report[];
  selectedReport: Report | null;
  onSelectReport: (report: Report) => void;
}

export default function QueueList({
  reports,
  selectedReport,
  onSelectReport,
}: QueueListProps) {
  const getStatusBadge = (status: Report["status"]) => {
    switch (status) {
      case "new":
        return (
          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-semibold border border-blue-200">
            New Crime
          </span>
        );
      case "in_review":
        return (
          <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full font-semibold border border-yellow-200">
            Under Review
          </span>
        );
      default:
        return null;
    }
  };

  const getTrustColor = (trust: number) => {
    if (trust >= 0.8) return "text-green-600";
    if (trust >= 0.6) return "text-yellow-600";
    return "text-red-600";
  };

  const getTimeAgo = (timestamp: string) => {
    const diff = Date.now() - new Date(timestamp).getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor(diff / (1000 * 60));

    if (hours > 0) return `${hours}h ago`;
    return `${minutes}m ago`;
  };

  return (
    <div className="flex-1 overflow-hidden">
      <div className="p-4 border-b-2 border-blue-200 bg-blue-50">
        <h2 className="font-bold text-lg text-blue-900">Investigation Queue</h2>
        <p className="text-sm text-blue-700 font-medium">
          {reports.length} pending crime reports
        </p>
      </div>

      <div className="flex-1 overflow-y-auto">
        {reports.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            <Shield className="mx-auto mb-2 h-8 w-8 text-green-500" />
            <p className="font-medium">No crime reports in queue</p>
            <p className="text-xs text-gray-400 mt-1">All clear!</p>
          </div>
        ) : (
          <div className="divide-y divide-blue-100">
            {reports.map((report) => (
              <div
                key={report.id}
                className={`p-4 cursor-pointer hover:bg-blue-50 transition-all duration-200 ${
                  selectedReport?.id === report.id
                    ? "bg-blue-100 border-r-4 border-blue-600 shadow-sm"
                    : ""
                }`}
                onClick={() => onSelectReport(report)}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center space-x-2">
                    {getStatusBadge(report.status)}
                    <span
                      className={`text-sm font-bold ${getTrustColor(
                        report.trust
                      )}`}
                    >
                      {Math.round(report.trust * 100)}% Reliable
                    </span>
                  </div>
                  <div className="flex items-center text-xs text-gray-600 font-medium">
                    <Clock className="w-3 h-3 mr-1" />
                    {getTimeAgo(report.timestamp)}
                  </div>
                </div>

                <h4 className="font-bold text-sm mb-1 capitalize text-blue-900">
                  {report.eventType?.replace("_", " ") || "Crime Report"}
                </h4>

                <p className="text-xs text-gray-700 line-clamp-2 font-medium">
                  {report.text ||
                    report.description ||
                    "No description available"}
                </p>

                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-gray-600 font-medium">
                    📍 {report.exifData?.location || "Location unknown"}
                  </span>
                  {report.media.length > 0 && (
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full font-semibold border border-blue-200">
                      📷 {report.media.length} evidence
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
