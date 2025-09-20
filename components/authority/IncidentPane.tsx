import { useState } from "react";
import { motion } from "framer-motion";
import {
  X,
  MapPin,
  Clock,
  User,
  Phone,
  Mail,
  FileText,
  Image,
  CheckCircle,
  AlertTriangle,
  Truck,
  Megaphone,
  ArrowUp,
  XCircle,
} from "lucide-react";
import { Incident } from "@/lib/authority-types";
import {
  formatTimeAgo,
  getSeverityColor,
  maskPII,
  getStatusColor,
} from "../../lib/utils";
import SopCard from "./SopCard";
import ExportControls from "../authority/ExportControls";

interface IncidentPaneProps {
  incident: Incident;
  onClose: () => void;
  onAction: (action: string, payload?: any) => void;
}

interface ActionModalProps {
  isOpen: boolean;
  action: string;
  onClose: () => void;
  onConfirm: (payload?: any) => void;
}

function ActionModal({ isOpen, action, onClose, onConfirm }: ActionModalProps) {
  const [payload, setPayload] = useState<any>({});

  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm(Object.keys(payload).length ? payload : undefined);
    onClose();
    setPayload({});
  };

  const getActionConfig = () => {
    switch (action) {
      case "acknowledge":
        return {
          title: "Acknowledge Incident",
          icon: CheckCircle,
          color: "green",
        };
      case "dispatch":
        return { title: "Dispatch Teams", icon: Truck, color: "blue" };
      case "publish":
        return { title: "Publish Advisory", icon: Megaphone, color: "purple" };
      case "escalate":
        return { title: "Escalate Incident", icon: ArrowUp, color: "orange" };
      case "close":
        return { title: "Close Incident", icon: XCircle, color: "gray" };
      default:
        return { title: "Confirm Action", icon: CheckCircle, color: "blue" };
    }
  };

  const config = getActionConfig();
  const Icon = config.icon;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4"
      >
        <div className="flex items-center mb-4">
          <Icon className={`w-6 h-6 text-${config.color}-600 mr-3`} />
          <h3 className="text-lg font-semibold">{config.title}</h3>
        </div>

        {action === "dispatch" && (
          <div className="space-y-3 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Teams to Dispatch
              </label>
              <select
                className="w-full p-2 border rounded focus:ring-2 focus:ring-accent-500"
                onChange={(e) =>
                  setPayload({ ...payload, teamIds: [e.target.value] })
                }
              >
                <option value="">Select Team</option>
                <option value="RESCUE-01">Coastal Rescue Team</option>
                <option value="MEDICAL-01">Medical Emergency Team</option>
                <option value="FIRE-01">Fire & Safety Team</option>
                <option value="POLICE-01">Police Response Team</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Instructions
              </label>
              <textarea
                className="w-full p-2 border rounded focus:ring-2 focus:ring-accent-500"
                rows={3}
                placeholder="Special instructions for dispatch team..."
                onChange={(e) =>
                  setPayload({ ...payload, message: e.target.value })
                }
              />
            </div>
          </div>
        )}

        {action === "publish" && (
          <div className="space-y-3 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Publication Channel
              </label>
              <select
                className="w-full p-2 border rounded focus:ring-2 focus:ring-accent-500"
                onChange={(e) =>
                  setPayload({ ...payload, channel: e.target.value })
                }
              >
                <option value="">Select Channel</option>
                <option value="sms">SMS Alert System</option>
                <option value="social">Social Media Platforms</option>
                <option value="radio">Radio Broadcast</option>
                <option value="tv">Television Alert</option>
                <option value="all">All Available Channels</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Template</label>
              <select
                className="w-full p-2 border rounded focus:ring-2 focus:ring-accent-500"
                onChange={(e) =>
                  setPayload({ ...payload, templateId: e.target.value })
                }
              >
                <option value="">Select Template</option>
                <option value="WAVE_ALERT">High Wave Alert</option>
                <option value="FLOOD_WARNING">Flood Warning</option>
                <option value="EVACUATION">Evacuation Notice</option>
                <option value="ALL_CLEAR">All Clear Notice</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Languages
              </label>
              <div className="flex flex-wrap gap-2">
                {[
                  "English",
                  "Hindi",
                  "Tamil",
                  "Telugu",
                  "Malayalam",
                  "Bengali",
                ].map((lang) => (
                  <label key={lang} className="flex items-center text-sm">
                    <input
                      type="checkbox"
                      className="mr-1"
                      defaultChecked={lang === "English" || lang === "Hindi"}
                      onChange={(e) => {
                        const languages = payload.languages || [
                          "English",
                          "Hindi",
                        ];
                        if (e.target.checked) {
                          if (!languages.includes(lang)) languages.push(lang);
                        } else {
                          const index = languages.indexOf(lang);
                          if (index > -1) languages.splice(index, 1);
                        }
                        setPayload({ ...payload, languages });
                      }}
                    />
                    {lang}
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        {action === "escalate" && (
          <div className="space-y-3 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Escalate To
              </label>
              <select
                className="w-full p-2 border rounded focus:ring-2 focus:ring-accent-500"
                onChange={(e) =>
                  setPayload({ ...payload, escalateTo: e.target.value })
                }
              >
                <option value="">Select Authority</option>
                <option value="STATE_DISASTER">
                  State Disaster Management
                </option>
                <option value="NDRF">National Disaster Response Force</option>
                <option value="COAST_GUARD">Indian Coast Guard</option>
                <option value="NAVY">Indian Navy</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Reason for Escalation
              </label>
              <textarea
                className="w-full p-2 border rounded focus:ring-2 focus:ring-accent-500"
                rows={3}
                placeholder="Explain why this incident needs escalation..."
                onChange={(e) =>
                  setPayload({ ...payload, reason: e.target.value })
                }
              />
            </div>
          </div>
        )}

        {action === "close" && (
          <div className="space-y-3 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Closure Reason
              </label>
              <select
                className="w-full p-2 border rounded focus:ring-2 focus:ring-accent-500"
                onChange={(e) =>
                  setPayload({ ...payload, reason: e.target.value })
                }
              >
                <option value="">Select Reason</option>
                <option value="RESOLVED">Incident Resolved</option>
                <option value="FALSE_ALARM">False Alarm</option>
                <option value="DUPLICATE">Duplicate Report</option>
                <option value="NO_ACTION_REQUIRED">No Action Required</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Final Notes
              </label>
              <textarea
                className="w-full p-2 border rounded focus:ring-2 focus:ring-accent-500"
                rows={3}
                placeholder="Final remarks and outcome summary..."
                onChange={(e) =>
                  setPayload({ ...payload, notes: e.target.value })
                }
              />
            </div>
          </div>
        )}

        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className={`px-4 py-2 bg-${config.color}-600 text-white rounded hover:bg-${config.color}-700 transition-colors`}
          >
            Confirm {config.title}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default function IncidentPane({
  incident,
  onClose,
  onAction,
}: IncidentPaneProps) {
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [showFullMedia, setShowFullMedia] = useState<string | null>(null);

  const canTakeAction = incident.status !== "closed";
  const userRole = "district_officer"; // This would come from auth context

  const handleAction = (action: string) => {
    setActiveModal(action);
  };

  const confirmAction = (action: string, payload?: any) => {
    onAction(action, payload);
    setActiveModal(null);
  };

  const getValidationBar = (evidence: any) => {
    const validations = [
      { key: "exifValid", label: "EXIF Valid", value: evidence.exifValid },
      {
        key: "locationConfirmed",
        label: "Location Confirmed",
        value: evidence.locationConfirmed,
      },
      {
        key: "timelineConsistent",
        label: "Timeline Consistent",
        value: evidence.timelineConsistent,
      },
      {
        key: "crossReferenced",
        label: "Cross Referenced",
        value: evidence.crossReferenced,
      },
    ];

    const validCount = validations.filter((v) => v.value).length;
    const percentage = (validCount / validations.length) * 100;

    return (
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium">Validation Evidence</span>
          <span className="text-sm text-gray-600">
            {validCount}/{validations.length}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-300 ${
              percentage >= 75
                ? "bg-green-500"
                : percentage >= 50
                ? "bg-yellow-500"
                : "bg-red-500"
            }`}
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
        <div className="mt-2 grid grid-cols-2 gap-1">
          {validations.map((validation) => (
            <div key={validation.key} className="flex items-center text-xs">
              <div
                className={`w-2 h-2 rounded-full mr-2 ${
                  validation.value ? "bg-green-500" : "bg-red-500"
                }`}
              ></div>
              {validation.label}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const getActionButtons = () => {
    const buttons = [];

    if (incident.status === "open") {
      buttons.push(
        <button
          key="acknowledge"
          onClick={() => handleAction("acknowledge")}
          className="btn-primary flex items-center"
        >
          <CheckCircle className="w-4 h-4 mr-1" />
          Acknowledge (A)
        </button>
      );
    }

    if (incident.status === "acknowledged" || incident.status === "open") {
      buttons.push(
        <button
          key="dispatch"
          onClick={() => handleAction("dispatch")}
          className="btn-secondary flex items-center"
        >
          <Truck className="w-4 h-4 mr-1" />
          Dispatch (D)
        </button>
      );
    }

    if (incident.status !== "closed") {
      buttons.push(
        <button
          key="publish"
          onClick={() => handleAction("publish")}
          className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center"
        >
          <Megaphone className="w-4 h-4 mr-1" />
          Publish (P)
        </button>
      );

      buttons.push(
        <button
          key="escalate"
          onClick={() => handleAction("escalate")}
          className="bg-orange-600 hover:bg-orange-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center"
        >
          <ArrowUp className="w-4 h-4 mr-1" />
          Escalate
        </button>
      );

      buttons.push(
        <button
          key="close"
          onClick={() => handleAction("close")}
          className="btn-danger flex items-center"
        >
          <XCircle className="w-4 h-4 mr-1" />
          Close
        </button>
      );
    }

    return buttons;
  };

  return (
    <>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <div>
            <h2 className="font-semibold text-lg">Incident Dossier</h2>
            <p className="text-sm text-gray-600">{incident.id}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {/* Status & Confidence */}
          <div className="flex items-center justify-between mb-4">
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                incident.status
              )}`}
            >
              {incident.status.replace("_", " ").toUpperCase()}
            </span>
            <div className="flex items-center space-x-3">
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${getSeverityColor(
                  incident.severity
                )}`}
              >
                {incident.severity.toUpperCase()}
              </span>
              <span className="text-sm font-medium text-green-600">
                {Math.round(incident.confidence * 100)}% Confidence
              </span>
            </div>
          </div>

          {/* Basic Info */}
          <div className="mb-4">
            <h3 className="font-medium text-lg mb-2">{incident.title}</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-start text-gray-600">
                <MapPin className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                <div>
                  <p>{incident.location.address}</p>
                  <p className="text-xs">
                    {incident.location.district}, {incident.location.state}
                  </p>
                  <p className="text-xs">
                    Coordinates: {incident.location.lat.toFixed(6)},{" "}
                    {incident.location.lng.toFixed(6)}
                  </p>
                </div>
              </div>
              <div className="flex items-center text-gray-600">
                <Clock className="w-4 h-4 mr-2" />
                <div>
                  <span>{formatTimeAgo(incident.timestamp)}</span>
                  <span className="text-xs ml-2">
                    ({new Date(incident.timestamp).toLocaleString()})
                  </span>
                </div>
              </div>
              {incident.affectedPopulation && (
                <div className="flex items-center text-gray-600">
                  <User className="w-4 h-4 mr-2" />
                  Affected Population: ~
                  {incident.affectedPopulation.toLocaleString()}
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="mb-4">
            <h4 className="font-medium text-gray-700 mb-2">
              Incident Description
            </h4>
            <p className="text-sm text-gray-600 leading-relaxed bg-gray-50 p-3 rounded-lg">
              {incident.description}
            </p>
          </div>

          {/* Analyst Notes */}
          <div className="mb-4">
            <h4 className="font-medium text-gray-700 mb-2">
              Analyst Assessment
            </h4>
            <p className="text-sm text-gray-600 leading-relaxed bg-blue-50 p-3 rounded-lg">
              {incident.analystNotes}
            </p>
          </div>

          {/* Validation Evidence */}
          {getValidationBar(incident.validationEvidence)}

          {/* Media */}
          {incident.media.length > 0 && (
            <div className="mb-4">
              <h4 className="font-medium text-gray-700 mb-2 flex items-center">
                <Image className="w-4 h-4 mr-1" />
                Evidence Media ({incident.media.length})
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {incident.media.map((src, index) => (
                  <div
                    key={index}
                    className="aspect-square bg-gray-100 rounded-lg cursor-pointer hover:opacity-75 transition-opacity flex items-center justify-center border-2 border-dashed border-gray-300"
                    onClick={() => setShowFullMedia(src)}
                  >
                    <div className="text-center">
                      <Image className="w-6 h-6 text-gray-400 mx-auto mb-1" />
                      <p className="text-xs text-gray-500">
                        Evidence {index + 1}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Contacts */}
          {incident.contacts && incident.contacts.length > 0 && (
            <div className="mb-4">
              <h4 className="font-medium text-gray-700 mb-2">
                Emergency Contacts
              </h4>
              <div className="space-y-2">
                {incident.contacts.map((contact, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 p-3 rounded-lg text-sm border"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="font-medium text-gray-900">
                          {contact.name}
                        </div>
                        <div className="text-gray-600">{contact.role}</div>
                        <div className="text-xs text-gray-500">
                          {contact.department}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <a
                        href={`tel:${contact.phone}`}
                        className="flex items-center text-accent-600 hover:text-accent-700 hover:underline transition-colors"
                      >
                        <Phone className="w-3 h-3 mr-1" />
                        {maskPII(contact.phone, userRole === "media_officer")}
                      </a>
                      <a
                        href={`mailto:${contact.email}`}
                        className="flex items-center text-accent-600 hover:text-accent-700 hover:underline transition-colors"
                      >
                        <Mail className="w-3 h-3 mr-1" />
                        {contact.email}
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SOP Card */}
          <SopCard
            eventType={incident.eventType}
            severity={incident.severity}
          />

          {/* Export Controls */}
          <ExportControls incident={incident} />
        </div>

        {/* Action Buttons */}
        {canTakeAction && (
          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <div className="space-y-2">
              <div className="text-xs text-gray-600 mb-2">
                Keyboard shortcuts: (A) Acknowledge • (D) Dispatch • (P) Publish
              </div>
              <div className="grid grid-cols-2 gap-2">
                {getActionButtons().map((button, index) => (
                  <div key={index} className="col-span-1">
                    {button}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Action Modal */}
      {activeModal && (
        <ActionModal
          isOpen={true}
          action={activeModal}
          onClose={() => setActiveModal(null)}
          onConfirm={(payload) => confirmAction(activeModal, payload)}
        />
      )}

      {/* Media Modal */}
      {showFullMedia && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
          onClick={() => setShowFullMedia(null)}
        >
          <div className="relative max-w-4xl max-h-full p-4">
            <button
              onClick={() => setShowFullMedia(null)}
              className="absolute top-2 right-2 text-white hover:text-gray-300 z-10"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="bg-white rounded-lg p-8 flex items-center justify-center min-h-[400px]">
              <div className="text-center text-gray-500">
                <Image className="w-16 h-16 mx-auto mb-4" />
                <p className="text-lg mb-2">Evidence Media Preview</p>
                <p className="text-sm">{showFullMedia}</p>
                <p className="text-xs mt-4 max-w-md">
                  In production, this would display the actual image/video
                  evidence. Click outside to close.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
