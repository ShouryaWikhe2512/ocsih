import { useState, useRef } from "react";
import { StorageService } from "@/lib/storage";
import { AnalyticsService } from "@/lib/analytics";
import { Upload, X, FileImage, FileVideo } from "lucide-react";

interface FileUploadProps {
  onUploadComplete: (urls: string[]) => void;
  reportId?: string;
  maxFiles?: number;
  acceptedTypes?: string[];
}

export default function FileUpload({
  onUploadComplete,
  reportId,
  maxFiles = 5,
  acceptedTypes = ["image/*", "video/*"],
}: FileUploadProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || []);

    if (files.length + selectedFiles.length > maxFiles) {
      alert(`Maximum ${maxFiles} files allowed`);
      return;
    }

    setFiles((prev) => [...prev, ...selectedFiles]);
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (files.length === 0) return;

    setUploading(true);
    setUploadProgress(0);

    try {
      const basePath = reportId
        ? `reports/${reportId}/media`
        : `uploads/${Date.now()}`;

      const urls = await StorageService.uploadMultipleFiles(
        files,
        basePath,
        (progress) => setUploadProgress(progress)
      );

      // Track upload analytics
      AnalyticsService.trackCustomEvent("file_upload", {
        file_count: files.length,
        report_id: reportId,
        total_size: files.reduce((sum, file) => sum + file.size, 0),
      });

      onUploadComplete(urls);
      setFiles([]);
      setUploadProgress(0);
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith("image/"))
      return <FileImage className="w-4 h-4" />;
    if (file.type.startsWith("video/"))
      return <FileVideo className="w-4 h-4" />;
    return <Upload className="w-4 h-4" />;
  };

  return (
    <div className="space-y-4">
      {/* File Input */}
      <div
        className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors cursor-pointer"
        onClick={() => fileInputRef.current?.click()}
      >
        <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
        <p className="text-sm text-gray-600">
          Click to select files or drag and drop
        </p>
        <p className="text-xs text-gray-500 mt-1">
          Max {maxFiles} files, {acceptedTypes.join(", ")}
        </p>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={acceptedTypes.join(",")}
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      {/* Selected Files */}
      {files.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700">Selected Files:</h4>
          {files.map((file, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-2 bg-gray-50 rounded border"
            >
              <div className="flex items-center space-x-2">
                {getFileIcon(file)}
                <span className="text-sm text-gray-700">{file.name}</span>
                <span className="text-xs text-gray-500">
                  ({formatFileSize(file.size)})
                </span>
              </div>
              <button
                onClick={() => removeFile(index)}
                className="text-red-500 hover:text-red-700"
                disabled={uploading}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Upload Progress */}
      {uploading && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Uploading...</span>
            <span>{Math.round(uploadProgress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* Upload Button */}
      {files.length > 0 && !uploading && (
        <button
          onClick={handleUpload}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Upload {files.length} file{files.length > 1 ? "s" : ""}
        </button>
      )}
    </div>
  );
}
