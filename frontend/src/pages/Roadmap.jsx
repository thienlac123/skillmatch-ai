import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { 
  Map, 
  Sparkles, 
  Calendar, 
  ChevronRight, 
  Target, 
  AlertCircle, 
  Loader2,
} from "lucide-react";
import Navbar from "../components/Navbar";
import { generateRoadmap, getRoadmaps } from "../api/roadmaps";
import RoadmapCard from "../components/RoadmapCard";

function Roadmap() {
  const [searchParams] = useSearchParams();
  const jobId = searchParams.get("job_id");

  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    let isCancelled = false;

    const load = async () => {
      setLoading(true);
      setError("");
      setRoadmap(null);

      try {
        if (jobId) {
          const data = await generateRoadmap(jobId);
          if (!isCancelled) {
            setRoadmap(data);
          }
        } else {
          const data = await getRoadmaps();
          if (!isCancelled) {
            setRoadmap(data);
          }
        }
      } catch (requestError) {
        if (!isCancelled) {
          setError(
            requestError.response?.data?.detail ||
            "Không thể tạo hoặc tải lộ trình học tập cá nhân hóa."
          );
        }
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    };

    load();

    return () => {
      isCancelled = true;
    };
  }, [jobId, retryKey]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-10">
        <div className="pb-8 border-b border-slate-200 mb-8">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-600 mb-1.5">
            <Sparkles className="w-4 h-4" />
            <span>AI Learning Assistant</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Lộ trình học tập cá nhân hóa
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Chương trình tự đào tạo do AI thiết kế giúp bạn bổ sung khoảng trống kỹ năng để đạt yêu cầu công việc.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 flex items-center gap-3 text-rose-800 text-sm">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
            <div className="flex-1">
              <p>{error}</p>
              <button
                type="button"
                onClick={() => {
                  setError("");
                  setRetryKey((current) => current + 1);
                }}
                className="mt-3 rounded-lg bg-rose-700 px-3 py-1.5 text-xs font-semibold text-white hover:bg-rose-800 cursor-pointer"
              >
                Thử lại
              </button>
            </div>
          </div>
        )}

        {loading && (
          <div className="flex flex-col items-center justify-center py-20 text-slate-500">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600 mb-3" />
            <p className="text-sm font-medium text-slate-700">
              {jobId ? "AI đang xây dựng lộ trình học tập tối ưu..." : "Đang tải danh sách lộ trình..."}
            </p>
          </div>
        )}

        {!loading && !error && Array.isArray(roadmap) && roadmap.length === 0 && (
          <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center max-w-lg mx-auto shadow-xs">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-4">
              <Map className="w-6 h-6" />
            </div>
            <h3 className="text-base font-semibold text-slate-900">Chưa có lộ trình học tập nào</h3>
            <p className="text-sm text-slate-500 mt-1 mb-6">
              Lộ trình sẽ được tạo khi bạn đánh giá mức độ phù hợp với một công việc cụ thể.
            </p>
            <Link
              to="/jobs"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-sm font-semibold shadow-md shadow-blue-600/20 transition-all cursor-pointer"
            >
              <span>Khám phá công việc</span>
            </Link>
          </div>
        )}

        {!Array.isArray(roadmap) && roadmap?.goal && (
          <div className="bg-white border border-blue-200 rounded-2xl p-6 shadow-xs mb-6 bg-gradient-to-r from-blue-50/50 to-white">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-600 mb-2">
              <Target className="w-4 h-4" />
              <span>Mục tiêu lộ trình</span>
            </div>
            <p className="text-sm text-slate-700 leading-relaxed font-medium">
              {roadmap.goal}
            </p>
          </div>
        )}

        {Array.isArray(roadmap) ? (
          <div className="space-y-4">
            {roadmap.map((entry) => (
              <article
                key={entry.id}
                className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs hover:shadow-md hover:border-blue-200 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <h2 className="text-base font-bold text-slate-900">
                      Lộ trình nâng cao kỹ năng nghề nghiệp
                    </h2>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100">
                      {entry.items?.length || 0} kỹ năng
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Khởi tạo: {new Date(entry.created_at).toLocaleDateString("vi-VN")}</span>
                  </p>
                </div>

                <Link
                  to={`/roadmaps/${entry.id}`}
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs font-semibold shadow-md shadow-blue-600/20 transition-all self-start sm:self-auto shrink-0 cursor-pointer"
                >
                  <span>Xem chi tiết lộ trình</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </article>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {roadmap?.items?.map((item, index) => (
              <RoadmapCard key={index} item={item} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default Roadmap;