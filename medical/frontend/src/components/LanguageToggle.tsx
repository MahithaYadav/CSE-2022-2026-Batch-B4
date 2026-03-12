import { useTranslation } from "react-i18next";
import { Globe, ChevronDown } from "lucide-react"; // Added Chevron for better UI
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

const LANGUAGES = [
  { code: "en", label: "English", nativeLabel: "English" },
  { code: "te", label: "Telugu", nativeLabel: "తెలుగు" },
  { code: "hi", label: "Hindi", nativeLabel: "हिन्दी" },
];

export function LanguageToggle() {
  const { i18n } = useTranslation();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="rounded-xl bg-primary/10 hover:bg-primary/20 text-primary h-10 gap-2 px-4 border border-primary/20 transition-all flex items-center"
        >
          {/* Ensure the icon has a clear size and color */}
          <Globe className="h-5 w-5 shrink-0 text-primary" />
          <span className="text-xs font-bold uppercase tracking-widest">
            {i18n.language}
          </span>
          <ChevronDown className="h-3 w-3 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" className="min-w-[160px] bg-white border-slate-200 shadow-2xl rounded-2xl p-1 z-[100]">
        {LANGUAGES.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => i18n.changeLanguage(lang.code)}
            className={`flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer transition-colors mb-1 last:mb-0 ${
              i18n.language === lang.code 
                ? "bg-primary text-white font-bold" 
                : "hover:bg-slate-50 text-slate-600"
            }`}
          >
            <span className="text-sm">{lang.nativeLabel}</span>
            <span className={`text-[10px] uppercase font-bold ${i18n.language === lang.code ? "text-white/70" : "text-slate-400"}`}>
              {lang.label}
            </span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}