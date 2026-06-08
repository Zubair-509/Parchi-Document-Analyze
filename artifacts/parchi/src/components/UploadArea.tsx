import { useState, useRef } from "react";
import { Camera, Upload, Loader2, ClipboardList } from "lucide-react";
import { Button } from "@/components/ui/button";

interface UploadAreaProps {
  onUpload: (file: File) => void;
  isLoading: boolean;
  type: "prescription" | "testreport";
}

export function UploadArea({ onUpload, isLoading, type }: UploadAreaProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onUpload(file);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const isPrescription = type === "prescription";
  
  const containerClasses = isPrescription 
    ? "border-brand-green text-brand-green bg-brand-green-bg/30 hover:bg-brand-green-bg/50"
    : "border-brand-blue-border text-blue-700 bg-brand-blue-bg/50 hover:bg-brand-blue-bg";

  return (
    <div 
      className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${containerClasses} ${isLoading ? 'opacity-70 pointer-events-none' : ''}`}
      onClick={!isLoading ? handleClick : undefined}
    >
      <input 
        type="file" 
        accept="image/*" 
        className="hidden" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
      />
      
      <div className="flex flex-col items-center justify-center space-y-4">
        {isLoading ? (
          <Loader2 className="h-12 w-12 animate-spin" />
        ) : (
          isPrescription ? <Camera className="h-12 w-12" /> : <ClipboardList className="h-12 w-12" />
        )}
        
        <div className="space-y-1">
          <h3 className="text-lg font-semibold font-sans">
            {isLoading 
              ? (isPrescription ? "Reading your prescription..." : "Reading your test report...") 
              : (isPrescription ? "Upload your prescription" : "Upload your lab report")}
          </h3>
          <p className="text-xl font-medium font-serif" dir="rtl" style={{ fontFamily: 'Noto Nastaliq Urdu', lineHeight: 2.2 }}>
            {isLoading 
              ? (isPrescription ? "نسخہ پڑھا جا رہا ہے..." : "رپورٹ پڑھی جا رہی ہے...") 
              : (isPrescription ? "اپنا نسخہ اپ لوڈ کریں" : "اپنی لیب رپورٹ اپ لوڈ کریں")}
          </p>
        </div>
        
        {!isLoading && (
          <Button variant={isPrescription ? "default" : "secondary"} className={isPrescription ? "" : "bg-blue-100 text-blue-800 hover:bg-blue-200"}>
            Select Image
          </Button>
        )}
      </div>
    </div>
  );
}
