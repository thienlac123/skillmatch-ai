import { CheckCircle2, Award } from "lucide-react";

function StrengthList({ strengths = [] }) {
  return (
    <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
          <Award className="w-4 h-4" />
        </div>
        <h2 className="text-base font-bold text-slate-900">Thế mạnh của bạn</h2>
      </div>

      {strengths.length === 0 ? (
        <p className="text-sm text-slate-500 bg-slate-50 p-4 rounded-xl text-center">
          Chưa tìm thấy thế mạnh tương đồng nổi bật với yêu cầu công việc.
        </p>
      ) : (
        <ul className="space-y-2.5">
          {strengths.map((item, index) => (
            <li
              key={index}
              className="flex items-start gap-2.5 p-3 rounded-xl bg-emerald-50/40 border border-emerald-100 text-sm text-slate-700"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span className="font-medium">{item}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default StrengthList;