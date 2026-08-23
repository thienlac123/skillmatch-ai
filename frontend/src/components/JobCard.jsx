import { Link } from "react-router-dom";
import { ArrowRight, DollarSign, Briefcase } from "lucide-react";

function JobCard({ job }) {
  return (
    <article className="bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-lg hover:border-blue-200 transition-all flex flex-col justify-between group">
      <div>
        <div className="flex items-start justify-between gap-4 mb-3">
          <h2 className="text-lg font-semibold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">
            {job.title}
          </h2>
          <span className="p-2 rounded-xl bg-blue-50 text-blue-600 shrink-0">
            <Briefcase className="w-4 h-4" />
          </span>
        </div>

        <p className="text-sm text-slate-600 line-clamp-3 mb-4 leading-relaxed">
          {job.description}
        </p>
      </div>

      <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
        {job.budget_min !== null && job.budget_max !== null ? (
          <div className="flex items-center text-sm font-semibold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
            <DollarSign className="w-3.5 h-3.5 mr-0.5" />
            <span>
              {job.budget_min} - {job.budget_max}
            </span>
          </div>
        ) : (
          <span className="text-xs text-slate-400">Thương lượng</span>
        )}

        <Link
          to={`/jobs/${job.id}`}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors group-hover:translate-x-0.5 transform duration-150"
        >
          <span>Xem chi tiết</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </article>
  );
}

export default JobCard;