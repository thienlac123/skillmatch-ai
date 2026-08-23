import { Sparkles } from "lucide-react";

function MatchScore({ score }) {
  const numericScore = Number(score) || 0;

  const getScoreTheme = (val) => {
    if (val >= 80) return { label: "Rất phù hợp (Strong match)", color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-200", ring: "text-emerald-500" };
    if (val >= 60) return { label: "Tiềm năng cao (Promising match)", color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-200", ring: "text-blue-500" };
    if (val >= 40) return { label: "Phù hợp một phần (Partial match)", color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-200", ring: "text-amber-500" };
    return { label: "Độ phù hợp thấp (Low match)", color: "text-rose-600", bg: "bg-rose-50", border: "border-rose-200", ring: "text-rose-500" };
  };

  const theme = getScoreTheme(numericScore);

  return (
    <section className={`rounded-2xl border ${theme.border} ${theme.bg} p-6 flex flex-col items-center justify-center text-center shadow-xs`}>
      <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
        <Sparkles className="w-4 h-4 text-amber-500" />
        <span>Điểm tương thích AI</span>
      </div>

      <div className={`text-4xl font-extrabold tracking-tight my-1 ${theme.color}`}>
        {numericScore.toFixed(1)}%
      </div>

      <p className={`text-sm font-semibold mt-1 ${theme.color}`}>
        {theme.label}
      </p>
    </section>
  );
}

export default MatchScore;