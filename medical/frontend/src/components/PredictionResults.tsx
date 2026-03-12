import { useTranslation } from "react-i18next";
import { ShieldAlert, Activity, CheckCircle2, AlertTriangle, Info } from "lucide-react";

interface PredictionResultsProps {
  results: any[];
  selectedSymptoms: string[];
}

const PredictionResults = ({ results, selectedSymptoms }: PredictionResultsProps) => {
  const { t } = useTranslation();

  // 1. Empty State: Shown when no analysis has been run yet
  if (results.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center p-10 space-y-4 animate-in fade-in duration-700">
        <div className="w-20 h-20 rounded-full bg-slate-50 flex items-center justify-center border border-slate-100 shadow-inner">
          <ShieldAlert className="h-10 w-10 text-slate-200" />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-black text-slate-800 uppercase font-display italic tracking-tight">
            {t("predictions.selectSymptoms")}
          </h3>
          <p className="text-sm text-slate-400 max-w-[300px] mx-auto leading-relaxed">
            {t("predictions.selectSymptomsDesc")}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
      <div className="flex items-center justify-between px-2">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
          {t("predictions.topConditions", { count: results.length - 1 })}
        </p>
      </div>

      {results.map((res, i) => {
        const isConsensus = res.disease.isConsensus;
        
        return (
          <div 
            key={i} 
            className={`group relative rounded-[2rem] p-8 transition-all duration-300 ${
              isConsensus 
                ? "bg-emerald-600 text-white shadow-xl shadow-emerald-200 border-none scale-[1.02] z-10" 
                : "bg-white border border-slate-100 shadow-sm hover:shadow-md mb-4"
            }`}
          >
            {/* 2. Top Header Section */}
            <div className="flex justify-between items-start mb-6">
              <div className="space-y-1">
                {isConsensus && (
                  <div className="flex items-center gap-2 mb-3">
                    <span className="bg-white/20 text-white text-[10px] font-black px-3 py-1 rounded-full flex items-center gap-1 uppercase tracking-widest">
                      <CheckCircle2 size={12} />
                      Final AI Consensus
                    </span>
                  </div>
                )}
                
                <h4 className={`text-2xl font-black font-display tracking-tight ${isConsensus ? "text-white" : "text-slate-800"}`}>
                  {res.disease.name}
                </h4>
                
                <div className="flex items-center gap-3">
                  <span className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-tighter border ${
                    isConsensus 
                      ? "bg-white/10 border-white/20 text-white" 
                      : res.disease.severity === 'high' 
                        ? "bg-red-50 border-red-100 text-red-500" 
                        : "bg-blue-50 border-blue-100 text-blue-500"
                  }`}>
                    {t(`predictions.severity.${res.disease.severity}`)} {t("predictions.severityLabel")}
                  </span>
                  
                  {!isConsensus && (
                    <span className="text-[10px] font-medium text-slate-400">
                       Algorithm: {res.disease.description.split(': ')[1]}
                    </span>
                  )}
                </div>
              </div>

              <div className="text-right">
                <div className="flex items-baseline justify-end gap-1">
                  <span className={`text-4xl font-black font-display ${isConsensus ? "text-white" : "text-primary"}`}>
                    {Math.round(res.score * 100)}
                  </span>
                  <span className={`text-lg font-bold ${isConsensus ? "text-white/60" : "text-primary/60"}`}>%</span>
                </div>
                <p className={`text-[9px] font-black uppercase tracking-[0.2em] ${isConsensus ? "text-white/40" : "text-slate-300"}`}>
                  {t("predictions.match")}
                </p>
              </div>
            </div>

            {/* 3. Progress Bar */}
            <div className="space-y-2">
              <div className={`w-full h-2 rounded-full overflow-hidden ${isConsensus ? "bg-white/20" : "bg-slate-100"}`}>
                <div 
                  className={`h-full transition-all duration-1000 ease-out ${isConsensus ? "bg-white" : "bg-primary"}`}
                  style={{ width: `${res.score * 100}%` }}
                />
              </div>
              
              {isConsensus && (
                <p className="text-xs text-white/70 italic flex items-center gap-2">
                  <Info size={14} />
                  {res.disease.description}
                </p>
              )}
            </div>

            {/* Decorator for Consensus Card */}
            {isConsensus && (
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Activity size={120} />
              </div>
            )}
          </div>
        );
      })}
      
      {/* 4. Medical Disclaimer */}
      <div className="p-6 border border-amber-100 bg-amber-50/50 rounded-2xl flex gap-4">
        <AlertTriangle className="text-amber-500 shrink-0" size={20} />
        <p className="text-[11px] leading-relaxed text-amber-700/80 font-medium italic">
          {t("predictions.disclaimer")}
        </p>
      </div>
    </div>
  );
};

export default PredictionResults;