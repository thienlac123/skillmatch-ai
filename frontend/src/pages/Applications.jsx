import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
  Briefcase, 
  MessageSquare, 
  DollarSign, 
  Calendar, 
  AlertCircle, 
  CheckCircle2, 
  Loader2, 
  Sparkles, 
  ExternalLink 
} from "lucide-react";
import Navbar from "../components/Navbar";
import { getMyApplications } from "../api/applications";
import { createConversation } from "../api/conversations";

function Applications() {
  const location = useLocation();
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [messaging, setMessaging] = useState(null);

  useEffect(() => {
    getMyApplications()
      .then(setApplications)
      .catch((requestError) => setError(requestError.response?.data?.detail || "Không thể tải danh sách ứng tuyển."))
      .finally(() => setLoading(false));
  }, []);

  const messageClient = async (application) => {
    setMessaging(application.id);
    setError("");
    try {
      const conversation = await createConversation(application.job_id, application.freelancer_id);
      navigate(`/conversations/${conversation.id}`);
    } catch (requestError) {
      setError(requestError.response?.data?.detail || "Chức năng nhắn tin chỉ khả dụng khi đề xuất được chấp nhận.");
    } finally {
      setMessaging(null);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "accepted":
        return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">Đã được chấp nhận</span>;
      case "rejected":
        return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">Đã bị từ chối</span>;
      default:
        return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">Đang chờ xét duyệt</span>;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-10">
        
        {/* Header */}
        <div className="pb-8 border-b border-slate-200 mb-8">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-600 mb-1.5">
            <Sparkles className="w-4 h-4" />
            <span>Freelancer Workspace</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Đề xuất của tôi</h1>
          <p className="text-sm text-slate-500 mt-1">
            Theo dõi trạng thái phản hồi và mức độ tương thích của các công việc bạn đã nộp đơn.
          </p>
        </div>

        {location.state?.message && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-3 text-emerald-800 text-sm">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{location.state.message}</span>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 flex items-center gap-3 text-rose-800 text-sm">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {loading && (
          <div className="flex flex-col items-center justify-center py-20 text-slate-500">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600 mb-3" />
            <p className="text-sm">Đang tải lịch sử ứng tuyển...</p>
          </div>
        )}

        {!loading && !error && applications.length === 0 && (
          <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center max-w-lg mx-auto shadow-xs">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-4">
              <Briefcase className="w-6 h-6" />
            </div>
            <h3 className="text-base font-semibold text-slate-900">Bạn chưa gửi đề xuất nào</h3>
            <p className="text-sm text-slate-500 mt-1 mb-6">
              Khám phá danh sách việc làm để tìm cơ hội phù hợp với bộ kỹ năng của bạn.
            </p>
            <Link
              to="/jobs"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-all"
            >
              <span>Xem công việc</span>
            </Link>
          </div>
        )}

        {/* List */}
        {!loading && !error && applications.length > 0 && (
          <div className="space-y-4">
            {applications.map((application) => (
              <article
                key={application.id}
                className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs hover:shadow-md transition-all space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                      <Briefcase className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-slate-900">Đơn ứng tuyển công việc</h2>
                      <p className="text-xs text-slate-500">Mã đơn: #{application.id.slice(0, 8)}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{application.match_score?.toFixed(1) ?? "-"}% tương thích</span>
                    </div>
                    {getStatusBadge(application.status)}
                  </div>
                </div>

                <p className="text-sm text-slate-700 bg-slate-50/60 p-4 rounded-xl border border-slate-100 whitespace-pre-line leading-relaxed">
                  {application.cover_letter}
                </p>

                <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                  <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-600">
                    {application.proposed_budget !== null && (
                      <span className="flex items-center gap-1 bg-slate-100 px-3 py-1.5 rounded-lg">
                        <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                        Ngân sách đề xuất: ${application.proposed_budget}
                      </span>
                    )}
                    {application.delivery_days !== null && (
                      <span className="flex items-center gap-1 bg-slate-100 px-3 py-1.5 rounded-lg">
                        <Calendar className="w-3.5 h-3.5 text-blue-600" />
                        Thời gian: {application.delivery_days} ngày
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <Link
                      to={`/jobs/${application.job_id}`}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
                    >
                      <span>Xem lại công việc</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>

                    {application.status === "accepted" && (
                      <button
                        type="button"
                        disabled={messaging === application.id}
                        onClick={() => messageClient(application)}
                        className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>{messaging === application.id ? "Đang mở chat..." : "Nhắn tin cho Client"}</span>
                      </button>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default Applications;