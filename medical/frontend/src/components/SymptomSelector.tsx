import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Search, Check, X, Trash2 } from "lucide-react";

interface SymptomSelectorProps {
  selected: string[];
  onToggle: (symptom: string) => void;
  // Added onClear to match your JSON "clearAll" functionality
  onClear?: () => void;
}

// 1. Full list of internal keys used by your FastAPI ML model
const SYMPTOMS = [
  "itching", "skin_rash", "nodal_skin_eruptions", "continuous_sneezing", 
  "shivering", "chills", "joint_pain", "stomach_pain", "acidity", 
  "ulcers_on_tongue", "muscle_wasting", "vomiting", "burning_micturition", 
  "spotting_ urination", "fatigue", "weight_gain", "anxiety", 
  "cold_hands_and_feets", "mood_swings", "weight_loss", "restlessness", 
  "lethargy", "patches_in_throat", "irregular_sugar_level", "cough", 
  "high_fever", "sunken_eyes", "breathlessness", "sweating", "dehydration", 
  "indigestion", "headache", "yellowish_skin", "dark_urine", "nausea", 
  "loss_of_appetite", "pain_behind_the_eyes", "back_pain", "constipation", 
  "abdominal_pain", "diarrhoea", "mild_fever", "yellow_urine", 
  "yellowing_of_eyes", "acute_liver_failure"
];

const SymptomSelector = ({ selected, onToggle, onClear }: SymptomSelectorProps) => {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");

  // 2. Filter logic: Search works for both English keys and Translated labels
  const filtered = SYMPTOMS.filter(s => {
    const translatedLabel = t(`symptoms.labels.${s}`).toLowerCase();
    const searchLower = search.toLowerCase();
    return translatedLabel.includes(searchLower) || s.replace(/_/g, ' ').includes(searchLower);
  });

  return (
    <div className="space-y-4">
      {/* 1. Header with Clear All button */}
      <div className="flex items-center justify-between px-1">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
          {t("symptoms.title")}
        </h3>
        {selected.length > 0 && onClear && (
          <button 
            onClick={onClear}
            className="text-[10px] font-bold text-red-400 hover:text-red-500 flex items-center gap-1 transition-colors"
          >
            <Trash2 size={12} />
            {t("symptoms.clearAll")}
          </button>
        )}
      </div>

      {/* 2. Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder={t("symptoms.search")} 
          className="w-full bg-secondary/50 border-none rounded-xl py-3 pl-10 pr-4 text-sm outline-none transition-all focus:ring-2 focus:ring-primary/20"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* 3. Selected Chips */}
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-2 animate-in fade-in duration-300">
          {selected.map(s => (
            <button
              key={s}
              onClick={() => onToggle(s)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-white rounded-lg text-[10px] font-bold shadow-sm hover:bg-primary/90 transition-all"
            >
              {t(`symptoms.labels.${s}`)}
              <X size={12} />
            </button>
          ))}
        </div>
      )}

      {/* 4. Scrollable List */}
      <div className="space-y-1 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar border-t pt-2">
        {filtered.length > 0 ? (
          filtered.map((symptom) => {
            const isSelected = selected.includes(symptom);
            return (
              <button
                key={symptom}
                onClick={() => onToggle(symptom)}
                className={`w-full flex items-center justify-between p-3 rounded-xl text-left transition-all ${
                  isSelected 
                    ? "bg-primary/10 text-primary font-bold shadow-sm" 
                    : "hover:bg-secondary/50 text-slate-600"
                }`}
              >
                <span className="text-sm">{t(`symptoms.labels.${symptom}`)}</span>
                {isSelected && <Check size={16} className="text-primary" />}
              </button>
            );
          })
        ) : (
          <div className="py-10 text-center text-slate-400 text-xs italic">
            No results found for "{search}"
          </div>
        )}
      </div>
    </div>
  );
};

export default SymptomSelector;