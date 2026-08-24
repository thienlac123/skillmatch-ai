import { useEffect, useState } from "react";
import { useSearchParams, useParams, useNavigate, Link } from "react-router-dom";
import { 
  ArrowLeft, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  BookOpen, 
  AlertCircle, 
  Loader2,
  Bot
} from "lucide-react";
import Navbar from "../components/Navbar";
import { getMatch } from "../api/matches";
import MatchScore from "../components/MatchScore";
import SkillGap from "../components/SkillGap";

function MatchResult() {
  const [searchParams] = useSearchParams();
  const { id } = useParams();
  const navigate = useNavigate();

  const matchId = id;
  const [result, setResult] = useState(null);
  const jobId = result?.job_id || searchParams.get("job_id");
  const [loading, setLoading] = useState(Boolean(matchId));
  const [error, setError] = useState(matchId ? "" : "Chưa có kết quả tương thích nào được chọn.");
  const [roadmapLoading, setRoadmapLoading] = useState(false);

  useEffect(() => {
    const calculateMatch = async () => {
      try {
        const data = await getMatch(matchId);
        setResult(data);
      } catch (requestError) {
        setError(
          requestError.response?.data?.detail ||
          "Không thể tải kết quả tương thích. Hãy đăng nhập đúng tài khoản Freelancer đã tạo kết quả này."
        );
      } finally {
        setLoading(false);
      }
    };

    if (matchId) calculateMatch();
  }, [matchId]);

  const handleRoadmap = async () => {
    setRoadmapLoading(true);
    try {
      navigate(`/roadmaps/new?job_id=${result.job_id}`);
    } finally {
      setRoadmapLoading(false);
    }
  };

  // Parser bóc tách chuyên biệt từng phần trong AI Explanation
 const parseExplanation = (text = "") => {
    if (!text) return [];

    const targetSections = [
      { key: "Overall Match", label: "Độ phù hợp tổng quan (Overall Match)" },
      { key: "Main Strengths", label: "Thế mạnh chính (Main Strengths)" },
      { key: "Main Skill Gaps", label: "Kỹ năng cần cải thiện (Main Skill Gaps)" },
      { key: "Practical Recommendation", label: "Khuyến nghị tuyển dụng (Recommendation)" },
    ];

    // Tìm vị trí xuất hiện của từng tiêu đề trong văn bản
    const matches = [];
    targetSections.forEach((sec) => {
      // Bắt mẫu: có thể có '###', '**', hoặc số thứ tự '1.', '2.' đứng trước tên mục
      const regex = new RegExp(`(?:#{1,6}\\s*)?(?:\\*\\*)?(?:\\d+\\.\\s*)?${sec.key}(?:\\*\\*)?[:\\s]*`, "i");
      const match = regex.exec(text);
      if (match) {
        matches.push({
          label: sec.label,
          startIndex: match.index + match[0].length,
          matchIndex: match.index,
        });
      }
    });

    // Sắp xếp các mục tìm thấy theo thứ tự xuất hiện từ đầu đến cuối
    matches.sort((a, b) => a.matchIndex - b.matchIndex);

    if (matches.length === 0) {
      return [{ title: "Nhận xét tổng quan", content: text.replace(/#{1,6}/g, "").replace(/\*\*/g, "").trim() }];
    }

    const results = [];
    for (let i = 0; i < matches.length; i++) {
      const current = matches[i];
      const nextMatch = matches[i + 1];
      const endIndex = nextMatch ? nextMatch.matchIndex : text.length;

      const rawContent = text.slice(current.startIndex, endIndex).trim();
      const cleanContent = rawContent
        .replace(/#{1,6}/g, "")
        .replace(/\*\*/g, "")
        .trim();

      if (cleanContent) {
        results.push({
          title: current.label,
          content: cleanContent,
        });
      }
    }

    return results;
  };

  const strengths = result?.strengths || [];
  const explanationSections = parseExplanation(result?.explanation || "");
  const gaps = result?.gaps || [];
  const fullMatches = strengths.length;
  const partialMatches = gaps.filter((gap) => gap.gap_type === "level_gap").length;
  const missingSkills = gaps.filter((gap) => gap.gap_type !== "level_gap").length;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-10">
        <Link
          to={jobId ? `/jobs/${jobId}` : "/jobs"}
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quay lại chi tiết công việc</span>
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
            <p className="text-sm font-medium text-slate-700">AI đang phân tích hồ sơ và tính điểm tương thích...</p>
          </div>
        )}

        {!loading && !error && result && (
          <div className="space-y-6">
            
            {/* Header & Score */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-600 mb-2">
                <Sparkles className="w-4 h-4" />
                <span>Kết quả phân tích AI</span>
              </div>
              <h1 className="text-2xl font-bold text-slate-900 mb-6">Đánh giá độ tương thích hồ sơ</h1>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                <div className="md:col-span-1">
                  <MatchScore score={result.score} />
                </div>
                
                {/* Breakdown Stats */}
                <div className="md:col-span-2 grid grid-cols-3 gap-3">
                  <div className="bg-emerald-50/70 border border-emerald-100 rounded-xl p-4 text-center">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 mx-auto mb-1" />
                    <div className="text-2xl font-extrabold text-emerald-700">{fullMatches}</div>
                    <span className="text-xs font-semibold text-emerald-800">Khớp hoàn toàn</span>
                  </div>

                  <div className="bg-amber-50/70 border border-amber-100 rounded-xl p-4 text-center">
                    <AlertTriangle className="w-5 h-5 text-amber-600 mx-auto mb-1" />
                    <div className="text-2xl font-extrabold text-amber-700">{partialMatches}</div>
                    <span className="text-xs font-semibold text-amber-800">Chưa đủ cấp độ</span>
                  </div>

                  <div className="bg-rose-50/70 border border-rose-100 rounded-xl p-4 text-center">
                    <XCircle className="w-5 h-5 text-rose-600 mx-auto mb-1" />
                    <div className="text-2xl font-extrabold text-rose-700">{missingSkills}</div>
                    <span className="text-xs font-semibold text-rose-800">Thiếu kỹ năng</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Strengths List */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs">
              <h2 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>Kỹ năng đáp ứng yêu cầu</span>
              </h2>

              {strengths.length === 0 ? (
                <p className="text-sm text-slate-500 bg-slate-50 p-4 rounded-xl">Chưa có kỹ năng nào đạt yêu cầu hoàn toàn.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {strengths.map((item, index) => (
                    <div
                      key={index}
                      className="p-4 rounded-xl bg-emerald-50/40 border border-emerald-100 text-sm space-y-1.5"
                    >
                      {typeof item === "object" ? (
                        <>
                          <div className="flex items-center justify-between">
                            <strong className="font-bold text-slate-900">{item.skill || item.name || "Matched skill"}</strong>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">Đã khớp</span>
                          </div>
                          <div className="text-xs text-slate-600 flex justify-between pt-1">
                            <span>Yêu cầu: {item.required_level || "-"}</span>
                            <span>Hiện có: {item.freelancer_level || "-"}</span>
                          </div>
                        </>
                      ) : (
                        <span>{String(item)}</span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Skill Gaps Component */}
            <SkillGap gaps={gaps} />

            {/* AI Explanation Clean Cards */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Bot className="w-4 h-4" />
                </div>
                <h2 className="text-base font-bold text-slate-900">Chi tiết nhận xét từ AI</h2>
              </div>

              <div className="space-y-4">
                {explanationSections.map((section, index) => {
                  // Bóc tách danh sách hoa thị (*) nếu có
                  const bullets = section.content
                    .split(/(?=\s\*\s|\n\*\s|^\*\s)/)
                    .map((b) => b.replace(/^\s*\*\s*/, "").trim())
                    .filter(Boolean);

                  const isList = bullets.length > 1;

                  return (
                    <div
                      key={index}
                      className="p-5 rounded-xl bg-slate-50/80 border border-slate-100 transition-all hover:bg-slate-50"
                    >
                      <div className="flex items-center gap-2.5 mb-2.5">
                        <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center shrink-0">
                          {index + 1}
                        </span>
                        <h3 className="text-sm font-bold text-slate-900">
                          {section.title}
                        </h3>
                      </div>

                      {isList ? (
                        <ul className="pl-8 space-y-2">
                          {bullets.map((bullet, bIdx) => (
                            <li key={bIdx} className="text-sm text-slate-600 list-disc leading-relaxed">
                              {bullet}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-sm text-slate-600 leading-relaxed pl-8">
                          {section.content}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Learning Roadmap CTA */}
            {gaps.length > 0 && (
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 sm:p-8 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg shadow-blue-500/25">
                <div>
                  <h3 className="text-lg font-bold">Cần cải thiện các kỹ năng còn thiếu?</h3>
                  <p className="text-xs sm:text-sm text-blue-100 mt-1">
                    Hệ thống AI có thể tự động tạo lộ trình học tập cá nhân hóa để giúp bạn bù đắp các khoảng trống kỹ năng trên.
                  </p>
                </div>
                <button
                  onClick={handleRoadmap}
                  disabled={roadmapLoading}
                  className="px-6 py-3 rounded-xl bg-white hover:bg-slate-100 active:bg-slate-200 text-blue-700 text-sm font-bold shadow-sm transition-all flex items-center gap-2 shrink-0 cursor-pointer"
                >
                  {roadmapLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <BookOpen className="w-4 h-4" />}
                  <span>Tạo lộ trình học tập</span>
                </button>
              </div>
            )}

          </div>
        )}
      </main>
    </div>
  );
}

export default MatchResult;