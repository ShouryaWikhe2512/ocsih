import { motion } from "framer-motion";
import {
  FileText,
  CheckCircle,
  Clock,
  TrendingUp,
  Shield,
  AlertTriangle,
} from "lucide-react";
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
      title: "Active Crimes",
      value: openIncidents,
      icon: AlertTriangle,
      color: "text-red-700",
      bgColor: "bg-red-100",
      borderColor: "border-red-200",
      trend: "+2 from yesterday",
    },
    {
      title: "New Today",
      value: newToday,
      icon: TrendingUp,
      color: "text-blue-700",
      bgColor: "bg-blue-100",
      borderColor: "border-blue-200",
      trend: "Last 24 hours",
    },
    {
      title: "Investigation Quality",
      value: `${Math.round(avgConfidence * 100)}%`,
      icon: CheckCircle,
      color: "text-green-700",
      bgColor: "bg-green-100",
      borderColor: "border-green-200",
      trend: "+5% from last week",
    },
    {
      title: "Response Time",
      value: `${medianAcknowledgeTime}m`,
      icon: Clock,
      color: "text-yellow-700",
      bgColor: "bg-yellow-100",
      borderColor: "border-yellow-200",
      trend: "Time to acknowledge",
    },
  ];

  return (
    <div className="bg-white border-b-2 border-blue-200 px-6 py-4 shadow-lg">
      <div className="grid grid-cols-4 gap-6">
        {kpiCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`${card.bgColor} ${card.borderColor} border-2 p-4 rounded-xl shadow-sm hover:shadow-md transition-all duration-200`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-700">
                    {card.title}
                  </p>
                  <p className={`text-2xl font-bold ${card.color}`}>
                    {card.value}
                  </p>
                  <p className="text-xs text-gray-600 mt-1 font-medium">
                    {card.trend}
                  </p>
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
