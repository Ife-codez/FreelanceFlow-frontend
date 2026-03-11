import { NavLink } from "react-router-dom";
import { LayoutDashboard, Users, FolderKanban, CreditCard, X, Zap } from "lucide-react";

const Sidebar = ({ isOpen, setIsOpen }) => {
  const getLinkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-sm font-medium ${
      isActive
        ? "bg-blue-600 text-white shadow-lg shadow-blue-600/25"
        : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
    }`;

  return (
    <>
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      <aside
        className={`fixed z-50 top-0 left-0 h-screen w-[260px] transform transition-all duration-300 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      >
        {/* Decorative top accent */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-blue-500 via-blue-400 to-transparent" />

        <div className="flex flex-col h-full p-5">

          {/* Logo */}
          <div className="flex justify-between items-center mb-8 mt-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/40">
                <Zap size={16} className="text-white" fill="white" />
              </div>
              <div>
                <h2 className="text-slate-800 dark:text-white font-bold text-lg leading-none tracking-tight">
                  FreelanceFlow
                </h2>
                <p className="text-slate-400 dark:text-slate-500 text-[10px] uppercase tracking-widest mt-0.5">
                  Management Suite
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="lg:hidden text-slate-400 hover:text-slate-700 dark:hover:text-white transition"
            >
              <X size={18} />
            </button>
          </div>

          {/* Nav Label */}
          <p className="text-slate-400 dark:text-slate-600 text-[10px] uppercase tracking-widest font-semibold mb-3 px-4">
            Main Menu
          </p>

          {/* Navigation */}
          <nav className="flex-1 space-y-1">
            <NavLink to="/" end className={getLinkClass}>
              <LayoutDashboard size={17} />
              Dashboard
            </NavLink>
            <NavLink to="/clients" className={getLinkClass}>
              <Users size={17} />
              Clients
            </NavLink>
            <NavLink to="/projects" className={getLinkClass}>
              <FolderKanban size={17} />
              Projects
            </NavLink>
            <NavLink to="/payments" className={getLinkClass}>
              <CreditCard size={17} />
              Payments
            </NavLink>
          </nav>

          {/* Profile */}
          <div className="border-t border-slate-200 dark:border-slate-800 pt-4">
            <div className="flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-sm font-bold shadow-lg shadow-blue-600/30 flex-shrink-0">
                FL
              </div>
              <div className="min-w-0">
                <p className="text-slate-800 dark:text-white text-sm font-semibold leading-none mb-1">Freelancer</p>
                <p className="text-slate-400 text-xs truncate">freelancer@example.com</p>
              </div>
              <div className="ml-auto w-2 h-2 rounded-full bg-emerald-400 flex-shrink-0" />
            </div>
          </div>

        </div>
      </aside>
    </>
  );
};

export default Sidebar;