import { KPIData } from "@/lib/types";
import {
  FileText,
  CheckCircle,
  Clock,
  XCircle,
  Shield,
  AlertTriangle,
} from "lucide-react";

interface KpiCardsProps {
  data: KPIData;
}

export default function KpiCards({ data }: KpiCardsProps) {
  const cards = [
    {
      title: "Crime Reports",
      value: data.totalReports,
      icon: FileText,
      color: "text-blue-700",
      bgColor: "bg-blue-100",
      borderColor: "border-blue-200",
    },
    {
      title: "Verified Cases",
      value: data.verifiedReports,
      icon: CheckCircle,
      color: "text-green-700",
      bgColor: "bg-green-100",
      borderColor: "border-green-200",
    },
    {
      title: "Under Investigation",
      value: data.pendingReports,
      icon: Clock,
      color: "text-yellow-700",
      bgColor: "bg-yellow-100",
      borderColor: "border-yellow-200",
    },
    {
      title: "False Reports",
      value: data.rejectedReports,
      icon: XCircle,
      color: "text-red-700",
      bgColor: "bg-red-100",
      borderColor: "border-red-200",
    },
  ];

  return (
    <div className="flex space-x-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.title}
            className={`${card.bgColor} ${card.borderColor} border-2 p-4 rounded-xl min-w-[120px] shadow-sm hover:shadow-md transition-all duration-200`}
          >
            <div className="flex items-center">
              <Icon className={`w-6 h-6 ${card.color} mr-3`} />
              <div>
                <p className="text-sm font-semibold text-gray-700">
                  {card.title}
                </p>
                <p className={`text-xl font-bold ${card.color}`}>
                  {card.value}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
