import { motion } from "framer-motion";
import { FileText, CheckCircle, Clock, TrendingUp } from "lucide-react";
import { Incident } from "@/lib/authority-types";

interface KpiRibbonProps {
  incidents: Incident[];
}

export default function KpiRibbon({ incidents }: KpiRibbonProps) {
  const openIncidents = incidents.filter((i) => i.status === "open").length;
  const acknowledgedIncidents = incidents.filter(
    (i) => i.status === "acknowledged"
  ).length;
  const dispatchedIncidents = incidents.filter(
    (i) => i.status === "dispatched"
  ).length;

  // Calculate incidents from today
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const newToday = incidents.filter(
    (i) => new Date(i.timestamp) >= today
  ).length;

  // Calculate average confidence
  const avgConfidence =
    incidents.length > 0
      ? incidents.reduce((sum, i) => sum + i.confidence, 0) / incidents.length
      : 0;

  // Calculate median acknowledge time (mock calculation)
  const acknowledgedTimes = incidents
    .filter((i) => i.status !== "open")
    .map(() => Math.floor(Math.random() * 120) + 15); // Mock: 15-135 minutes

  const medianAcknowledgeTime =
    acknowledgedTimes.length > 0
      ? acknowledgedTimes.sort((a, b) => a - b)[
          Math.floor(acknowledgedTimes.length / 2)
        ]
      : 0;

  const kpiCards = [
    {
      title: "Open Incidents",
      value: openIncidents,
      icon: FileText,
      color: "text-red-600",
      bgColor: "bg-red-50",
      trend: "+2 from yesterday",
    },
    {
      title: "New Today",
      value: newToday,
      icon: TrendingUp,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      trend: "Last 24 hours",
    },
    {
      title: "Avg Confidence",
      value: `${Math.round(avgConfidence * 100)}%`,
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-50",
      trend: "+5% from last week",
    },
    {
      title: "Median Response",
      value: `${medianAcknowledgeTime}m`,
      icon: Clock,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
      trend: "Time to acknowledge",
    },
  ];

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="grid grid-cols-4 gap-6">
        {kpiCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`${card.bgColor} p-4 rounded-lg`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    {card.title}
                  </p>
                  <p className={`text-2xl font-bold ${card.color}`}>
                    {card.value}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">{card.trend}</p>
                </div>
                <Icon className={`w-8 h-8 ${card.color} opacity-80`} />
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
