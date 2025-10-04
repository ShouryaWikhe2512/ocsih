import { useEffect } from "react";
import { Report } from "@/lib/types";
import { AnalyticsService } from "@/lib/analytics";
import {
  X,
  Check,
  AlertTriangle,
  Camera,
  MapPin,
  Clock,
  ArrowUpRight,
} from "lucide-react";

interface DetailDrawerProps {
  report: Report;
  onClose: () => void;
  onAction: (reportId: string, action: "verify" | "reject") => void;
  onMediaClick: (src: string) => void;
}

// export default function DetailDrawer({
//   report,
//   onClose,
//   onAction,
//   onMediaClick,
// }: DetailDrawerProps) {
//   const getTrustColor = (trust: number) => {
//     if (trust >= 0.8) return "bg-green-100 text-green-800";
//     if (trust >= 0.6) return "bg-yellow-100 text-yellow-800";
//     return "bg-red-100 text-red-800";
//   };

//   const getStatusColor = (status: Report["status"]) => {
//     switch (status) {
//       case "new":
//         return "bg-blue-100 text-blue-800";
//       case "in_review":
//         return "bg-yellow-100 text-yellow-800";
//       case "verified":
//         return "bg-green-100 text-green-800";
//       case "rejected":
//         return "bg-red-100 text-red-800";
//     }
//   };

//   const canTakeAction =
//     report.status === "new" || report.status === "in_review";

//   return (
//     <div className="w-[28rem] bg-white border-l border-gray-200 flex flex-col h-full">
//       {/* Header */}
//       <div className="p-4 border-b border-gray-200">
//         <h2 className="font-semibold text-lg">Report Details</h2>
//       </div>

//       {/* Content */}
//       <div className="flex-1 overflow-y-auto p-4">
//         {/* Status & Trust */}
//         <div className="flex items-center justify-between mb-4">
//           <span
//             className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
//               report.status
//             )}`}
//           >
//             {report.status.replace("_", " ").toUpperCase()}
//           </span>
//           <span
//             className={`px-3 py-1 rounded-full text-sm font-medium ${getTrustColor(
//               report.trust
//             )}`}
//           >
//             Trust: {Math.round(report.trust * 100)}%
//           </span>
//         </div>

//         {/* Event Type */}
//         <div className="mb-4">
//           <h3 className="font-medium text-gray-900 capitalize text-lg">
//             {report.eventType.replace("_", " ")}
//           </h3>
//         </div>

//         {/* Description */}
//         <div className="mb-4">
//           <h4 className="font-medium text-gray-700 mb-2">Description</h4>
//           <p className="text-gray-600 text-sm leading-relaxed">{report.text}</p>
//         </div>

//         {/* Location & Time */}
//         <div className="grid grid-cols-1 gap-3 mb-4">
//           <div className="flex items-start space-x-2">
//             <MapPin className="w-4 h-4 text-gray-500 mt-0.5" />
//             <div>
//               <p className="text-sm font-medium">Location</p>
//               <p className="text-xs text-gray-600">
//                 {report.exifData?.location}
//               </p>
//               <p className="text-xs text-gray-500">
//                 {report.lat.toFixed(6)}, {report.lng.toFixed(6)}
//               </p>
//             </div>
//           </div>

//           <div className="flex items-start space-x-2">
//             <Clock className="w-4 h-4 text-gray-500 mt-0.5" />
//             <div>
//               <p className="text-sm font-medium">Timestamp</p>
//               <p className="text-xs text-gray-600">
//                 {new Date(report.timestamp).toLocaleString()}
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* EXIF Data */}
//         {report.exifData && (
//           <div className="mb-4">
//             <h4 className="font-medium text-gray-700 mb-2">EXIF Data</h4>
//             <div className="bg-gray-50 p-3 rounded text-xs space-y-1">
//               <p>
//                 <span className="font-medium">Device:</span>{" "}
//                 {report.exifData.device}
//               </p>
//               <p>
//                 <span className="font-medium">Location:</span>{" "}
//                 {report.exifData.location}
//               </p>
//               <p>
//                 <span className="font-medium">Timestamp:</span>{" "}
//                 {new Date(report.exifData.timestamp).toLocaleString()}
//               </p>
//             </div>
//           </div>
//         )}

