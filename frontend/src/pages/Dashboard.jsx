import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { 
  User, 
  Briefcase, 
  Map, 
  FileText, 
  ArrowRight, 
  Sparkles, 
  PlusCircle, 
  MessageSquare 
} from "lucide-react";
import Navbar from "../components/Navbar";
import { getCurrentUser } from "../api/auth";

function Dashboard() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    getCurrentUser()
      .then((data) => setUser(data))
      .catch(() => setUser(null));
  }, []);

  const isClient = user?.role === "client";

  const freelancerCards = [
    {
      title: "Hồ sơ cá nhân",
      description: "Xem và cập nhật kỹ năng, kinh nghiệm và CV để tối ưu gợi ý AI.",
      link: "/profile",
      icon: User,
      color: "blue",
      tag: "Profile",
    },
    {
      title: "Khám phá việc làm",
      description: "Tìm kiếm dự án phù hợp và kiểm tra điểm tương thích kỹ năng.",
      link: "/jobs",
      icon: Briefcase,
      color: "emerald",
      tag: "Jobs",
    },
    {
      title: "Lộ trình học tập",
      description: "Xem các kế hoạch đào tạo cá nhân hóa để nâng cao trình độ.",
      link: "/roadmaps",
      icon: Map,
      color: "indigo",
      tag: "AI Roadmap",
    },
    {
      title: "Đề xuất đã nộp",
      description: "Theo dõi tiến độ, trạng thái phê duyệt của các đơn ứng tuyển.",
      link: "/applications",
      icon: FileText,
      color: "amber",
      tag: "Proposals",
    },
  ];

  const clientCards = [
    {
      title: "Đăng tin tuyển dụng",
      description: "Tạo bài đăng tuyển mới với các yêu cầu kỹ năng và ngân sách cụ thể.",
      link: "/jobs/new",
      icon: PlusCircle,
      color: "blue",
      tag: "Create Job",
    },
    {
      title: "Quản lý việc đã đăng",
      description: "Xem danh sách việc làm và duyệt các ứng viên tiềm năng nộp đơn.",
      link: "/jobs",
      icon: Briefcase,
      color: "emerald",
      tag: "Marketplace",
    },
    {
      title: "Hộp thư trao đổi",
      description: "Trao đổi trực tiếp với Freelancer đã được phê duyệt về dự án.",
      link: "/conversations",
      icon: MessageSquare,
      color: "indigo",
      tag: "Messages",
    },
    {
      title: "Hồ sơ doanh nghiệp",
      description: "Quản lý thông tin tài khoản và cấu hình nhà tuyển dụng.",
      link: "/profile",
      icon: User,
      color: "amber",
      tag: "Account",
    },
  ];

  const cards = isClient ? clientCards : freelancerCards;

  const getColorClasses = (color) => {
    switch (color) {
      case "emerald":
        return {
          bg: "bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white",
          tag: "bg-emerald-50 text-emerald-700 border-emerald-200",
        };
      case "indigo":
        return {
          bg: "bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white",
          tag: "bg-indigo-50 text-indigo-700 border-indigo-200",
        };
      case "amber":
        return {
          bg: "bg-amber-50 text-amber-600 group-hover:bg-amber-600 group-hover:text-white",
          tag: "bg-amber-50 text-amber-700 border-amber-200",
        };
      default:
        return {
          bg: "bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white",
          tag: "bg-blue-50 text-blue-700 border-blue-200",
        };
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Hero Section */}
        <div className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-12 shadow-xs mb-10 relative overflow-hidden">
          <div className="max-w-2xl relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold mb-4">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>Nền tảng kết nối nhân tài AI</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Chào mừng bạn đến với{" "}
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                SkillMatch AI
              </span>
            </h1>
            <p className="text-slate-600 mt-3 text-base leading-relaxed">
              Khám phá các cơ hội việc làm chuẩn xác dựa trên bộ kỹ năng thực tế của bạn hoặc đăng tin tìm kiếm nhân tài công nghệ bằng trí tuệ nhân tạo.
            </p>
          </div>
        </div>

        {/* Action Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {cards.map((card, index) => {
            const Icon = card.icon;
            const theme = getColorClasses(card.color);

            return (
              <Link
                key={index}
                to={card.link}
                className="bg-white border border-slate-200 rounded-2xl p-7 shadow-xs hover:shadow-xl hover:border-blue-300 transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${theme.bg}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className={`text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border ${theme.tag}`}>
                      {card.tag}
                    </span>
                  </div>

                  <h2 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                    {card.title}
                  </h2>
                  <p className="text-sm text-slate-500 mt-2 leading-relaxed">
                    {card.description}
                  </p>
                </div>

                <div className="pt-6 border-t border-slate-100 mt-6 flex items-center gap-2 text-sm font-semibold text-blue-600 group-hover:translate-x-1 transition-transform">
                  <span>Truy cập ngay</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </Link>
            );
          })}
        </div>
      </main>
    </div>
  );
}

export default Dashboard;