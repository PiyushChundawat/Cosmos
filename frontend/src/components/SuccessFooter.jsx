import { CheckCircle2 } from "lucide-react";

export default function SuccessFooter() {
  return (
    <footer
      className="relative z-10 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white flex items-center justify-center gap-4"
      style={{ animation: "slideUp 0.5s ease-out" }}
    >
      <CheckCircle2 className="w-5 h-5" />
      <span className="font-medium">Roadmap saved successfully!</span>
      <span className="opacity-70">•</span>
      <span className="opacity-70">Redirecting in 3 seconds...</span>
    </footer>
  );
}
