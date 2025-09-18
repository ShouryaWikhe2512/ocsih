import { X } from "lucide-react";

interface MediaModalProps {
  src: string;
  onClose: () => void;
}

export default function MediaModal({ src, onClose }: MediaModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="relative max-w-4xl max-h-full p-4">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-white hover:text-gray-300 z-10"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="bg-white rounded-lg p-8 flex items-center justify-center min-h-[400px]">
          <div className="text-center text-gray-500">
            <div className="mb-4">📷</div>
            <p>Media Preview</p>
            <p className="text-sm">{src}</p>
            <p className="text-xs mt-2">
              Mock media - in production, this would display the actual
              image/video
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
