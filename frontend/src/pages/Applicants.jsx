import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { 
  ArrowLeft, 
  MessageSquare, 
  Check, 
  X, 
  User, 
  Sparkles, 
  Mail, 
  DollarSign, 
  Calendar, 
  AlertCircle, 
  Loader2, 
  ExternalLink 
} from "lucide-react";
import Navbar from "../components/Navbar";
import { getJobApplications, updateApplicationStatus } from "../api/applications";
import { createConversation } from "../api/conversations";

function Applicants() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updating, setUpdating] = useState(null);
  const [messaging, setMessaging] = useState(null);

  useEffect(() => {
    getJobApplications(id)
      .then(setApplications)
      .catch((requestError) => setError(requestError.response?.data?.detail || "Không thể tải danh sách ứng viên."))
      .finally(() => setLoading(false));
  }, [id]);

  const changeStatus = async (applicationId, status) => {
    setUpdating(applicationId);
    setError("");
    try {
      const updated = await updateApplicationStatus(applicationId, status);
      setApplications((current) => current.map((item) => item.id === updated.id ? updated : item));
    } catch (requestError) {
      setError(requestError.response?.data?.detail || "Không thể cập nhật trạng thái ứng viên.");
    } finally {
      setUpdating(null);
    }
  };

  const messageFreelancer = async (application) => {
    setMessaging(application.id);
    setError("");
    try {
      const conversation = await createConversation(id, application.freelancer_id);
      navigate(`/conversations/${conversation.id}`);
    } catch (requestError) {
      setError(requestError.response?.data?.detail || "Không thể bắt đầu cuộc trò chuyện.");
    } finally {
      setMessaging(null);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "accepted":
        return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">Đã chấp nhận</span>;
      case "rejected":
        return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">Đã từ chối</span>;
      default:
        return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">Đang chờ duyệt</span>;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-10">
        <Link
          to={`/jobs/${id}`}
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quay lại bài đăng công việc</span>
        </Link>

        {/* Header */}
        <div className="pb-8 border-b border-slate-200 mb-8">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-600 mb-1.5">
            <Sparkles className="w-4 h-4" />
            <span>Client Workspace</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Danh sách ứng viên</h1>
          <p className="text-sm text-slate-500 mt-1">
            Đánh giá và phản hồi các đề xuất ứng tuyển được xếp hạng theo độ tương thích AI.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 flex items-center gap-3 text-rose-800 text-sm">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {loading && (
          <div className="flex flex-col items-center justify-center py-20 text-slate-500">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600 mb-3" />
            <p className="text-sm">Đang tải danh sách ứng viên...</p>
          </div>
        )}

        {!loading && !error && applications.length === 0 && (
          <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center max-w-lg mx-auto shadow-xs">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-4">
              <User className="w-6 h-6" />
            </div>
            <h3 className="text-base font-semibold text-slate-900">Chưa có ứng viên nào</h3>
            <p className="text-sm text-slate-500 mt-1">
              Bài đăng của bạn đang hiển thị trên hệ thống. Đề xuất từ Freelancer sẽ xuất hiện tại đây ngay khi được gửi.
            </p>
          </div>
        )}

        {/* Applications List */}
        {!loading && !error && applications.length > 0 && (
          <div className="space-y-4">
            {applications.map((application) => (
              <article
                key={application.id}
                className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs hover:shadow-md transition-all space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                      {(application.freelancer_name || "F")[0].toUpperCase()}
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-slate-900">
                        {application.freelancer_name || "Freelancer"}
                      </h2>
                      {application.freelancer_email && (
                        <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                          <Mail className="w-3.5 h-3.5" />
                          <span>{application.freelancer_email}</span>
                        </p>
                      )}
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
                        Ngân sách: ${application.proposed_budget}
                      </span>
                    )}
                    {application.delivery_days !== null && (
                      <span className="flex items-center gap-1 bg-slate-100 px-3 py-1.5 rounded-lg">
                        <Calendar className="w-3.5 h-3.5 text-blue-600" />
                        Thời gian: {application.delivery_days} ngày
                      </span>
                    )}
                    <Link
                      to={`/freelancers/${application.freelancer_id}`}
                      className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 hover:underline"
                    >
                      <span>Xem hồ sơ ứng viên</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    {application.status === "pending" && (
                      <>
                        <button
                          type="button"
                          disabled={updating === application.id}
                          onClick={() => changeStatus(application.id, "rejected")}
                          className="px-4 py-2 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                          <span>Từ chối</span>
                        </button>
                        <button
                          type="button"
                          disabled={updating === application.id}
                          onClick={() => changeStatus(application.id, "accepted")}
                          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Chấp nhận</span>
                        </button>
                      </>
                    )}

                    {application.status === "accepted" && (
                      <button
                        type="button"
                        disabled={messaging === application.id}
                        onClick={() => messageFreelancer(application)}
                        className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>{messaging === application.id ? "Đang mở chat..." : "Nhắn tin"}</span>
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

export default Applicants;