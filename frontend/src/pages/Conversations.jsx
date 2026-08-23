import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  MessageSquare, 
  Clock, 
  Sparkles, 
  AlertCircle, 
  Loader2, 
  ChevronRight,
  Briefcase
} from "lucide-react";
import Navbar from "../components/Navbar";
import { getConversations } from "../api/conversations";
import { getCurrentUser } from "../api/auth";

function Conversations() {
  const navigate = useNavigate();
  const [conversations, setConversations] = useState([]);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([getConversations(), getCurrentUser()])
      .then(([items, user]) => {
        setConversations(items);
        setRole(user.role);
      })
      .catch((requestError) => setError(requestError.response?.data?.detail || "Không thể tải danh sách tin nhắn."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-10">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Về trang chủ</span>
        </Link>

        {/* Header */}
        <div className="pb-8 border-b border-slate-200 mb-8">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-600 mb-1.5">
            <Sparkles className="w-4 h-4" />
            <span>{role === "client" ? "Client Workspace" : "Freelancer Workspace"}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Hộp thư trao đổi</h1>
          <p className="text-sm text-slate-500 mt-1">
            Quản lý và theo dõi toàn bộ thảo luận về phạm vi dự án, thỏa thuận và tiến độ công việc.
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
            <p className="text-sm">Đang tải danh sách cuộc trò chuyện...</p>
          </div>
        )}

        {!loading && !error && conversations.length === 0 && (
          <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center max-w-lg mx-auto shadow-xs">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="w-6 h-6" />
            </div>
            <h3 className="text-base font-semibold text-slate-900">Chưa có cuộc trò chuyện nào</h3>
            <p className="text-sm text-slate-500 mt-1">
              Cuộc trò chuyện sẽ tự động được tạo khi đề xuất công việc được nhà tuyển dụng chấp thuận.
            </p>
          </div>
        )}

        {/* List */}
        {!loading && !error && conversations.length > 0 && (
          <div className="space-y-3">
            {conversations.map((conversation) => (
              <div
                key={conversation.id}
                onClick={() => navigate(`/conversations/${conversation.id}`)}
                className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs hover:shadow-md hover:border-blue-300 transition-all cursor-pointer flex items-center justify-between gap-4 group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <Briefcase className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h2 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                        Trao đổi dự án #{conversation.job_id.slice(0, 8)}
                      </h2>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
                        Đang hoạt động
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      <span>Bắt đầu: {new Date(conversation.created_at).toLocaleString("vi-VN")}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-slate-400 group-hover:text-blue-600 transition-colors">
                  <span className="text-xs font-semibold hidden sm:inline">Mở tin nhắn</span>
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default Conversations;