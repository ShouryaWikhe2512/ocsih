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
          className="absolute top-2 right-2 text-white hover:text-gray-300 z-10 bg-black bg-opacity-50 rounded-full p-2"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="bg-white rounded-lg overflow-hidden">
          <img
            src={src}
            alt="Media evidence"
            className="max-w-full max-h-[80vh] object-contain"
            onError={(e) => {
              // Fallback for broken images
              const target = e.target as HTMLImageElement;
              target.style.display = "none";
              const fallback = target.nextElementSibling as HTMLElement;
              if (fallback) fallback.style.display = "block";
            }}
          />
          <div
            className="p-8 text-center text-gray-500 min-h-[400px] items-center justify-center"
            style={{ display: "none" }}
          >
            <div>
              <div className="mb-4">📷</div>
              <p>Media Preview</p>
              <p className="text-sm">{src}</p>
              <p className="text-xs mt-2">
                Unable to load image - URL may be invalid or blocked
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
