import { Link } from "wouter";
import { FileText, ClipboardList, BookOpen, Shield, FlaskConical, Languages } from "lucide-react";
import { Disclaimer } from "@/components/Disclaimer";

export function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <div className="flex-1 max-w-4xl mx-auto w-full p-4 sm:p-6 md:p-8 pt-8">
        
        <header className="text-center mb-10">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-brand-green-deep mb-2">Parchi</h1>
          <p className="font-sans text-gray-600 text-lg md:text-xl max-w-lg mx-auto">
            Your medical companion. We help you understand your prescription and test reports in plain English and Urdu.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-12">
          <Link href="/prescription" className="block group">
            <div className="h-full bg-brand-green-bg/30 hover:bg-brand-green-bg/60 border-2 border-brand-green/20 hover:border-brand-green/40 transition-colors rounded-2xl p-6 sm:p-8 flex flex-col items-center text-center cursor-pointer">
              <div className="bg-brand-green text-white p-4 rounded-full mb-4 group-hover:scale-110 transition-transform">
                <FileText className="w-8 h-8" />
              </div>
              <h2 className="font-sans text-2xl font-bold text-brand-green-deep mb-2">My Prescription</h2>
              <p className="text-brand-green text-lg mb-2" dir="rtl" style={{ fontFamily: 'Noto Nastaliq Urdu' }}>
                میرا نسخہ
              </p>
              <p className="text-sm text-gray-600 mt-2">
                Upload your doctor's prescription to understand your medicines, schedule, and side effects.
              </p>
            </div>
          </Link>

          <Link href="/testreport" className="block group">
            <div className="h-full bg-brand-blue-bg border-2 border-brand-blue-border/40 hover:border-brand-blue-border hover:bg-blue-100/50 transition-colors rounded-2xl p-6 sm:p-8 flex flex-col items-center text-center cursor-pointer">
              <div className="bg-blue-500 text-white p-4 rounded-full mb-4 group-hover:scale-110 transition-transform">
                <FlaskConical className="w-8 h-8" />
              </div>
              <h2 className="font-sans text-2xl font-bold text-blue-900 mb-2">My Test Report</h2>
              <p className="text-blue-800 text-lg mb-2" dir="rtl" style={{ fontFamily: 'Noto Nastaliq Urdu' }}>
                میری لیب رپورٹ
              </p>
              <p className="text-sm text-gray-600 mt-2">
                Upload your lab or blood test report to understand your results and what they mean.
              </p>
            </div>
          </Link>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8">
          <h3 className="font-serif text-xl font-bold text-gray-800 mb-6 text-center">How Parchi Helps You</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="flex gap-4 items-start">
              <div className="bg-brand-green-bg p-2 rounded-lg text-brand-green shrink-0">
                <Languages className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-1">Explains in Urdu</h4>
                <p className="text-sm text-gray-600">Complex medical terms translated to plain, easy-to-understand Urdu.</p>
              </div>
            </div>
            
            <div className="flex gap-4 items-start">
              <div className="bg-amber-50 p-2 rounded-lg text-amber-600 shrink-0">
                <ClipboardList className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-1">Finds Alternatives</h4>
                <p className="text-sm text-gray-600">Discover more affordable generic versions of prescribed medicines.</p>
              </div>
            </div>
            
            <div className="flex gap-4 items-start">
              <div className="bg-blue-50 p-2 rounded-lg text-blue-600 shrink-0">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-1">Shows Evidence</h4>
                <p className="text-sm text-gray-600">See what each medicine is commonly used for and the evidence behind it.</p>
              </div>
            </div>
            
            <div className="flex gap-4 items-start">
              <div className="bg-purple-50 p-2 rounded-lg text-purple-600 shrink-0">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-1">Explains Test Reports</h4>
                <p className="text-sm text-gray-600">Understand your lab values, normal ranges, and what to ask your doctor.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Disclaimer />
    </div>
  );
}
