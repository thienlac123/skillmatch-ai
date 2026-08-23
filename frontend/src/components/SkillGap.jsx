import { AlertTriangle, AlertCircle } from "lucide-react";

function SkillGap({ gaps = [] }) {
  return (
    <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
          <AlertTriangle className="w-4 h-4" />
        </div>
        <h2 className="text-base font-bold text-slate-900">Kỹ năng cần cải thiện (Skill Gaps)</h2>
      </div>

      {gaps.length === 0 ? (
        <p className="text-sm text-slate-500 bg-slate-50 p-4 rounded-xl text-center">
          Tuyệt vời! Bạn không có khoảng trống kỹ năng nào cần bổ sung cho vị trí này.
        </p>
      ) : (
        <ul className="space-y-3">
          {gaps.map((gap, index) => {
            const isObject = typeof gap === "object";
            const isLevelGap = isObject && gap.gap_type === "level_gap";

            return (
              <li
                key={index}
                className="p-4 rounded-xl border border-slate-100 bg-slate-50/60 hover:bg-slate-50 transition-colors"
              >
                {isObject ? (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <strong className="text-sm font-semibold text-slate-900">
                        {gap.skill || gap.name || "Unknown skill"}
                      </strong>
                      <span
                        className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                          isLevelGap
                            ? "bg-amber-100 text-amber-700"
                            : "bg-rose-100 text-rose-700"
                        }`}
                      >
                        {isLevelGap ? "Thiếu cấp độ (Level gap)" : "Chưa có (Missing)"}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs text-slate-600 pt-1 border-t border-slate-200/60">
                      <div>
                        Yêu cầu: <span className="font-medium text-slate-800">{gap.required_level || "Chưa rõ"}</span>
                      </div>
                      {gap.freelancer_level && (
                        <div>
                          Hiện tại: <span className="font-medium text-slate-800">{gap.freelancer_level}</span>
                        </div>
                      )}
                      {gap.match_quality > 0 && (
                        <div>
                          Đáp ứng: <span className="font-medium text-slate-800">{gap.match_quality}%</span>
                        </div>
                      )}
                      <div>
                        Độ quan trọng: <span className="font-medium text-slate-800">{gap.importance || 0}/5</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <span className="text-sm text-slate-700 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-slate-400" />
                    {String(gap)}
                  </span>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

export default SkillGap;