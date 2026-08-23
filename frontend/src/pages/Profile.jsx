import { useEffect, useState } from "react";
import { 
  User, 
  Mail, 
  Clock, 
  Upload, 
  FileText, 
  Plus, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  Sparkles, 
  Save, 
  ExternalLink 
} from "lucide-react";
import Navbar from "../components/Navbar";
import {
  getProfile,
  uploadCV,
  addSkill,
  updateProfile,
  downloadCV,
} from "../api/profile";

function Profile() {
  const [profileData, setProfileData] = useState(null);
  const [skills, setSkills] = useState([]);
  const [file, setFile] = useState(null);
  const [skillName, setSkillName] = useState("");
  const [level, setLevel] = useState("intermediate");
  const [years, setYears] = useState(1);
  const [profileForm, setProfileForm] = useState({
    full_name: "",
    bio: "",
    experience_years: 0,
  });

  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [addingSkill, setAddingSkill] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [openingCv, setOpeningCv] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadProfile = async () => {
    try {
      setError("");
      const data = await getProfile();
      setProfileData(data);
      setSkills(data.skills || []);
      setProfileForm({
        full_name: data.full_name || "",
        bio: data.bio || "",
        experience_years: data.experience_years ?? 0,
      });
    } catch (err) {
      setError(err.response?.data?.detail || "Không thể tải hồ sơ.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let cancelled = false;

    const fetchProfile = async () => {
      try {
        const data = await getProfile();
        if (cancelled) return;
        setProfileData(data);
        setSkills(data.skills || []);
        setProfileForm({
          full_name: data.full_name || "",
          bio: data.bio || "",
          experience_years: data.experience_years ?? 0,
        });
      } catch (err) {
        if (!cancelled) {
          setError(err.response?.data?.detail || "Không thể tải hồ sơ.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchProfile();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleProfileChange = (event) => {
    setProfileForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSaveProfile = async (event) => {
    event.preventDefault();
    setSavingProfile(true);
    setError("");
    setMessage("");
    try {
      const data = await updateProfile({
        ...profileForm,
        experience_years: Number(profileForm.experience_years),
      });
      setProfileData((current) => ({ ...current, ...data }));
      setMessage("Lưu thông tin hồ sơ thành công!");
    } catch (err) {
      setError(err.response?.data?.detail || "Không thể lưu thông tin hồ sơ.");
    } finally {
      setSavingProfile(false);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Vui lòng chọn một tệp PDF.");
      return;
    }
    setUploading(true);
    setError("");
    setMessage("");
    try {
      await uploadCV(file);
      setMessage("Tải lên CV và trích xuất kỹ năng thành công!");
      await loadProfile();
    } catch (err) {
      setError(err.response?.data?.detail || "Tải lên CV thất bại.");
    } finally {
      setUploading(false);
    }
  };

  const handleOpenCv = async () => {
    setOpeningCv(true);
    setError("");
    try {
      const blob = await downloadCV();
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank", "noopener,noreferrer");
      window.setTimeout(() => URL.revokeObjectURL(url), 60_000);
    } catch (err) {
      setError(err.response?.data?.detail || "Không thể mở file CV.");
    } finally {
      setOpeningCv(false);
    }
  };

  const handleAddSkill = async (e) => {
    e.preventDefault();
    if (!skillName.trim()) return;
    setAddingSkill(true);
    setError("");
    setMessage("");
    try {
      const res = await addSkill(skillName.trim(), level, years);
      const added = res.skill || { name: skillName.trim(), level, years_experience: years };
      
      setSkills((prev) => [...prev, added]);
      setMessage(`Đã thêm kỹ năng "${skillName}" thành công!`);
      setSkillName("");
    } catch (err) {
      setError(err.response?.data?.detail || "Không thể thêm kỹ năng.");
    } finally {
      setAddingSkill(false);
    }
  };

  const email = profileData?.email || "N/A";

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-10">
        
        {/* Header */}
        <div className="pb-8 border-b border-slate-200 mb-8">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-600 mb-1.5">
            <Sparkles className="w-4 h-4" />
            <span>Tài khoản cá nhân</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Hồ sơ chuyên nghiệp</h1>
          <p className="text-sm text-slate-500 mt-1">
            Cập nhật thông tin chi tiết, kỹ năng và CV để tối ưu hóa gợi ý việc làm AI.
          </p>
        </div>

        {/* Notifications */}
        {message && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-3 text-emerald-800 text-sm">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{message}</span>
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
            <p className="text-sm">Đang tải thông tin hồ sơ...</p>
          </div>
        )}

        {!loading && !error && profileData && (
          profileData.role !== "freelancer" ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center text-slate-600 shadow-xs">
              Tài khoản Client quản lý các bài đăng tuyển dụng từ trang <strong>Jobs</strong>.
            </div>
          ) : (
            <div className="space-y-8">
              
              {/* Personal Info Form */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs">
                <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <User className="w-5 h-5 text-blue-600" />
                  <span>Thông tin cá nhân</span>
                </h2>

                <form onSubmit={handleSaveProfile} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                      Họ và tên
                    </label>
                    <input
                      name="full_name"
                      value={profileForm.full_name}
                      onChange={handleProfileChange}
                      placeholder="Ví dụ: Nguyễn Văn A"
                      className="w-full px-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                      Email đăng ký
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        disabled
                        value={email}
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-sm text-slate-500 cursor-not-allowed"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                      Số năm kinh nghiệm
                    </label>
                    <div className="relative">
                      <Clock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        name="experience_years"
                        type="number"
                        min="0"
                        step="0.5"
                        value={profileForm.experience_years}
                        onChange={handleProfileChange}
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                      Giới thiệu bản thân (Bio)
                    </label>
                    <textarea
                      name="bio"
                      rows={4}
                      value={profileForm.bio}
                      onChange={handleProfileChange}
                      placeholder="Mô tả ngắn gọn về chuyên môn, thế mạnh và các dự án tiêu biểu..."
                      minLength={20}
                      className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all"
                    />
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      type="submit"
                      disabled={savingProfile}
                      className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:opacity-70 text-white text-sm font-semibold shadow-md shadow-blue-600/20 flex items-center gap-2 transition-all cursor-pointer"
                    >
                      {savingProfile ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Đang lưu...</span>
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4" />
                          <span>Lưu thông tin</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>

              {/* Skills Card */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs">
                <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-blue-600" />
                  <span>Bộ kỹ năng chuyên môn</span>
                </h2>

                {skills.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mb-6">
                    {skills.map((s, idx) => {
                      const sName = typeof s === "object" ? s.name || s.skill_name || s.skill : s;
                      const sLevel = typeof s === "object" ? s.level : null;
                      const sYrs = typeof s === "object" ? s.years_experience : null;

                      return (
                        <div
                          key={idx}
                          className="p-3 rounded-xl border border-slate-100 bg-slate-50/70 flex items-center justify-between"
                        >
                          <div>
                            <strong className="text-sm font-semibold text-slate-900">{sName}</strong>
                            {sYrs !== undefined && sYrs !== null && (
                              <p className="text-xs text-slate-500">{sYrs} năm kn</p>
                            )}
                          </div>
                          {sLevel && (
                            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                              {sLevel}
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-sm text-slate-500 bg-slate-50 p-4 rounded-xl mb-6">
                    Chưa có kỹ năng nào. Bạn có thể thêm kỹ năng thủ công bên dưới hoặc tải lên CV.
                  </p>
                )}

                {/* Add Skill Subform */}
                <form
                  onSubmit={handleAddSkill}
                  className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-100"
                >
                  <input
                    type="text"
                    value={skillName}
                    onChange={(e) => setSkillName(e.target.value)}
                    placeholder="Tên kỹ năng (VD: React, Node.js)"
                    required
                    className="flex-1 px-4 py-2 bg-slate-50/50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all"
                  />
                  <select
                    value={level}
                    onChange={(e) => setLevel(e.target.value)}
                    className="px-3 py-2 bg-slate-50/50 border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                  <input
                    type="number"
                    value={years}
                    onChange={(e) => setYears(e.target.value)}
                    min="0"
                    placeholder="Số năm"
                    required
                    className="w-24 px-3 py-2 bg-slate-50/50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all"
                  />
                  <button
                    type="submit"
                    disabled={addingSkill}
                    className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
                  >
                    {addingSkill ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                    <span>Thêm</span>
                  </button>
                </form>
              </div>

              {/* CV Upload Section */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs">
                <h2 className="text-lg font-bold text-slate-900 mb-2 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-600" />
                  <span>Quản lý hồ sơ CV (PDF)</span>
                </h2>
                <p className="text-xs text-slate-500 mb-4">
                  {profileData.cv_text
                    ? "Văn bản CV đã được AI trích xuất và sẵn sàng tính điểm tương thích."
                    : "Tải lên CV bản PDF để hệ thống AI tự động gợi ý công việc chuẩn xác nhất."}
                </p>

                {profileData.cv_filename && (
                  <div className="mb-4 p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                      <FileText className="w-4 h-4 text-rose-500" />
                      <span>{profileData.cv_filename}</span>
                    </div>
                    <button
                      type="button"
                      onClick={handleOpenCv}
                      disabled={openingCv}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:underline cursor-pointer"
                    >
                      <span>{openingCv ? "Đang mở..." : "Xem file CV"}</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                {profileData.cv_text_preview && (
                  <details className="mb-4 text-xs text-slate-600 bg-slate-50/50 p-3 rounded-xl border border-slate-100">
                    <summary className="font-semibold text-slate-700 cursor-pointer">
                      Xem trước nội dung văn bản AI trích xuất
                    </summary>
                    <p className="mt-2 whitespace-pre-line leading-relaxed text-slate-500">
                      {profileData.cv_text_preview}
                    </p>
                  </details>
                )}

                <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={(e) => setFile(e.target.files[0])}
                    className="w-full sm:w-auto text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                  />
                  <button
                    type="button"
                    onClick={handleUpload}
                    disabled={uploading}
                    className="w-full sm:w-auto px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer shrink-0"
                  >
                    {uploading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Đang tải lên...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4" />
                        <span>Tải lên CV</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

            </div>
          )
        )}
      </main>
    </div>
  );
}

export default Profile;