import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { PlusCircle, Briefcase, AlertCircle, CheckCircle2, Loader2, Sparkles } from "lucide-react";
import Navbar from "../components/Navbar";
import JobCard from "../components/JobCard";
import { getJobs, getMyJobs } from "../api/jobs";
import { getCurrentUser } from "../api/auth";

function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);
  const location = useLocation();
  const [success] = useState(location.state?.message || "");

  useEffect(() => {
    getCurrentUser()
      .then(async (currentUser) => {
        const data =
          currentUser.role === "client"
            ? await getMyJobs()
            : await getJobs();

        setJobs(Array.isArray(data) ? data : data.items || []);
        setUser(currentUser);
      })
      .catch((requestError) => {
        setError(requestError.response?.data?.detail || "Không thể tải danh sách công việc.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-8 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2 text-blue-600 text-xs font-bold uppercase tracking-wider mb-1">
              <Sparkles className="w-4 h-4" />
              <span>{user?.role === "client" ? "Quản lý tuyển dụng" : "Thị trường việc làm"}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {user?.role === "client" ? "Công việc bạn đã đăng" : "Khám phá công việc phù hợp"}
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              {user?.role === "client"
                ? "Theo dõi và quản lý các bài đăng tuyển dụng của doanh nghiệp bạn."
                : "Tìm kiếm các cơ hội việc làm AI & Công nghệ dựa trên bộ kỹ năng của bạn."}
            </p>
          </div>

          {user?.role === "client" && (
            <Link
              to="/jobs/new"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-sm font-semibold shadow-md shadow-blue-600/20 transition-all self-start sm:self-auto"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Đăng việc mới</span>
            </Link>
          )}
        </div>

        {/* Notifications */}
        {success && (
          <div className="mt-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-3 text-emerald-800 text-sm">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{success}</span>
          </div>
        )}

        {error && (
          <div className="mt-6 p-4 rounded-xl bg-rose-50 border border-rose-200 flex items-center gap-3 text-rose-800 text-sm">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20 text-slate-500">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600 mb-3" />
            <p className="text-sm">Đang tải danh sách công việc...</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && jobs.length === 0 && (
          <div className="mt-8 bg-white border border-slate-200 rounded-2xl p-12 text-center max-w-lg mx-auto shadow-xs">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-4">
              <Briefcase className="w-6 h-6" />
            </div>
            <h3 className="text-base font-semibold text-slate-900">Hiện chưa có công việc nào</h3>
            <p className="text-sm text-slate-500 mt-1 mb-6">
              {user?.role === "client"
                ? "Bắt đầu đăng tin tuyển dụng đầu tiên để kết nối với các Freelancer tiềm năng."
                : "Hiện chưa có bài đăng phù hợp, hãy quay lại sau nhé!"}
            </p>
            {user?.role === "client" && (
              <Link
                to="/jobs/new"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-all"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Đăng tin ngay</span>
              </Link>
            )}
          </div>
        )}

        {/* Jobs Grid */}
        {!loading && !error && jobs.length > 0 && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default Jobs;