import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  ChevronUp,
  Clock,
  User,
  AlertTriangle,
} from "lucide-react";
import { mockSopMappings } from "@/lib/authority-data";

interface SopCardProps {
  eventType: string;
  severity: string;
}

export default function SopCard({ eventType, severity }: SopCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Find matching SOP
  const sopMapping =
    mockSopMappings.find(
      (sop) => sop.eventType === eventType && sop.severity === severity
    ) || mockSopMappings[0]; // Fallback to first SOP

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "immediate":
        return "text-red-700 bg-red-100";
      case "urgent":
        return "text-orange-700 bg-orange-100";
      case "normal":
        return "text-green-700 bg-green-100";
      default:
        return "text-gray-700 bg-gray-100";
    }
  };

  return (
    <motion.div
      className="mb-4"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full p-3 bg-primary-50 hover:bg-primary-100 transition-colors flex items-center justify-between"
        >
          <div className="flex items-center">
            <AlertTriangle className="w-4 h-4 text-primary-600 mr-2" />
            <span className="font-medium text-gray-900">
              Standard Operating Procedures
            </span>
          </div>
          {isExpanded ? (
            <ChevronUp className="w-4 h-4 text-gray-600" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-600" />
          )}
        </button>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="p-4 bg-white">
                <div className="text-sm text-gray-600 mb-3">
                  Recommended actions for{" "}
                  <strong>{eventType.replace("_", " ")}</strong> incidents with{" "}
                  <strong>{severity}</strong> severity:
                </div>

                <div className="space-y-3">
                  {sopMapping.steps.map((step, index) => (
                    <div
                      key={step.step}
                      className="flex items-start space-x-3 p-2 rounded-lg bg-gray-50"
                    >
                      <div className="flex-shrink-0 w-6 h-6 bg-accent-500 text-white rounded-full flex items-center justify-center text-xs font-medium">
                        {step.step}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-sm font-medium text-gray-900">
                            {step.action}
                          </p>
                          <span
                            className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(
                              step.priority
                            )}`}
                          >
                            {step.priority.toUpperCase()}
                          </span>
                        </div>
                        <div className="flex items-center text-xs text-gray-600 space-x-4">
                          <div className="flex items-center">
                            <User className="w-3 h-3 mr-1" />
                            {step.responsible}
                          </div>
                          <div className="flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            {step.timeframe}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Emergency Contacts */}
                {sopMapping.contacts.length > 0 && (
                  <div className="mt-4 pt-3 border-t border-gray-200">
                    <h5 className="font-medium text-sm text-gray-900 mb-2">
                      Emergency Coordination
                    </h5>
                    <div className="space-y-2">
                      {sopMapping.contacts.map((contact, index) => (
                        <div
                          key={index}
                          className="text-sm bg-accent-50 p-2 rounded"
                        >
                          <div className="font-medium text-accent-900">
                            {contact.name}
                          </div>
                          <div className="text-accent-700 text-xs">
                            {contact.role} • {contact.phone}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