// {/* Validation Reasons */}
// {report.validationReasons && report.validationReasons.length > 0 && (
//   <div className="mb-4">
//     <h4 className="font-medium text-gray-700 mb-2">
//       Validation Factors
//     </h4>
//     <div className="space-y-1">
//       {report.validationReasons.map((reason, index) => (
//         <div
//           key={index}
//           className="flex items-center space-x-2 text-sm"
//         >
//           <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
//           <span className="text-gray-600">{reason}</span>
//         </div>
//       ))}
//     </div>
//   </div>
// )}

//         {/* Media */}
//         {report.media.length > 0 && (
//           <div className="mb-6">
//             <h4 className="font-medium text-gray-700 mb-2 flex items-center">
//               <Camera className="w-4 h-4 mr-1" />
//               Media ({report.media.length})
//             </h4>
//             <div className="grid grid-cols-2 gap-2">
//               {report.media.map((src, index) => (
//                 <div
//                   key={index}
//                   className="aspect-square bg-gray-100 rounded cursor-pointer hover:opacity-75 transition-opacity"
//                   onClick={() => onMediaClick(src)}
//                 >
//                   <div className="w-full h-full flex items-center justify-center">
//                     <Camera className="w-8 h-8 text-gray-400" />
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Actions */}
//       {canTakeAction && (
//         <div className="p-4 border-t border-gray-200 bg-gray-50">
//           <div className="flex space-x-2">
//             <button
//               onClick={() => onAction(report.id, "verify")}
//               className="flex-1 bg-green-600 text-white px-4 py-2 rounded font-medium hover:bg-green-700 transition-colors flex items-center justify-center"
//             >
//               <Check className="w-4 h-4 mr-1" />
//               Verify (V)
//             </button>
//             <button
//               onClick={() => onAction(report.id, "reject")}
//               className="flex-1 bg-red-600 text-white px-4 py-2 rounded font-medium hover:bg-red-700 transition-colors flex items-center justify-center"
//             >
//               <AlertTriangle className="w-4 h-4 mr-1" />
//               Reject (R)
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

