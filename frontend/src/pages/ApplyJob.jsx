import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Send, AlertCircle, Loader2, DollarSign, Calendar, Sparkles } from "lucide-react";
import Navbar from "../components/Navbar";
import { applyToJob } from "../api/applications";

function ApplyJob() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ cover_letter: "", proposed_budget: "", delivery_days: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await applyToJob({
        job_id: id,
        cover_letter: form.cover_letter.trim(),
        proposed_budget: form.proposed_budget ? Number(form.proposed_budget) : null,
        delivery_days: form.delivery_days ? Number(form.delivery_days) : null,
      });
      navigate("/applications", { state: { message: "Gửi đề xuất ứng tuyển thành công!" } });
    } catch (requestError) {
      setError(requestError.response?.data?.detail || "Không thể gửi đề xuất. Vui lòng thử lại.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-10">
        <Link
          to={`/jobs/${id}`}
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quay lại chi tiết công việc</span>
        </Link>

        <div className="bg-white border border-slate-200 rounded-2xl shadow-xl shadow-slate-200/50 p-6 sm:p-10">
          <div className="mb-8 pb-6 border-b border-slate-100">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-600 mb-1.5">
              <Sparkles className="w-4 h-4" />
              <span>Dành cho Freelancer</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Gửi đề xuất ứng tuyển (Proposal)</h1>
            <p className="text-sm text-slate-500 mt-1">
              Chia sẻ kinh nghiệm liên quan, giải pháp công nghệ và mức chi phí đề xuất để thuyết phục khách hàng.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-100 flex items-start gap-3 text-rose-600 text-sm">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">
                Thư giới thiệu (Cover letter) <span className="text-rose-500">*</span>
              </label>
              <textarea
                name="cover_letter"
                rows={6}
                value={form.cover_letter}
                onChange={handleChange}
                minLength={20}
                maxLength={5000}
                placeholder="Trình bày giải pháp kỹ thuật, kinh nghiệm tương tự và thời gian bạn có thể bắt đầu..."
                required
                className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all"
              />
              <span className="text-xs text-slate-400 mt-1 block">Tối thiểu 20 ký tự</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">
                  Ngân sách đề xuất (USD / VNĐ)
                </label>
                <div className="relative">
                  <DollarSign className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    name="proposed_budget"
                    type="number"
                    min={0}
                    value={form.proposed_budget}
                    onChange={handleChange}
                    placeholder="Không bắt buộc"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">
                  Thời gian bàn giao dự kiến (Số ngày)
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    name="delivery_days"
                    type="number"
                    min={1}
                    max={365}
                    value={form.delivery_days}
                    onChange={handleChange}
                    placeholder="Không bắt buộc"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100 flex items-center justify-end gap-3">
              <Link
                to={`/jobs/${id}`}
                className="px-5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors"
              >
                Hủy bỏ
              </Link>
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:opacity-70 text-white text-sm font-semibold shadow-md shadow-blue-600/20 flex items-center gap-2 transition-all cursor-pointer"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Đang gửi...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Gửi đề xuất</span>
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

export default ApplyJob;