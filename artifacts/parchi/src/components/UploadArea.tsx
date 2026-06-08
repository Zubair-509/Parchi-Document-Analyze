import { useRef, useState } from "react";
import { Camera, ImageIcon, Loader2, ClipboardList, X, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const ALLOWED_ACCEPT = "image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp";

interface UploadAreaProps {
  onUpload: (file: File) => void;
  isLoading: boolean;
  type: "prescription" | "testreport";
}

export function UploadArea({ onUpload, isLoading, type }: UploadAreaProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<{ url: string; file: File } | null>(null);

  const validateAndPreview = (file: File, inputRef: React.RefObject<HTMLInputElement | null>) => {
    setError(null);
    if (!ALLOWED_TYPES.includes(file.type)) {
      setError("Only JPG, PNG, and WebP images are supported.");
      if (inputRef.current) inputRef.current.value = "";
      return;
    }
    const url = URL.createObjectURL(file);
    setPreview({ url, file });
  };

  const handleConfirm = () => {
    if (preview) {
      onUpload(preview.file);
      URL.revokeObjectURL(preview.url);
      setPreview(null);
    }
  };

  const handleCancel = () => {
    if (preview) URL.revokeObjectURL(preview.url);
    setPreview(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (cameraInputRef.current) cameraInputRef.current.value = "";
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) validateAndPreview(file, fileInputRef);
  };

  const handleCameraChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) validateAndPreview(file, cameraInputRef);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (isLoading) return;
    const file = e.dataTransfer.files?.[0];
    if (file) validateAndPreview(file, fileInputRef);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleSelectClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setError(null);
    fileInputRef.current?.click();
  };

  const handleCameraClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setError(null);
    cameraInputRef.current?.click();
  };

  const isPrescription = type === "prescription";

  const containerClasses = isPrescription
    ? "border-brand-green text-brand-green bg-brand-green-bg/30"
    : "border-brand-blue-border text-blue-700 bg-brand-blue-bg/50";

  const cameraButtonClasses = isPrescription
    ? "border-brand-green text-brand-green hover:bg-brand-green-bg/60"
    : "border-blue-300 text-blue-700 hover:bg-blue-50";

  if (preview) {
    return (
      <div className="space-y-3">
        <div className="rounded-xl overflow-hidden border-2 border-dashed border-gray-300 bg-gray-50 relative">
          <img
            src={preview.url}
            alt="Preview"
            className="w-full max-h-72 object-contain bg-white"
          />
        </div>
        <p className="text-sm text-center text-gray-500">
          Looks good? Confirm to analyze, or retake.
        </p>
        <div className="flex gap-3">
          <Button
            variant="outline"
            className="flex-1 gap-2 text-gray-600 border-gray-300 hover:bg-gray-100"
            onClick={handleCancel}
          >
            <X className="h-4 w-4" />
            Retake
          </Button>
          <Button
            variant={isPrescription ? "default" : "secondary"}
            className={`flex-1 gap-2 ${isPrescription ? "" : "bg-blue-600 text-white hover:bg-blue-700"}`}
            onClick={handleConfirm}
          >
            <CheckCircle className="h-4 w-4" />
            Analyze
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${containerClasses} ${isLoading ? "opacity-70 pointer-events-none" : ""}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <input
          type="file"
          accept={ALLOWED_ACCEPT}
          className="hidden"
          ref={fileInputRef}
          onChange={handleFileChange}
        />
        <input
          type="file"
          accept={ALLOWED_ACCEPT}
          capture="environment"
          className="hidden"
          ref={cameraInputRef}
          onChange={handleCameraChange}
        />

        <div className="flex flex-col items-center justify-center space-y-4">
          {isLoading ? (
            <Loader2 className="h-12 w-12 animate-spin" />
          ) : isPrescription ? (
            <Camera className="h-12 w-12" />
          ) : (
            <ClipboardList className="h-12 w-12" />
          )}

          <div className="space-y-1">
            <h3 className="text-lg font-semibold font-sans">
              {isLoading
                ? isPrescription
                  ? "Reading your prescription..."
                  : "Reading your test report..."
                : isPrescription
                ? "Upload your prescription"
                : "Upload your lab report"}
            </h3>
            <p
              className="text-xl font-medium font-serif"
              dir="rtl"
              style={{ fontFamily: "Noto Nastaliq Urdu", lineHeight: 2.2 }}
            >
              {isLoading
                ? isPrescription
                  ? "نسخہ پڑھا جا رہا ہے..."
                  : "رپورٹ پڑھی جا رہی ہے..."
                : isPrescription
                ? "اپنا نسخہ اپ لوڈ کریں"
                : "اپنی لیب رپورٹ اپ لوڈ کریں"}
            </p>
          </div>

          {!isLoading && (
            <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs">
              <Button
                variant="outline"
                className={`flex-1 gap-2 border ${cameraButtonClasses}`}
                onClick={handleCameraClick}
              >
                <Camera className="h-4 w-4" />
                Take Photo
              </Button>
              <Button
                variant={isPrescription ? "default" : "secondary"}
                className={`flex-1 gap-2 ${isPrescription ? "" : "bg-blue-100 text-blue-800 hover:bg-blue-200"}`}
                onClick={handleSelectClick}
              >
                <ImageIcon className="h-4 w-4" />
                Choose File
              </Button>
            </div>
          )}

          {!isLoading && (
            <p className="text-xs opacity-60">
              JPG · PNG · WebP &nbsp;|&nbsp; Drag & drop supported
            </p>
          )}
        </div>
      </div>

      {error && (
        <p className="text-sm text-red-600 text-center font-medium">{error}</p>
      )}
    </div>
  );
}
