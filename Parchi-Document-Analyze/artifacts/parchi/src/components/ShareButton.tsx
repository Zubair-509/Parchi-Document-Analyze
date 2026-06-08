import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ShareButtonProps {
  variant?: "green" | "blue";
}

export function ShareButton({ variant = "green" }: ShareButtonProps) {
  const handlePrint = () => {
    window.print();
  };

  const cls =
    variant === "blue"
      ? "gap-2 border border-blue-300 text-blue-700 hover:bg-blue-50"
      : "gap-2 border border-brand-green text-brand-green hover:bg-brand-green-bg/60";

  return (
    <Button variant="outline" className={cls} onClick={handlePrint}>
      <Download className="h-4 w-4" />
      Save PDF
    </Button>
  );
}