export default function DetailDrawer({
  report,
  onClose,
  onAction,
  onMediaClick,
}: DetailDrawerProps) {
  // Track report view when component mounts
  useEffect(() => {
    AnalyticsService.trackReportView(report.id, report.eventType);
  }, [report.id, report.eventType]);
  const getTrustColor = (trust: number) => {
    if (trust >= 0.8) return "bg-green-100 text-green-800";
    if (trust >= 0.6) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  const getStatusColor = (status: Report["status"]) => {
    switch (status) {
      case "new":
        return "bg-blue-100 text-blue-800";
      case "in_review":
        return "bg-yellow-100 text-yellow-800";
      case "verified":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
    }
  };

  const canTakeAction =
    report.status === "new" || report.status === "in_review";

  return (
    <div
      className="
        w-full h-full
        bg-white
        flex flex-col
      "
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <h2 className="font-semibold text-lg">Report Details</h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          ✕
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        {/* Status & Trust */}
        <div className="flex items-center justify-between mb-4">
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
              report.status
            )}`}
          >
            {report.status.replace("_", " ").toUpperCase()}
          </span>
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${getTrustColor(
              report.trust
            )}`}
          >
            Trust: {Math.round(report.trust * 100)}%
          </span>
        </div>

        {/* Escalation Info */}
        {report.escalatedTo && (
          <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="font-medium text-blue-900 mb-1">Escalated To</h4>
            <p className="text-blue-800 font-semibold">{report.escalatedTo}</p>
            {report.escalationNotes && (
              <p className="text-blue-600 text-sm mt-1">
                Notes: {report.escalationNotes}
              </p>
            )}
          </div>
        )}

        {/* Event Type */}
        <div className="mb-4">
          <h3 className="font-medium text-gray-900 capitalize text-lg">
            {report.eventType.replace("_", " ")}
          </h3>
        </div>

        {/* Description */}
        <div className="mb-4">
          <h4 className="font-medium text-gray-700 mb-2">Description</h4>
          <p className="text-gray-600 text-sm leading-relaxed">{report.text}</p>
        </div>

        {/* Location & Time */}
        <div className="grid grid-cols-1 gap-3 mb-4">
          {/* Location */}
          <div className="flex items-start space-x-2">
            <MapPin className="w-4 h-4 text-gray-500 mt-0.5" />
            <div>
              <p className="text-sm font-medium">Location</p>
              <p className="text-xs text-gray-600">
                {report.exifData?.location}
              </p>
              <p className="text-xs text-gray-500">
                {report.lat.toFixed(6)}, {report.lng.toFixed(6)}
              </p>
            </div>
          </div>

          {/* Timestamp */}
          <div className="flex items-start space-x-2">
            <Clock className="w-4 h-4 text-gray-500 mt-0.5" />
            <div>
              <p className="text-sm font-medium">Timestamp</p>
              <p className="text-xs text-gray-600">
                {new Date(report.timestamp).toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* EXIF Data */}
        {report.exifData && (
          <div className="mb-4">
            <h4 className="font-medium text-gray-700 mb-2">EXIF Data</h4>
            <div className="bg-gray-50 p-3 rounded text-xs space-y-1">
              <p>
                <span className="font-medium">Device:</span>{" "}
                {report.exifData.device}
              </p>
              <p>
                <span className="font-medium">Location:</span>{" "}
                {report.exifData.location}
              </p>
              <p>
                <span className="font-medium">Timestamp:</span>{" "}
                {new Date(report.exifData.timestamp).toLocaleString()}
              </p>
            </div>
          </div>
        )}

        {/* Validation Reasons */}
        {report.validationReasons && report.validationReasons.length > 0 && (
          <div className="mb-4">
            <h4 className="font-medium text-gray-700 mb-2">
              Validation Factors
            </h4>
            <div className="space-y-1">
              {report.validationReasons.map((reason, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-2 text-sm"
                >
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                  <span className="text-gray-600">{reason}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Media */}
        {report.media.length > 0 && (
          <div className="mb-6">
            <h4 className="font-medium text-gray-700 mb-2 flex items-center">
              <Camera className="w-4 h-4 mr-1" />
              Media ({report.media.length})
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {report.media.map((src, index) => (
                <div
                  key={index}
                  className="aspect-square bg-gray-100 rounded cursor-pointer hover:opacity-75 transition-opacity overflow-hidden relative"
                  onClick={() => {
                    AnalyticsService.trackMediaInteraction(report.id, "view");
                    onMediaClick(src);
                  }}
                >
                  <img
                    src={src}
                    alt={`Evidence ${index + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // Fallback to camera icon if image fails to load
                      const target = e.target as HTMLImageElement;
                      target.style.display = "none";
                      const fallback = target.nextElementSibling as HTMLElement;
                      if (fallback) fallback.style.display = "flex";
                    }}
                  />
                  <div
                    className="absolute inset-0 flex items-center justify-center bg-gray-100"
                    style={{ display: "none" }}
                  >
                    <Camera className="w-8 h-8 text-gray-400" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      {canTakeAction && (
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="flex space-x-2">
            <button
              onClick={() => onAction(report.id, "verify")}
              className="flex-1 bg-green-600 text-white px-4 py-2 rounded font-medium hover:bg-green-700 transition-colors flex items-center justify-center"
            >
              <Check className="w-4 h-4 mr-1" />
              Verify (V)
            </button>
            <button
              onClick={() => onAction(report.id, "reject")}
              className="flex-1 bg-red-600 text-white px-4 py-2 rounded font-medium hover:bg-red-700 transition-colors flex items-center justify-center"
            >
              <AlertTriangle className="w-4 h-4 mr-1" />
              Reject (R)
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
