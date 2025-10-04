"use client";

import { useEffect, useRef } from "react";
import type { Map as LeafletMap, LayerGroup, CircleMarker } from "leaflet";
import { Report } from "@/lib/types";
import { calculateTrustWeightedIntensity } from "@/lib/mock-data";
import { AnalyticsService } from "@/lib/analytics";

// NOTE: we import the CSS dynamically inside useEffect to avoid SSR issues.

interface MapPanelProps {
  reports: Report[];
  selectedReport: Report | null;
  onSelectReport: (report: Report) => void;
}

export default function MapPanel({
  reports,
  selectedReport,
  onSelectReport,
}: MapPanelProps) {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const markersRef = useRef<LayerGroup | null>(null);
  const heatLayerRef = useRef<any>(null);

  useEffect(() => {
    let mounted = true;

    (async () => {
      if (!mapContainer.current) return;

      const LModule = await import("leaflet");
      await import("leaflet/dist/leaflet.css");
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      await import("leaflet.heat");

      const L = LModule.default ?? LModule;

      // Default center: India (approximate center). Zoom is country-level.
      const INDIA_CENTER: [number, number] = [20.5937, 78.9629];
      const INDIA_ZOOM = 5;

      // Initialize map only once
      if (!mapRef.current && mounted) {
        mapRef.current = L.map(mapContainer.current, {
          center: INDIA_CENTER,
          zoom: INDIA_ZOOM,
          preferCanvas: true,
          attributionControl: false,
        });

        // OSM tiles
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          maxZoom: 19,
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }).addTo(mapRef.current);

        // create a layergroup to manage markers
        markersRef.current = L.layerGroup().addTo(mapRef.current);
      }
    })();

    return () => {
      mounted = false;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
      markersRef.current = null;
      heatLayerRef.current = null;
    };
  }, []);

  // Auto-fly to selected report when it changes (from outside click/queue)
  useEffect(() => {
    if (mapRef.current && selectedReport) {
      const { lat, lng } = selectedReport;
      if (typeof lat === "number" && typeof lng === "number") {
        mapRef.current.flyTo(
          [lat, lng],
          Math.max(mapRef.current.getZoom(), 10),
          {
            animate: true,
            duration: 0.6,
          }
        );
      }
    }
  }, [selectedReport]);

  // Fix tile loading issues on container resize
  useEffect(() => {
    const handleResize = () => {
      if (mapRef.current) {
        mapRef.current.invalidateSize();
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Update markers + heatmap when reports or selection change
  useEffect(() => {
    (async () => {
      if (!mapRef.current) return;

      const LModule = await import("leaflet");
      const L = LModule.default ?? LModule;

      // Ensure markers layer exists
      if (!markersRef.current) {
        markersRef.current = L.layerGroup().addTo(mapRef.current!);
      }

      // Clear existing markers
      markersRef.current.clearLayers();

      // Build heat data
      const heatPoints: [number, number, number][] = [];
      const latLngPairs: [number, number][] = [];

      reports.forEach((report) => {
        const intensity = calculateTrustWeightedIntensity(report); // 0..1
        const lat = report.lat;
        const lng = report.lng;

        // Validate numeric coords
        if (
          typeof lat !== "number" ||
          typeof lng !== "number" ||
          Number.isNaN(lat) ||
          Number.isNaN(lng)
        ) {
          return;
        }

        // push heat point: [lat, lng, intensity]
        heatPoints.push([lat, lng, Math.max(0.1, intensity)]);
        latLngPairs.push([lat, lng]);

        // marker color based on event type (you can change this to status-based if preferred)
        const fillColor = getEventTypeColor(report.eventType);

        // Alternative: Status-based colors (uncomment to use instead)
        // const fillColor = getStatusColor(report.status);

        // Debug logging to help identify event types
        console.log(
          `Report ${report.id}: eventType="${report.eventType}", status="${report.status}", color="${fillColor}"`
        );

        // scale radius with intensity (make markers more visible)
        const radius = 8 + intensity * 20;

        const marker = L.circleMarker([lat, lng], {
          radius,
          fillColor,
          color: "#ffffff",
          weight: 2,
          opacity: 1,
          fillOpacity: 0.8,
        }) as CircleMarker;

        // popup content
        const popupHtml = `
          <div style="font-size:13px;line-height:1.2">
            <div style="font-weight:700;margin-bottom:6px">${report.eventType
              .replace("_", " ")
              .toUpperCase()}</div>
            <div style="color:#6b7280;margin-bottom:8px">${escapeHtml(
              report.text.substring(0, 150)
            )}...</div>
            <div style="display:flex;justify-content:space-between;font-size:12px">
              <span style="color:#059669">Trust: ${Math.round(
                report.trust * 100
              )}%</span>
              <span style="color:#6b7280">${new Date(
                report.timestamp
              ).toLocaleString()}</span>
            </div>
          </div>
        `;

        marker.bindPopup(popupHtml, { offset: L.point(0, -radius) });

        marker.on("click", () => {
          // Track map interaction
          AnalyticsService.trackMapInteraction("marker_click", {
            report_id: report.id,
            event_type: report.eventType,
          });

          onSelectReport(report);
          if (mapRef.current) {
            mapRef.current.flyTo(
              [lat, lng],
              Math.max(mapRef.current.getZoom(), 10),
              {
                animate: true,
                duration: 0.6,
              }
            );
          }
        });

        marker.addTo(markersRef.current!);
      });

      // Fit bounds to reports (if any). This ensures India markers are visible.
      if (latLngPairs.length > 0) {
        try {
          const bounds = L.latLngBounds(latLngPairs as any);
          // If bounds is very small (single point), zoom to a comfortable level:
          if (bounds.isValid()) {
            // Use padding and cap maxZoom so we don't zoom too close for many points
            mapRef.current!.fitBounds(bounds, {
              padding: [60, 60],
              maxZoom: 10,
            });
          }
        } catch (err) {
          // ignore fitBounds errors
        }
      } else {
        // No valid points: center on India default
        mapRef.current!.setView([20.5937, 78.9629], 5);
      }

      // update selection styling
      if (selectedReport && markersRef.current) {
        markersRef.current.eachLayer((layer: any) => {
          if (layer instanceof LModule.default.CircleMarker) {
            const latlng = layer.getLatLng();
            if (
              Math.abs(latlng.lat - selectedReport.lat) < 1e-6 &&
              Math.abs(latlng.lng - selectedReport.lng) < 1e-6
            ) {
              layer.setStyle({
                weight: 2.5,
                color: "#1e40af",
                fillOpacity: 1,
              });
              layer.setRadius((layer.getRadius ? layer.getRadius() : 8) * 1.25);
              layer.bringToFront();
            } else {
              layer.setStyle({
                weight: 1,
                color: "#ffffff",
                fillOpacity: 0.75,
              });
            }
          }
        });
      }

      // Heatmap: dynamic import and update
      try {
        const heatModule = await import("leaflet.heat");
        // @ts-ignore
        const heatLayer =
          heatModule && (heatModule as any).default
            ? (heatModule as any).default(heatPoints, {
                radius: 25,
                blur: 15,
                maxZoom: 15,
                max: 2,
              })
            : // fallback to L.heatLayer
            (L as any).heatLayer
            ? // @ts-ignore
              (L as any).heatLayer(heatPoints, {
                radius: 25,
                blur: 15,
                maxZoom: 15,
                max: 2,
              })
            : null;

        if (heatLayerRef.current && mapRef.current) {
          try {
            mapRef.current.removeLayer(heatLayerRef.current);
          } catch (e) {
            /* noop */
          }
        }

        if (heatLayer) {
          heatLayerRef.current = heatLayer;
          heatLayerRef.current.addTo(mapRef.current);
        }
      } catch (err) {
        // heat plugin not available — ignore
      }
    })();
  }, [reports, selectedReport, onSelectReport]);

  // helper: event type color with comprehensive mapping
  const getEventTypeColor = (eventType: string) => {
    switch (eventType) {
      case "high_wave":
        return "#3b82f6"; // blue
      case "flood":
        return "#ef4444"; // red
      case "unusual_tide":
        return "#10b981"; // green
      case "tsunami":
        return "#dc2626"; // dark red
      case "storm_surge":
        return "#7c3aed"; // purple
      case "coastal_erosion":
        return "#f59e0b"; // amber
      case "cyclone":
        return "#8b5cf6"; // violet
      case "earthquake":
        return "#ef4444"; // red
      case "landslide":
        return "#92400e"; // brown
      case "drought":
        return "#f97316"; // orange
      case "fire":
        return "#dc2626"; // red
      case "storm":
        return "#0ea5e9"; // sky blue
      case "heavy_rain":
        return "#0d9488"; // teal
      case "heatwave":
        return "#f59e0b"; // amber
      case "cold_wave":
        return "#3b82f6"; // blue
      default:
        return "#ef4444"; // red
    }
  };

  // helper: status-based color mapping (alternative option)
  const getStatusColor = (status: string) => {
    switch (status) {
      case "new":
        return "#3b82f6"; // blue
      case "in_review":
        return "#f59e0b"; // amber
      case "verified":
        return "#10b981"; // green
      case "rejected":
        return "#ef4444"; // red
      case "pending":
        return "#6b7280"; // gray
      default:
        return "#6b7280"; // gray
    }
  };

  return (
    <div className="relative h-full">
      <div ref={mapContainer} className="w-full h-full" />
    </div>
  );
}

/* ---------- small util ---------- */
function escapeHtml(unsafe: string) {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
