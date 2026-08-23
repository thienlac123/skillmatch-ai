import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  Briefcase, 
  PlusCircle, 
  User, 
  FileText, 
  MessageSquare, 
  Map, 
  LogOut, 
  Sparkles,
  LayoutDashboard,
  LogIn
} from "lucide-react";
import { getCurrentUser } from "../api/auth";

function Navbar() {
  const [role, setRole] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      setIsAuthenticated(true);
      getCurrentUser()
        .then((user) => setRole(user?.role))
        .catch(() => {
          setRole(null);
          setIsAuthenticated(false);
        });
    } else {
      setIsAuthenticated(false);
      setRole(null);
    }
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    setIsAuthenticated(false);
    setRole(null);
    window.location.href = "/login";
  };

  const isActive = (path) => location.pathname === path;

  const navLinkClass = (path) =>
    `flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
      isActive(path)
        ? "text-blue-600 bg-blue-50 font-semibold"
        : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
    }`;

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-blue-600 bg-clip-text text-transparent">
            SkillMatch AI
          </span>
        </Link>

        {/* Navigation Links */}
        <nav className="flex items-center gap-1 sm:gap-2">
          {isAuthenticated ? (
            <>
              <Link to="/" className={navLinkClass("/")}>
                <LayoutDashboard className="w-4 h-4" />
                <span>Dashboard</span>
              </Link>

              <Link to="/jobs" className={navLinkClass("/jobs")}>
                <Briefcase className="w-4 h-4" />
                <span>Jobs</span>
              </Link>

              {role === "client" && (
                <Link
                  to="/jobs/new"
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition-all shadow-blue-600/20"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Post a Job</span>
                </Link>
              )}

              <Link to="/profile" className={navLinkClass("/profile")}>
                <User className="w-4 h-4" />
                <span>Profile</span>
              </Link>

              {role === "freelancer" && (
                <Link to="/applications" className={navLinkClass("/applications")}>
                  <FileText className="w-4 h-4" />
                  <span>Applications</span>
                </Link>
              )}

              <Link to="/conversations" className={navLinkClass("/conversations")}>
                <MessageSquare className="w-4 h-4" />
                <span>Messages</span>
              </Link>

              {role === "freelancer" && (
                <Link to="/roadmaps" className={navLinkClass("/roadmaps")}>
                  <Map className="w-4 h-4" />
                  <span>Roadmaps</span>
                </Link>
              )}

              {/* Divider & Logout */}
              <div className="h-5 w-[1px] bg-slate-200 mx-1.5 hidden sm:block" />

              <button
                onClick={handleLogout}
                title="Log out"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-rose-600 hover:bg-rose-50 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <LogIn className="w-4 h-4" />
                <span>Login</span>
              </Link>
              <Link
                to="/register"
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition-all"
              >
                <span>Register</span>
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Navbar;