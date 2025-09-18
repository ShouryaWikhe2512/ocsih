"use client";
import { useState, useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Line,
  ResponsiveContainer,
} from "recharts";
import { mockReports } from "@/lib/mock-data";

interface Props {
  bucket?: "hour" | "day";
  periodHours?: number;
  height?: number;
}

export default function TimeSeriesStackedArea({
  bucket = "hour",
  periodHours = 168,
  height = 300,
}: Props) {
  const [visible, setVisible] = useState({
    high_wave: true,
    flood: true,
    unusual_tide: true,
    avgTrust: true,
  });

  // Toggle helper
  const toggle = (key: keyof typeof visible) => {
    setVisible((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const data = useMemo(() => {
    const now = Date.now();
    const bucketMs = bucket === "hour" ? 3600 * 1000 : 24 * 3600 * 1000;
    const cutoff = now - periodHours * 3600 * 1000;

    const grouped: Record<string, any> = {};
    mockReports.forEach((r) => {
      const t = new Date(r.timestamp).getTime();
      if (t < cutoff) return;

      const bucketKey = Math.floor(t / bucketMs) * bucketMs;
      if (!grouped[bucketKey]) {
        grouped[bucketKey] = {
          time: new Date(bucketKey).toLocaleString("en-IN", {
            day: "2-digit",
            month: "short",
            hour: "2-digit",
          }),
          high_wave: 0,
          flood: 0,
          unusual_tide: 0,
          trustValues: [] as number[],
        };
      }

      grouped[bucketKey][r.eventType] += 1;
      grouped[bucketKey].trustValues.push(r.trust);
    });

    return Object.values(grouped).map((d: any) => ({
      ...d,
      avgTrust:
        d.trustValues.length > 0
          ? d.trustValues.reduce((a, b) => a + b, 0) / d.trustValues.length
          : 0,
    }));
  }, [bucket, periodHours]);

  return (
    <div className="space-y-4">
      {/* Toggle controls */}
      <div className="flex flex-wrap gap-2">
        {Object.keys(visible).map((key) => (
          <button
            key={key}
            onClick={() => toggle(key as keyof typeof visible)}
            className={`px-3 py-1 rounded-md text-sm transition ${
              visible[key as keyof typeof visible]
                ? "bg-[#4FB7B3] text-white"
                : "bg-gray-200 text-gray-600"
            }`}
          >
            {key.replace("_", " ")}
          </button>
        ))}
      </div>

      <div style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <Legend />

            {/* Conditionally render based on toggles */}
            {visible.high_wave && (
              <Area
                type="monotone"
                dataKey="high_wave"
                stackId="1"
                stroke="#4FB7B3"
                fill="#4FB7B3"
                fillOpacity={0.6}
              />
            )}
            {visible.flood && (
              <Area
                type="monotone"
                dataKey="flood"
                stackId="1"
                stroke="#60A5FA"
                fill="#60A5FA"
                fillOpacity={0.6}
              />
            )}
            {visible.unusual_tide && (
              <Area
                type="monotone"
                dataKey="unusual_tide"
                stackId="1"
                stroke="#FBBF24"
                fill="#FBBF24"
                fillOpacity={0.6}
              />
            )}
            {visible.avgTrust && (
              <Line
                type="monotone"
                dataKey="avgTrust"
                stroke="#1E293B"
                strokeWidth={2}
                dot={false}
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
