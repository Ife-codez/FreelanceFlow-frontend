import { NavLink } from "react-router-dom";
import { LayoutDashboard, Users, FolderKanban, CreditCard, X, Zap, Eye, EyeOff, LogOut } from "lucide-react";
import { useState } from "react";
import { createPortal } from "react-dom";
import { loginUser, signupUser } from "../api/auth";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

const AuthModal = ({ onClose }) => {
  const { login } = useAuth();
  const [mode, setMode] = useState("login");
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    setLoading(true);
    try {
      let user;
      if (mode === "login") {
        user = await loginUser(form.email, form.password);
        toast.success("Welcome back!");
      } else {
        user = await signupUser(form.name, form.email, form.password);
        toast.success("Account created successfully!");
      }
      login(user);
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-slideUp">
        <div className="h-[3px] w-full bg-gradient-to-r from-blue-600 via-blue-400 to-transparent" />
        <div className="p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-slate-800 dark:text-white tracking-tight">
                {mode === "login" ? "Welcome back" : "Create account"}
              </h2>
              <p className="text-slate-400 text-sm mt-0.5">
                {mode === "login" ? "Sign in to your FreelanceFlow account" : "Get started with FreelanceFlow"}
              </p>
            </div>
            <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition">
              <X size={16} />
            </button>
          </div>

          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 rounded-xl p-1 mb-6">
            <button onClick={() => setMode("login")}
              className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all duration-200 ${
                mode === "login" ? "bg-white dark:bg-slate-700 text-slate-800 dark:text-white shadow-sm" : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
              }`}>Sign In</button>
            <button onClick={() => setMode("signup")}
              className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all duration-200 ${
                mode === "signup" ? "bg-white dark:bg-slate-700 text-slate-800 dark:text-white shadow-sm" : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
              }`}>Sign Up</button>
          </div>

          <div className="flex flex-col gap-4">
            {mode === "signup" && (
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Full Name</label>
                <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="John Doe"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition" />
              </div>
            )}

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Email Address</label>
              <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="you@example.com"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition" />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Password</label>
              <div className="relative">
                <input type={showPassword ? "text" : "password"} name="password" value={form.password} onChange={handleChange} placeholder="••••••••"
                  className="w-full px-4 py-2.5 pr-11 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition" />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition">
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {mode === "login" && (
              <div className="text-right -mt-2">
                <button className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-medium">Forgot password?</button>
              </div>
            )}

            <button onClick={handleSubmit} disabled={loading}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold rounded-xl text-sm shadow-sm shadow-blue-600/20 transition-all duration-200 mt-1">
              {loading ? "Please wait..." : mode === "login" ? "Sign In" : "Create Account"}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

const Sidebar = ({ isOpen, setIsOpen }) => {
  const [showAuth, setShowAuth] = useState(false);
  const { user, logout } = useAuth();

  const getInitials = (name) => {
    if (!name) return "?";
    const parts = name.trim().split(" ");
    return parts.length >= 2
      ? (parts[0][0] + parts[1][0]).toUpperCase()
      : parts[0].slice(0, 2).toUpperCase();
  };

  const handleLogout = async () => {
    await logout();
    toast.success("Signed out successfully");
  };
  const getLinkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-sm font-medium ${
      isActive
        ? "bg-blue-600 text-white shadow-lg shadow-blue-600/25"
        : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
    }`;

  return (
    <>
      {isOpen && (
        <div onClick={() => setIsOpen(false)} className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden" />
      )}

      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}

      <aside className={`fixed z-50 top-0 left-0 h-screen w-[260px] transform transition-all duration-300 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800
        ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}>

        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-blue-500 via-blue-400 to-transparent" />

        <div className="flex flex-col h-full p-5">
          {/* Logo */}
          <div className="flex justify-between items-center mb-8 mt-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/40">
                <Zap size={16} className="text-white" fill="white" />
              </div>
              <div>
                <h2 className="text-slate-800 dark:text-white font-bold text-lg leading-none tracking-tight">FreelanceFlow</h2>
                <p className="text-slate-400 dark:text-slate-500 text-[10px] uppercase tracking-widest mt-0.5">Management Suite</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="lg:hidden text-slate-400 hover:text-slate-700 dark:hover:text-white transition">
              <X size={18} />
            </button>
          </div>

          <p className="text-slate-400 dark:text-slate-600 text-[10px] uppercase tracking-widest font-semibold mb-3 px-4">Main Menu</p>

          <nav className="flex-1 space-y-1">
            <NavLink to="/" end className={getLinkClass}><LayoutDashboard size={17} />Dashboard</NavLink>
            <NavLink to="/clients" className={getLinkClass}><Users size={17} />Clients</NavLink>
            <NavLink to="/projects" className={getLinkClass}><FolderKanban size={17} />Projects</NavLink>
            <NavLink to="/payments" className={getLinkClass}><CreditCard size={17} />Payments</NavLink>
          </nav>

          {/* Profile */}
          <div className="border-t border-slate-200 dark:border-slate-800 pt-4 flex flex-col gap-1">

            {/* Profile row */}
            <div
              onClick={() => !user && setShowAuth(true)}
              className={`flex items-center gap-3 px-2 py-2 rounded-xl transition cursor-pointer ${
                user ? "cursor-default" : "hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-sm font-bold shadow-lg shadow-blue-600/30 flex-shrink-0">
                {getInitials(user?.name)}
              </div>
              <div className="min-w-0">
                <p className="text-slate-800 dark:text-white text-sm font-semibold leading-none mb-1 truncate">
                  {user?.name || "Guest"}
                </p>
                <p className="text-slate-400 text-xs truncate">
                  {user?.email || "Sign in to continue"}
                </p>
              </div>
              <div className={`ml-auto w-2 h-2 rounded-full flex-shrink-0 ${user ? "bg-emerald-400" : "bg-slate-300 dark:bg-slate-600"}`} />
            </div>

            {/* Sign out — only when logged in */}
            {user && (
              <button
                onClick={handleLogout}
                className="flex items-center justify-center gap-2 w-full text-xs text-red-500 dark:text-red-400 font-medium py-2 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition"
              >
                <LogOut size={13} />
                Sign out
              </button>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;