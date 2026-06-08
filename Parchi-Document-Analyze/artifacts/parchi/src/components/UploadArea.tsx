import { useRef, useState } from "react";
import { Camera, ImageIcon, Loader2, ClipboardList, X, CheckCircle, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const IMAGE_ACCEPT = "image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp";
const REPORT_ACCEPT = "image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp,application/pdf,.pdf";

function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

interface UploadAreaProps {
  onUpload: (file: File) => void;
  isLoading: boolean;
  type: "prescription" | "testreport";
}

type PreviewState =
  | { kind: "image"; url: string; file: File }
  | { kind: "pdf"; file: File };

export function UploadArea({ onUpload, isLoading, type }: UploadAreaProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const pdfInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<PreviewState | null>(null);

  const isPrescription = type === "prescription";

  const validateAndPreview = (file: File, inputRef: React.RefObject<HTMLInputElement | null>) => {
    setError(null);
    const allowedTypes = isPrescription
      ? IMAGE_TYPES
      : [...IMAGE_TYPES, "application/pdf"];

    if (!allowedTypes.includes(file.type)) {
      const msg = isPrescription
        ? "Only JPG, PNG, and WebP images are supported."
        : "Only JPG, PNG, WebP images or PDF files are supported.";
      setError(msg);
      if (inputRef.current) inputRef.current.value = "";
      return;
    }

    if (file.type === "application/pdf") {
      setPreview({ kind: "pdf", file });
    } else {
      const url = URL.createObjectURL(file);
      setPreview({ kind: "image", url, file });
    }
  };

  const handleConfirm = () => {
    if (!preview) return;
    onUpload(preview.file);
    if (preview.kind === "image") URL.revokeObjectURL(preview.url);
    setPreview(null);
  };

  const handleCancel = () => {
    if (preview?.kind === "image") URL.revokeObjectURL(preview.url);
    setPreview(null);
    setError(null);
    [fileInputRef, cameraInputRef, pdfInputRef].forEach(r => {
      if (r.current) r.current.value = "";
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) validateAndPreview(file, fileInputRef);
  };

  const handleCameraChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) validateAndPreview(file, cameraInputRef);
  };

  const handlePdfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) validateAndPreview(file, pdfInputRef);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (isLoading) return;
    const file = e.dataTransfer.files?.[0];
    if (file) validateAndPreview(file, fileInputRef);
  };

  const containerClasses = isPrescription
    ? "border-brand-green text-brand-green bg-brand-green-bg/30"
    : "border-brand-blue-border text-blue-700 bg-brand-blue-bg/50";

  const cameraButtonClasses = isPrescription
    ? "border-brand-green text-brand-green hover:bg-brand-green-bg/60"
    : "border-blue-300 text-blue-700 hover:bg-blue-50";

  const analyzeButtonClasses = isPrescription
    ? ""
    : "bg-blue-600 text-white hover:bg-blue-700";

  // ── Preview state ──────────────────────────────────────────────
  if (preview) {
    return (
      <div className="space-y-3">
        {preview.kind === "image" ? (
          <div className="rounded-xl overflow-hidden border-2 border-dashed border-gray-300 bg-gray-50">
            <img
              src={preview.url}
              alt="Preview"
              className="w-full max-h-72 object-contain bg-white"
            />
          </div>
        ) : (
          <div className="rounded-xl border-2 border-dashed border-blue-300 bg-blue-50 p-6 flex items-center gap-4">
            <div className="bg-red-100 p-3 rounded-lg shrink-0">
              <FileText className="h-8 w-8 text-red-600" />
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-gray-800 truncate">{preview.file.name}</p>
              <p className="text-sm text-gray-500">PDF · {formatFileSize(preview.file.size)}</p>
            </div>
          </div>
        )}

        <p className="text-sm text-center text-gray-500">
          {preview.kind === "pdf"
            ? "Ready to analyze this PDF report."
            : "Looks good? Confirm to analyze, or retake."}
        </p>

        <div className="flex gap-3">
          <Button
            variant="outline"
            className="flex-1 gap-2 text-gray-600 border-gray-300 hover:bg-gray-100"
            onClick={handleCancel}
          >
            <X className="h-4 w-4" />
            {preview.kind === "pdf" ? "Remove" : "Retake"}
          </Button>
          <Button
            variant={isPrescription ? "default" : "secondary"}
            className={`flex-1 gap-2 ${analyzeButtonClasses}`}
            onClick={handleConfirm}
          >
            <CheckCircle className="h-4 w-4" />
            Analyze
          </Button>
        </div>
      </div>
    );
  }

  // ── Upload state ───────────────────────────────────────────────
  return (
    <div className="space-y-2">
      <div
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${containerClasses} ${isLoading ? "opacity-70 pointer-events-none" : ""}`}
        onDrop={handleDrop}
        onDragOver={e => e.preventDefault()}
      >
        {/* Hidden inputs */}
        <input
          type="file"
          accept={isPrescription ? IMAGE_ACCEPT : REPORT_ACCEPT}
          className="hidden"
          ref={fileInputRef}
          onChange={handleFileChange}
        />
        <input
          type="file"
          accept={IMAGE_ACCEPT}
          capture="environment"
          className="hidden"
          ref={cameraInputRef}
          onChange={handleCameraChange}
        />
        {!isPrescription && (
          <input
            type="file"
            accept="application/pdf,.pdf"
            className="hidden"
            ref={pdfInputRef}
            onChange={handlePdfChange}
          />
        )}

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
                ? isPrescription ? "Reading your prescription..." : "Reading your test report..."
                : isPrescription ? "Upload your prescription" : "Upload your lab report"}
            </h3>
            <p
              className="text-xl font-medium font-serif"
              dir="rtl"
              style={{ fontFamily: "Noto Nastaliq Urdu", lineHeight: 2.2 }}
            >
              {isLoading
                ? isPrescription ? "نسخہ پڑھا جا رہا ہے..." : "رپورٹ پڑھی جا رہی ہے..."
                : isPrescription ? "اپنا نسخہ اپ لوڈ کریں" : "اپنی لیب رپورٹ اپ لوڈ کریں"}
            </p>
          </div>

          {!isLoading && (
            <>
              {isPrescription ? (
                // Prescription: camera + choose image
                <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs">
                  <Button
                    variant="outline"
                    className={`flex-1 gap-2 border ${cameraButtonClasses}`}
                    onClick={e => { e.stopPropagation(); setError(null); cameraInputRef.current?.click(); }}
                  >
                    <Camera className="h-4 w-4" />
                    Take Photo
                  </Button>
                  <Button
                    variant="default"
                    className="flex-1 gap-2"
                    onClick={e => { e.stopPropagation(); setError(null); fileInputRef.current?.click(); }}
                  >
                    <ImageIcon className="h-4 w-4" />
                    Choose File
                  </Button>
                </div>
              ) : (
                // Test report: camera + image + PDF
                <div className="flex flex-col gap-2 w-full max-w-xs">
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      className={`flex-1 gap-2 border ${cameraButtonClasses}`}
                      onClick={e => { e.stopPropagation(); setError(null); cameraInputRef.current?.click(); }}
                    >
                      <Camera className="h-4 w-4" />
                      Take Photo
                    </Button>
                    <Button
                      variant="secondary"
                      className="flex-1 gap-2 bg-blue-100 text-blue-800 hover:bg-blue-200"
                      onClick={e => { e.stopPropagation(); setError(null); fileInputRef.current?.click(); }}
                    >
                      <ImageIcon className="h-4 w-4" />
                      Image
                    </Button>
                  </div>
                  <Button
                    variant="outline"
                    className="w-full gap-2 border-red-300 text-red-700 hover:bg-red-50"
                    onClick={e => { e.stopPropagation(); setError(null); pdfInputRef.current?.click(); }}
                  >
                    <FileText className="h-4 w-4" />
                    Upload PDF Report
                  </Button>
                </div>
              )}

              <p className="text-xs opacity-60">
                {isPrescription
                  ? "JPG · PNG · WebP  |  Drag & drop supported"
                  : "JPG · PNG · WebP · PDF  |  Drag & drop supported"}
              </p>
            </>
          )}
        </div>
      </div>

      {error && (
        <p className="text-sm text-red-600 text-center font-medium">{error}</p>
      )}
    </div>
  );
}
