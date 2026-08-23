import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { 
  ArrowLeft, 
  User, 
  Briefcase, 
  FileText, 
  Award, 
  Clock, 
  AlertCircle, 
  Loader2, 
  Sparkles 
} from "lucide-react";
import Navbar from "../components/Navbar";
import { getPublicProfile } from "../api/profile";

function FreelancerProfile() {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getPublicProfile(id)
      .then(setProfile)
      .catch((requestError) => setError(requestError.response?.data?.detail || "Không thể tải hồ sơ freelancer."))
      .finally(() => setLoading(false));
  }, [id]);

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
            <p className="text-sm">Đang tải thông tin hồ sơ...</p>
          </div>
        )}

        {!loading && !error && profile && (
          <div className="space-y-6">
            
            {/* Main Header Card */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
                <div className="w-16 h-16 rounded-2xl bg-blue-600 text-white font-bold text-2xl flex items-center justify-center shadow-lg shadow-blue-500/20 shrink-0">
                  {(profile.full_name || "F")[0].toUpperCase()}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-600 mb-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Hồ sơ Freelancer</span>
                  </div>
                  <h1 className="text-2xl font-bold text-slate-900">{profile.full_name || "Chưa đặt tên"}</h1>
                  
                  <div className="flex flex-wrap items-center gap-4 mt-3 text-xs font-medium text-slate-600">
                    <span className="flex items-center gap-1.5 bg-slate-100 px-3 py-1.5 rounded-lg">
                      <Clock className="w-3.5 h-3.5 text-blue-600" />
                      Kinh nghiệm: <strong>{profile.experience_years} năm</strong>
                    </span>
                    <span className="flex items-center gap-1.5 bg-slate-100 px-3 py-1.5 rounded-lg">
                      <FileText className="w-3.5 h-3.5 text-emerald-600" />
                      Trạng thái CV: <strong>{profile.cv_filename ? "Đã xác thực" : "Chưa tải lên"}</strong>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bio Section */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs">
              <h2 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
                <User className="w-4 h-4 text-blue-600" />
                <span>Giới thiệu bản thân</span>
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed bg-slate-50/60 p-4 rounded-xl border border-slate-100">
                {profile.bio || "Freelancer này chưa cập nhật thông tin giới thiệu."}
              </p>
            </div>

            {/* Skills Section */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs">
              <h2 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Award className="w-4 h-4 text-blue-600" />
                <span>Kỹ năng chuyên môn</span>
              </h2>

              {profile.skills && profile.skills.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {profile.skills.map((skill) => (
                    <div
                      key={skill.skill_id}
                      className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/70 hover:bg-slate-50 transition-colors"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <strong className="text-sm font-semibold text-slate-900">{skill.name}</strong>
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                          {skill.level}
                        </span>
                      </div>
                      <small className="text-xs text-slate-500 mt-1 block">
                        {skill.years_experience} năm kinh nghiệm
                      </small>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-500">Chưa có kỹ năng nào được liệt kê.</p>
              )}
            </div>

          </div>
        )}
      </main>
    </div>
  );
}

export default FreelancerProfile;