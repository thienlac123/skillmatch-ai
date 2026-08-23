import { useEffect, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { ArrowLeft, PlusCircle, AlertCircle, Loader2, Sparkles, DollarSign } from "lucide-react";
import Navbar from "../components/Navbar";
import { getCurrentUser } from "../api/auth";
import { createJob } from "../api/jobs";

function CreateJob() {
  const navigate = useNavigate();
  const [role, setRole] = useState(null);
  const [checkingRole, setCheckingRole] = useState(true);
  const [form, setForm] = useState({
    title: "",
    description: "",
    required_skills: "",
    budget_min: "",
    budget_max: "",
  });
  const [error, setError] = useState("");
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    getCurrentUser()
      .then((user) => setRole(user?.role))
      .catch(() => setRole(null))
      .finally(() => setCheckingRole(false));
  }, []);

  const handleChange = (event) => {
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    const budgetMin = form.budget_min ? Number(form.budget_min) : null;
    const budgetMax = form.budget_max ? Number(form.budget_max) : null;
    const skills = form.required_skills
      .split(",")
      .map((skill) => skill.trim())
      .filter(Boolean)
      .join(", ");

    if (!skills) {
      setError("Vui lòng nhập ít nhất một kỹ năng yêu cầu.");
      return;
    }
    if (budgetMin !== null && budgetMax !== null && budgetMax < budgetMin) {
      setError("Ngân sách tối đa phải lớn hơn hoặc bằng ngân sách tối thiểu.");
      return;
    }

    setCreating(true);
    try {
      await createJob({
        title: form.title.trim(),
        description: form.description.trim(),
        required_skills: skills,
        budget_min: budgetMin,
        budget_max: budgetMax,
      });
      navigate("/jobs", { state: { message: "Đăng tuyển công việc thành công!" } });
    } catch (requestError) {
      setError(requestError.response?.data?.detail || "Không thể tạo bài đăng công việc.");
    } finally {
      setCreating(false);
    }
  };

  if (checkingRole) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      </div>
    );
  }

  if (role !== "client") {
    return <Navigate to="/jobs" replace />;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-10">
        
        {/* Back Link */}
        <Link
          to="/jobs"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quay lại danh sách việc</span>
        </Link>

        <div className="bg-white border border-slate-200 rounded-2xl shadow-xl shadow-slate-200/50 p-6 sm:p-10">
          
          {/* Header */}
          <div className="mb-8 pb-6 border-b border-slate-100">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-600 mb-1.5">
              <Sparkles className="w-4 h-4" />
              <span>Dành cho Nhà tuyển dụng / Client</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Tạo bài đăng tuyển dụng</h1>
            <p className="text-sm text-slate-500 mt-1">
              Cung cấp chi tiết yêu cầu, bộ kỹ năng và ngân sách để hệ thống AI gợi ý đúng nhân sự phù hợp nhất.
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-100 flex items-start gap-3 text-rose-600 text-sm">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">
                Tiêu đề công việc <span className="text-rose-500">*</span>
              </label>
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Ví dụ: Xây dựng Dashboard quản trị thời gian thực với React"
                minLength={3}
                maxLength={255}
                required
                className="w-full px-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">
                Mô tả chi tiết yêu cầu & phạm vi công việc <span className="text-rose-500">*</span>
              </label>
              <textarea
                name="description"
                rows={5}
                value={form.description}
                onChange={handleChange}
                placeholder="Mô tả phạm vi dự án, kết quả mong đợi, kiến trúc hệ thống và các mốc thời gian..."
                minLength={10}
                required
                className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">
                Kỹ năng yêu cầu <span className="text-rose-500">*</span>
              </label>
              <input
                name="required_skills"
                value={form.required_skills}
                onChange={handleChange}
                placeholder="React, Node.js, PostgreSQL, Docker..."
                required
                className="w-full px-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all"
              />
              <p className="text-xs text-slate-500 mt-1.5">
                Ngăn cách các kỹ năng bằng dấu phẩy (,). Hệ thống AI sẽ tự động chuẩn hóa để tìm kiếm Freelancer phù hợp.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">
                  Ngân sách tối thiểu (USD / VNĐ)
                </label>
                <div className="relative">
                  <DollarSign className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    name="budget_min"
                    type="number"
                    min={0}
                    value={form.budget_min}
                    onChange={handleChange}
                    placeholder="500"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">
                  Ngân sách tối đa (USD / VNĐ)
                </label>
                <div className="relative">
                  <DollarSign className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    name="budget_max"
                    type="number"
                    min={0}
                    value={form.budget_max}
                    onChange={handleChange}
                    placeholder="1000"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-6 border-t border-slate-100 flex items-center justify-end gap-3">
              <Link
                to="/jobs"
                className="px-5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors"
              >
                Hủy bỏ
              </Link>

              <button
                type="submit"
                disabled={creating}
                className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:opacity-70 text-white text-sm font-semibold shadow-md shadow-blue-600/20 flex items-center gap-2 transition-all cursor-pointer"
              >
                {creating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Đang đăng tin...</span>
                  </>
                ) : (
                  <>
                    <PlusCircle className="w-4 h-4" />
                    <span>Đăng tin tuyển dụng</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

export default CreateJob;