import { useState } from "react";
import { motion } from "framer-motion";
import { Download, FileText } from "lucide-react";
import { Incident } from "@/lib/authority-types";
import { generatePDF } from "@/lib/export-utils";

interface ExportControlsProps {
  incident: Incident;
}

export default function ExportControls({ incident }: ExportControlsProps) {
  const [isExporting, setIsExporting] = useState<string | null>(null);

  const handleExport = async (type: string) => {
    setIsExporting(type);

    try {
      if (type === "pdf") {
        generatePDF(incident);
      }
    } catch (error) {
      console.error(`Error exporting ${type}:`, error);
    } finally {
      setTimeout(() => setIsExporting(null), 1000);
    }
  };

  const exportOptions = [
    {
      type: "pdf",
      label: "PDF Report",
      icon: FileText,
      description: "Official incident report",
      color: "text-red-600",
    },
  ];

  return (
    <motion.div
      className="mb-4"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <h4 className="font-medium text-gray-700 mb-3 flex items-center">
        <Download className="w-4 h-4 mr-1" />
        Export Options
      </h4>

      <div className="grid grid-cols-2 gap-2">
        {exportOptions.map((option) => {
          const Icon = option.icon;
          const isLoading = isExporting === option.type;

          return (
            <motion.button
              key={option.type}
              onClick={() => handleExport(option.type)}
              disabled={isLoading}
              className={`p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left ${
                isLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              whileHover={{ scale: isLoading ? 1 : 1.02 }}
              whileTap={{ scale: isLoading ? 1 : 0.98 }}
            >
              <div className="flex items-center mb-1">
                {isLoading ? (
                  <div className="w-4 h-4 mr-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-300 border-t-accent-600"></div>
                  </div>
                ) : (
                  <Icon className={`w-4 h-4 mr-2 ${option.color}`} />
                )}
                <span className="text-sm font-medium text-gray-900">
                  {option.label}
                </span>
              </div>
              <p className="text-xs text-gray-600">{option.description}</p>
            </motion.button>
          );
        })}
      </div>

      <div className="mt-3 p-2 bg-yellow-50 rounded text-xs text-yellow-800">
        <strong>Note:</strong> Exports are generated client-side for
        demonstration. In production, these would be server-generated with
        proper formatting and security.
      </div>
    </motion.div>
  );
}
