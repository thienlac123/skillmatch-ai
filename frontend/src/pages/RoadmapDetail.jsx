import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Sparkles, Calendar, AlertCircle, Loader2 } from "lucide-react";
import Navbar from "../components/Navbar";
import RoadmapCard from "../components/RoadmapCard";
import { getRoadmapById } from "../api/roadmaps";

function RoadmapDetail() {
  const { id } = useParams();
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const data = await getRoadmapById(id);
        setRoadmap(data);
      } catch (err) {
        setError(err.response?.data?.detail || "Không thể tải chi tiết lộ trình.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchDetail();
    }
  }, [id]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-10">
        <Link
          to="/roadmaps"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quay lại danh sách lộ trình</span>
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
            <p className="text-sm">Đang tải nội dung lộ trình...</p>
          </div>
        )}

        {!loading && !error && roadmap && (
          <div className="space-y-6">
            
            {/* Header */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-600 mb-2">
                <Sparkles className="w-4 h-4" />
                <span>Chi tiết kế hoạch đào tạo</span>
              </div>
              <h1 className="text-2xl font-bold text-slate-900">
                Lộ trình học tập cá nhân hóa
              </h1>
              <p className="text-xs text-slate-500 mt-2 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                <span>Khởi tạo lúc: {new Date(roadmap.created_at).toLocaleString("vi-VN")}</span>
              </p>
              {roadmap.goal && (
                <div className="mt-5 rounded-xl border border-blue-100 bg-blue-50/60 p-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-blue-700">Mục tiêu học tập</p>
                  <p className="mt-1 text-sm leading-relaxed text-slate-700">{roadmap.goal}</p>
                </div>
              )}
            </div>

            {/* List Roadmap Cards */}
            <div className="space-y-4">
              {roadmap.items?.length > 0 ? (
                roadmap.items.map((item, index) => (
                  <RoadmapCard key={index} item={item} />
                ))
              ) : (
                <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center text-slate-500 text-sm shadow-xs">
                  Không có mục học tập nào trong lộ trình này.
                </div>
              )}
            </div>

          </div>
        )}
      </main>
    </div>
  );
}

export default RoadmapDetail;