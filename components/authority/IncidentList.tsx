import { motion } from "framer-motion";
import { Clock, AlertTriangle, CheckCircle } from "lucide-react";
import { Incident } from "@/lib/authority-types";
import {
  formatTimeAgo,
  getSeverityColor,
  getEventTypeIcon,
} from "../../lib/utils";

interface IncidentListProps {
  incidents: Incident[];
  selectedIncident: Incident | null;
  onSelectIncident: (incident: Incident) => void;
  onQuickAction: (action: string, payload?: any) => void;
}

export default function IncidentList({
  incidents,
  selectedIncident,
  onSelectIncident,
  onQuickAction,
}: IncidentListProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "open":
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case "acknowledged":
        return <CheckCircle className="w-4 h-4 text-yellow-500" />;
      case "dispatched":
        return <CheckCircle className="w-4 h-4 text-blue-500" />;
      case "published":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "closed":
        return <CheckCircle className="w-4 h-4 text-gray-500" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="flex-1 overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <h2 className="font-semibold text-lg text-gray-900">Incidents</h2>
        <p className="text-sm text-gray-600">
          {incidents.length} total incidents
        </p>
      </div>

      <div className="flex-1 overflow-y-auto">
        {incidents.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            <AlertTriangle className="mx-auto mb-2 h-8 w-8" />
            <p>No incidents found</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {incidents.map((incident, index) => (
              <motion.div
                key={incident.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                  selectedIncident?.id === incident.id
                    ? "bg-primary-50 border-r-2 border-primary-500"
                    : ""
                }`}
                onClick={() => onSelectIncident(incident)}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">
                      {getEventTypeIcon(incident.eventType)}
                    </span>
                    <span className="text-xs font-mono text-gray-500">
                      {incident.id}
                    </span>
                    {getStatusIcon(incident.status)}
                  </div>
                  <div className="flex items-center text-xs text-gray-500">
                    <Clock className="w-3 h-3 mr-1" />
                    {formatTimeAgo(incident.timestamp)}
                  </div>
                </div>

                <h4 className="font-medium text-sm mb-1">{incident.title}</h4>

                <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                  {incident.location.address}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${getSeverityColor(
                        incident.severity
                      )}`}
                    >
                      {incident.severity.toUpperCase()}
                    </span>
                    <span className="text-xs text-green-600 font-medium">
                      {Math.round(incident.confidence * 100)}% confidence
                    </span>
                  </div>

                  {incident.status === "open" && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onQuickAction("acknowledge");
                      }}
                      className="text-xs bg-accent-500 text-white px-2 py-1 rounded hover:bg-accent-600 transition-colors"
                    >
                      Quick Ack
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
