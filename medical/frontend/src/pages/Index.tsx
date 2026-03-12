import { useState } from "react";
import { useTranslation } from "react-i18next";
import SymptomSelector from "@/components/SymptomSelector";
import PredictionResults from "@/components/PredictionResults";
import { getPrediction } from "@/lib/api";
import { toast } from "sonner";
import HealthChatbot from "@/components/HealthChatbot";
import { LanguageToggle } from "@/components/LanguageToggle"; 
import { 
  Activity, 
  Stethoscope, 
  LayoutDashboard,
  FileText
} from "lucide-react";

const Index = () => {
  const { t } = useTranslation();
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleToggleSymptom = (symptom: string) => {
    setSelectedSymptoms((prev) =>
      prev.includes(symptom) 
        ? prev.filter((s) => s !== symptom) 
        : [...prev, symptom]
    );
  };

  const handleClearAll = () => setSelectedSymptoms([]);

  const handlePredict = async () => {
    // 1. Validation
    if (selectedSymptoms.length < 3) {
      toast.error(t("toast.selectFirst") || "Please select at least 3 symptoms.");
      return;
    }

    setLoading(true);
    try {
      // 2. API Call to FastAPI
      const response = await getPrediction(selectedSymptoms);
      
      // 3. Map Individual Model Predictions
      const individualResults = (response.all_models || []).map((m: any) => ({
        disease: {
          name: m.predicted_disease,
          description: `${t("predictions.match")}: ${m.algorithm}`,
          severity: m.confidence > 80 ? "high" : m.confidence > 50 ? "medium" : "low",
          isConsensus: false
        },
        score: m.confidence / 100 
      }));

      // 4. Create the Highlighted Ensemble Consensus Card
      const ensembleConsensus = {
        disease: {
          name: response.top_prediction,
          description: `AI Consensus: ${response.agreement} models agreed with a weighted score of ${response.top_confidence}%.`,
          severity: response.top_confidence > 60 ? "high" : "medium",
          isConsensus: true // Used for special styling in PredictionResults.tsx
        },
        score: response.top_confidence / 100
      };

      // 5. Update State (Ensemble Result at the top)
      setResults([ensembleConsensus, ...individualResults]);
      toast.success(t("toast.restored") || "Analysis Complete.");

    } catch (error) {
      console.error("Prediction Error:", error);
      toast.error("Connection Failed. Ensure Python backend is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex font-body relative">
      {/* Sidebar Navigation */}
      <nav className="fixed left-0 top-0 h-full w-20 border-r bg-card hidden md:flex flex-col items-center py-8 z-50">
        <div className="w-12 h-12 rounded-2xl gradient-medical flex items-center justify-center text-white shadow-lg shadow-primary/20 mb-10">
          <Stethoscope size={24} />
        </div>
        
        <div className="flex flex-col space-y-6">
          <button className="p-3 rounded-xl bg-primary/10 text-primary">
            <LayoutDashboard size={22} />
          </button>
        </div>
      </nav>

      <div className="flex-1 md:ml-20">
        <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-md px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black tracking-tight text-foreground uppercase font-display">
              {t("app.title")}
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            <LanguageToggle />
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 text-xs font-bold">
              <Activity size={14} className="animate-pulse" />
              AI MODELS READY
            </div>
          </div>
        </header>

        <main className="p-6 lg:p-10 max-w-[1600px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            
            {/* Input Panel */}
            <div className="lg:col-span-5 xl:col-span-4">
              <div className="bg-card border rounded-[2rem] p-8 shadow-sm space-y-6 sticky top-24">
                <div>
                  <h2 className="text-2xl font-black text-foreground mb-1 font-display uppercase tracking-tight">
                    {t("predictions.selectSymptoms")}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {t("predictions.selectSymptomsDesc")}
                  </p>
                </div>

                <SymptomSelector 
                  selected={selectedSymptoms} 
                  onToggle={handleToggleSymptom}
                  onClear={handleClearAll}
                />

                <button
                  onClick={handlePredict}
                  disabled={loading || selectedSymptoms.length === 0}
                  className="w-full py-5 rounded-2xl bg-primary text-white font-black text-lg shadow-xl shadow-primary/30 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50"
                >
                  {loading ? t("analyzing") || "ANALYZING..." : t("predictions.results").toUpperCase()}
                </button>
              </div>
            </div>

            {/* Results Panel */}
            <div className="lg:col-span-7 xl:col-span-8">
              <div className="space-y-6">
                <div className="flex items-center justify-between px-2">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-8 bg-primary rounded-full" />
                    <h2 className="text-2xl font-black text-foreground font-display uppercase italic">
                      {t("predictions.title")}
                    </h2>
                  </div>
                  
                  {results.length > 0 && (
                    <button 
                      onClick={() => window.print()}
                      className="flex items-center gap-2 text-xs font-bold text-primary hover:underline"
                    >
                      <FileText size={16} />
                      {t("export_pdf") || "EXPORT PDF"}
                    </button>
                  )}
                </div>
                
                <div className="bg-card border rounded-[2rem] p-8 shadow-sm min-h-[700px]">
                  <PredictionResults 
                    results={results} 
                    selectedSymptoms={selectedSymptoms} 
                  />
                </div>
              </div>
            </div>

          </div>
        </main>
      </div>

      <HealthChatbot />
    </div>
  );
};

export default Index;