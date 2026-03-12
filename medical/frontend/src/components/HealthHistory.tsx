import { useTranslation } from "react-i18next";
import { HealthCheck } from "@/hooks/useHealthHistory";
import { Clock, Trash2, RotateCcw, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HealthHistoryProps {
  history: HealthCheck[];
  onRestore: (symptoms: string[]) => void;
  onDelete: (id: string) => void;
  onClear: () => void;
}

function useTimeAgo() {
  const { t } = useTranslation();
  return (ts: number) => {
    const diff = Date.now() - ts;
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return t("time.justNow");
    if (mins < 60) return t("time.minsAgo", { count: mins });
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return t("time.hrsAgo", { count: hrs });
    const days = Math.floor(hrs / 24);
    return t("time.daysAgo", { count: days });
  };
}

export default function HealthHistory({ history, onRestore, onDelete, onClear }: HealthHistoryProps) {
  const { t } = useTranslation();
  const timeAgo = useTimeAgo();

  if (history.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <Clock className="h-8 w-8 mx-auto mb-2 opacity-40" />
        <p className="text-sm">{t("history.noChecks")}</p>
        <p className="text-xs mt-1">{t("history.noChecksDesc")}</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">
          {t("history.savedChecks", { count: history.length })}
        </span>
        <Button variant="ghost" size="sm" className="h-7 text-xs text-destructive hover:text-destructive" onClick={onClear}>
          <Trash2 className="h-3 w-3 mr-1" />
          {t("history.clearAll")}
        </Button>
      </div>

      <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
        {history.map((check) => (
          <div
            key={check.id}
            className="rounded-lg border border-border bg-card p-3 text-sm transition-colors hover:bg-accent/30"
          >
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                {timeAgo(check.timestamp)}
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => onRestore(check.symptoms)}
                  className="p-1 rounded hover:bg-primary/10 text-primary transition-colors"
                  title={t("history.restoreSymptoms")}
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => onDelete(check.id)}
                  className="p-1 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                  title={t("history.delete")}
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {check.topResult && (
              <p className="text-xs font-medium text-foreground mb-1.5">
                {t("history.top")}: {check.topResult}{" "}
                <span className="text-primary font-bold">
                  {check.topScore ? `${Math.round(check.topScore * 100)}%` : ""}
                </span>
              </p>
            )}

            <div className="flex flex-wrap gap-1">
              {check.symptoms.map((s) => (
                <span key={s} className="px-1.5 py-0.5 rounded bg-secondary text-secondary-foreground text-[10px]">
                  {s}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
