import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { 
  ArrowLeft, 
  Briefcase, 
  DollarSign, 
  Sparkles, 
  Send, 
  Users, 
  AlertCircle, 
  Loader2, 
  CheckCircle2 
} from "lucide-react";
import Navbar from "../components/Navbar";
import { getJob } from "../api/jobs";
import { getCurrentUser } from "../api/auth";

function JobDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loadJob = async () => {
      try {
        const [data, currentUser] = await Promise.all([
          getJob(id),
          getCurrentUser(),
        ]);
        setJob(data);
        setUser(currentUser);
      } catch (err) {
        setError(err.response?.data?.detail || "Không thể tải chi tiết công việc.");
      } finally {
        setLoading(false);
      }
    };

    loadJob();
  }, [id]);

  const skillList = job?.required_skills
    ? job.required_skills.split(",").map((s) => s.trim()).filter(Boolean)
    : [];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-10">
        <Link
          to="/jobs"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quay lại danh sách việc</span>
        </Link>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 flex items-center gap-3 text-rose-800 text-sm">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {loading && (
          <div className="flex flex-col items-center justify-center py-20 text-slate-500">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600 mb-3" />
            <p className="text-sm">Đang tải chi tiết bài đăng...</p>
          </div>
        )}

        {!loading && !error && job && (
          <article className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-10 shadow-xl shadow-slate-200/50 space-y-8">
            
            {/* Header */}
            <div className="pb-6 border-b border-slate-100">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-600 mb-2">
                <Briefcase className="w-4 h-4" />
                <span>Chi tiết tuyển dụng</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                {job.title}
              </h1>

              {job.budget_min !== null && job.budget_max !== null && (
                <div className="mt-4 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-700 font-bold text-sm border border-emerald-200">
                  <DollarSign className="w-4 h-4" />
                  <span>Ngân sách: ${job.budget_min} - ${job.budget_max}</span>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="space-y-3">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">Mô tả công việc</h2>
              <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line bg-slate-50/60 p-5 rounded-2xl border border-slate-100">
                {job.description}
              </p>
            </div>

            {/* Required Skills */}
            <div className="space-y-3">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">Kỹ năng yêu cầu</h2>
              <div className="flex flex-wrap gap-2">
                {skillList.length > 0 ? (
                  skillList.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1.5 rounded-xl bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-200/60"
                    >
                      {skill}
                    </span>
                  ))
                ) : (
                  <p className="text-sm text-slate-400">Không yêu cầu kỹ năng cụ thể.</p>
                )}
              </div>
            </div>

            {/* Action Bar */}
<div className="pt-6 border-t border-slate-100 flex flex-wrap items-center gap-4">
  {user?.role === "freelancer" && (
    <>
      <button
        onClick={() => navigate(`/matches/${job.id}`)}
        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-sm shadow-md shadow-blue-500/25 transition-all cursor-pointer"
      >
        <Sparkles className="w-4 h-4 text-amber-300" />
        <span>Đánh giá độ tương thích AI</span>
      </button>

      <Link
        to={`/jobs/${job.id}/apply`}
        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-semibold text-sm shadow-md shadow-emerald-600/20 transition-all"
      >
        <Send className="w-4 h-4" />
        <span>Gửi đề xuất ứng tuyển</span>
      </Link>
    </>
  )}

  {user?.role === "client" && user.id === job.client_id && (
    <Link
      to={`/jobs/${job.id}/applicants`}
      className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-md shadow-blue-600/20 transition-all"
    >
      <Users className="w-4 h-4" />
      <span>Xem danh sách ứng viên</span>
    </Link>
  )}
</div>

          </article>
        )}
      </main>
    </div>
  );
}

export default JobDetail;