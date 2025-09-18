import { Report } from "@/lib/types";
import { Clock, AlertTriangle } from "lucide-react";

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
          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
            New
          </span>
        );
      case "in_review":
        return (
          <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
            Review
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
      <div className="p-4 border-b border-gray-200">
        <h2 className="font-semibold text-lg">Verification Queue</h2>
        <p className="text-sm text-gray-600">
          {reports.length} pending reports
        </p>
      </div>

      <div className="flex-1 overflow-y-auto">
        {reports.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            <AlertTriangle className="mx-auto mb-2 h-8 w-8" />
            <p>No reports in queue</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {reports.map((report) => (
              <div
                key={report.id}
                className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                  selectedReport?.id === report.id
                    ? "bg-blue-50 border-r-2 border-blue-500"
                    : ""
                }`}
                onClick={() => onSelectReport(report)}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center space-x-2">
                    {getStatusBadge(report.status)}
                    <span
                      className={`text-sm font-medium ${getTrustColor(
                        report.trust
                      )}`}
                    >
                      {Math.round(report.trust * 100)}%
                    </span>
                  </div>
                  <div className="flex items-center text-xs text-gray-500">
                    <Clock className="w-3 h-3 mr-1" />
                    {getTimeAgo(report.timestamp)}
                  </div>
                </div>

                <h4 className="font-medium text-sm mb-1 capitalize">
                  {report.eventType.replace("_", " ")}
                </h4>

                <p className="text-xs text-gray-600 line-clamp-2">
                  {report.text}
                </p>

                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-gray-500">
                    {report.exifData?.location}
                  </span>
                  {report.media.length > 0 && (
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                      {report.media.length} media
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
