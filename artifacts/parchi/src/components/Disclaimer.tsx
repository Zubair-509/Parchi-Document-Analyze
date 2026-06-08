export function Disclaimer() {
  return (
    <div className="w-full bg-blue-100 p-4 text-center border-t border-blue-200 mt-auto">
      <p className="text-blue-900 font-sans text-sm mb-1">
        This app is for information only. Always consult your doctor. Do not take any medicine without consulting a physician. AI can make mistakes.
      </p>
      <p
        className="text-blue-900 text-base"
        dir="rtl"
        style={{ fontFamily: 'Noto Nastaliq Urdu', lineHeight: 2.2 }}
      >
        یہ ایپ صرف معلومات کے لیے ہے۔ ہمیشہ اپنے ڈاکٹر سے مشورہ کریں۔ بغیر ڈاکٹر کے مشورے کے کوئی دوائی نہ لیں۔ AI غلطی کر سکتا ہے۔
      </p>
    </div>
  );
}
