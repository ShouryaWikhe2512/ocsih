import { KPIData } from "@/lib/types";
import { FileText, CheckCircle, Clock, XCircle } from "lucide-react";

interface KpiCardsProps {
  data: KPIData;
}

export default function KpiCards({ data }: KpiCardsProps) {
  const cards = [
    {
      title: "Total Reports",
      value: data.totalReports,
      icon: FileText,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Verified",
      value: data.verifiedReports,
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Pending",
      value: data.pendingReports,
      icon: Clock,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
    },
    {
      title: "Rejected",
      value: data.rejectedReports,
      icon: XCircle,
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
  ];

  return (
    <div className="flex space-x-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.title}
            className={`${card.bgColor} p-3 rounded-lg min-w-[100px]`}
          >
            <div className="flex items-center">
              <Icon className={`w-5 h-5 ${card.color} mr-2`} />
              <div>
                <p className="text-sm font-medium text-gray-600">
                  {card.title}
                </p>
                <p className={`text-lg font-bold ${card.color}`}>
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
