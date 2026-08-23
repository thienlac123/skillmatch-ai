import { BookOpen, Clock, CheckCircle2, ChevronRight } from "lucide-react";

function RoadmapCard({ item }) {
  const skillName = item?.skill || item?.name || "Kỹ năng";
  const priority = item?.priority || "medium";
  const weeks = item?.weeks ?? item?.duration_weeks ?? 1;
  const steps = item?.steps || item?.learning_steps || [];

  const getPriorityTheme = (p) => {
    switch (String(p).toLowerCase()) {
      case "high":
        return "bg-rose-50 text-rose-700 border-rose-200";
      case "low":
        return "bg-slate-100 text-slate-700 border-slate-200";
      default:
        return "bg-amber-50 text-amber-700 border-amber-200";
    }
  };

  return (
    <article className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs hover:shadow-md transition-all space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <BookOpen className="w-5 h-5" />
          </div>
          <h2 className="text-base font-bold text-slate-900">{skillName}</h2>
        </div>

        <span
          className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getPriorityTheme(
            priority
          )}`}
        >
          {String(priority).toUpperCase()} PRIORITY
        </span>
      </div>

      {/* Duration */}
      <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 bg-slate-50 px-3 py-2 rounded-xl w-fit">
        <Clock className="w-4 h-4 text-blue-600" />
        <span>
          Thời gian dự kiến: <strong>{weeks} tuần</strong>
        </span>
      </div>

      {/* Learning Steps */}
      {steps.length > 0 && (
        <div className="space-y-2.5 pt-1">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Các bước thực hành & học tập
          </h3>
          <ol className="space-y-2">
            {steps.map((step, index) => {
              const stepTitle =
                typeof step === "object" ? step.title || step.step : step;
              return (
                <li
                  key={index}
                  className="flex items-start gap-2.5 text-sm text-slate-700 bg-slate-50/60 p-3 rounded-xl border border-slate-100"
                >
                  <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {index + 1}
                  </span>
                  <span className="leading-relaxed">{stepTitle}</span>
                </li>
              );
            })}
          </ol>
        </div>
      )}
    </article>
  );
}

export default RoadmapCard;