import { useEffect, useState, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import { 
  ArrowLeft, 
  Send, 
  MessageSquare, 
  AlertCircle, 
  Loader2 
} from "lucide-react";
import Navbar from "../components/Navbar";
import { getMessages, sendMessage } from "../api/conversations";
import { getCurrentUser } from "../api/auth";

function Conversation() {
  const { id } = useParams();
  const [messages, setMessages] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    Promise.all([getMessages(id), getCurrentUser()])
      .then(([msgData, userData]) => {
        setMessages(msgData);
        setCurrentUser(userData);
        setTimeout(scrollToBottom, 100);
      })
      .catch((requestError) => {
        setError(requestError.response?.data?.detail || "Không thể tải nội dung tin nhắn.");
      })
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!content.trim()) return;
    setSending(true);
    setError("");
    try {
      const message = await sendMessage(id, content.trim());
      setMessages((current) => [...current, message]);
      setContent("");
    } catch (requestError) {
      setError(requestError.response?.data?.detail || "Không thể gửi tin nhắn.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-6 flex flex-col">
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-4">
          <Link
            to="/conversations"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Danh sách hộp thư</span>
          </Link>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Phòng chat bảo mật</span>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3.5 rounded-xl bg-rose-50 border border-rose-200 flex items-center gap-2 text-rose-800 text-sm">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Chat Window */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm flex flex-col h-[550px]">
          
          {/* Messages Area */}
          <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 flex flex-col">
            {loading && (
              <div className="h-full flex flex-col items-center justify-center text-slate-400">
                <Loader2 className="w-6 h-6 animate-spin text-blue-600 mb-2" />
                <p className="text-xs">Đang tải tin nhắn...</p>
              </div>
            )}

            {!loading && messages.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-center text-slate-400">
                <MessageSquare className="w-10 h-10 mb-2 opacity-40" />
                <p className="text-sm font-medium text-slate-600">Bắt đầu cuộc thảo luận</p>
                <p className="text-xs mt-1 max-w-xs text-slate-400">
                  Hãy gửi lời chào và thảo luận về các yêu cầu kỹ thuật cũng như kế hoạch triển khai.
                </p>
              </div>
            )}

            {!loading &&
              messages.map((message) => {
                const isMine =
                  currentUser &&
                  (message.sender_id === currentUser.id ||
                    message.user_id === currentUser.id ||
                    message.sender_role === currentUser.role);

                return (
                  <div
                    key={message.id}
                    className={`flex flex-col w-full ${
                      isMine ? "items-end" : "items-start"
                    }`}
                  >
                    <div
                      className={`rounded-2xl p-4 max-w-[85%] sm:max-w-[70%] shadow-xs leading-relaxed ${
                        isMine
                          ? "bg-blue-600 text-white rounded-br-xs"
                          : "bg-slate-100 text-slate-800 border border-slate-200/70 rounded-bl-xs"
                      }`}
                    >
                      <p className="text-sm whitespace-pre-line break-words">
                        {message.content}
                      </p>
                      <time
                        className={`text-[10px] mt-1.5 block ${
                          isMine ? "text-blue-100 text-right" : "text-slate-400 text-left"
                        }`}
                      >
                        {new Date(message.created_at).toLocaleTimeString("vi-VN", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </time>
                    </div>
                  </div>
                );
              })}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input */}
          <form onSubmit={handleSubmit} className="p-4 border-t border-slate-100 bg-slate-50/50 rounded-b-2xl">
            <div className="flex items-end gap-3">
              <textarea
                value={content}
                onChange={(event) => setContent(event.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e);
                  }
                }}
                rows={2}
                placeholder="Nhập tin nhắn... (Nhấn Enter để gửi)"
                maxLength={5000}
                required
                className="flex-1 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 resize-none transition-all"
              />
              <button
                type="submit"
                disabled={sending || !content.trim()}
                className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:opacity-50 text-white text-sm font-semibold shadow-md shadow-blue-600/20 flex items-center justify-center gap-2 transition-all cursor-pointer h-[50px] shrink-0"
              >
                {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                <span className="hidden sm:inline">Gửi</span>
              </button>
            </div>
          </form>

        </div>
      </main>
    </div>
  );
}

export default Conversation;