import { useState, useEffect } from "react";
import DashboardSummary from "../components/DashboardSummary";
import { NavLink } from "react-router-dom";
import { DollarSign, TrendingUp, Clock, FolderKanban, ArrowRight, Loader2 } from "lucide-react";
import { getProjects } from "../api/projects";
import { getPayments } from "../api/payments";

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projectsData, paymentsData] = await Promise.all([
          getProjects(),
          getPayments(),
        ]);
        setProjects(projectsData || []);
        setPayments(paymentsData || []);
      } catch (err) {
        // silently fail — sections will just be empty
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // ── Computed stats ───────────────────────────────────────────────────────────
  const totalIncome     = payments.filter(p => p.status === "PAID").reduce((sum, p) => sum + (p.amount || 0), 0);
  const totalOutstanding = payments.filter(p => p.status === "PENDING").reduce((sum, p) => sum + (p.amount || 0), 0);
  const activeProjects  = projects.filter(p => p.status === "IN_PROGRESS").length;
  const overduePayments = payments.filter(p => p.status === "OVERDUE").length;

  const summaries = [
    { title: "Total Income",    value: `$${totalIncome.toLocaleString()}`,     description: "From paid invoices",      icon: DollarSign,  color: "text-blue-600",    bg: "bg-blue-50 dark:bg-blue-900/20" },
    { title: "Outstanding",     value: `$${totalOutstanding.toLocaleString()}`, description: "Pending payments",        icon: TrendingUp,  color: "text-orange-500",  bg: "bg-orange-50 dark:bg-orange-900/20" },
    { title: "Active Projects", value: `${activeProjects}`,                    description: "Currently in progress",   icon: FolderKanban,color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-900/20" },
    { title: "Overdue",         value: `${overduePayments}`,                   description: "Payments overdue",        icon: Clock,       color: "text-red-500",     bg: "bg-red-50 dark:bg-red-900/20" },
  ];

  const getStatusStyle = (status) => {
    switch (status) {
      case "IN_PROGRESS": return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300";
      case "PENDING":     return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300";
      case "COMPLETED":   return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300";
      case "PAID":        return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300";
      case "OVERDUE":     return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300";
      case "ON_HOLD":     return "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400";
      default:            return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  const formatStatus = (status) => {
    const map = {
      IN_PROGRESS: "In Progress", PENDING: "Pending", COMPLETED: "Completed",
      ON_HOLD: "On Hold", PAID: "Paid", OVERDUE: "Overdue",
    };
    return map[status] ?? status;
  };

  return (
    <div className="animate-fadeIn">

      {/* Page Header */}
      <div className="mb-8">
        <p className="text-xs uppercase tracking-widest text-blue-500 font-semibold mb-1">Overview</p>
        <h1 className="font-bold text-3xl text-slate-800 dark:text-white tracking-tight">Dashboard</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Welcome back! Here's your business at a glance.</p>
      </div>

      {/* Summary Cards */}
      <DashboardSummary summaries={summaries} />

      {/* Recent Sections */}
      <div className="grid lg:grid-cols-2 gap-5 mt-8">

        {/* Recent Projects */}
        <div className="bg-white dark:bg-navy-800 border border-slate-200 dark:border-navy-700 rounded-2xl p-6 shadow-card animate-slideUp" style={{ animationDelay: "100ms" }}>
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-bold text-slate-800 dark:text-white text-lg">Recent Projects</h3>
              <p className="text-slate-400 text-xs mt-0.5">Latest active work</p>
            </div>
            <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
              <FolderKanban size={16} className="text-blue-600" />
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-10">
              <Loader2 size={20} className="animate-spin text-blue-500" />
            </div>
          ) : projects.length === 0 ? (
            <div className="flex items-center justify-center py-10">
              <p className="text-slate-400 text-sm">No projects yet</p>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {projects.slice(0, 4).map((project, i) => (
                <div
                  key={project.id}
                  className="group flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-navy-900/50 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200 animate-slideUp"
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  <div className="min-w-0">
                    <p className="font-semibold text-sm text-slate-700 dark:text-slate-200 truncate">{project.projectTitle}</p>
                    <p className="text-slate-400 text-xs mt-0.5">{project.client?.clientName}</p>
                  </div>
                  <span className={`ml-3 flex-shrink-0 px-2.5 py-1 rounded-full text-[11px] font-semibold ${getStatusStyle(project.status)}`}>
                    {formatStatus(project.status)}
                  </span>
                </div>
              ))}
            </div>
          )}

          <NavLink
            to="/projects"
            className="mt-4 flex items-center justify-center gap-1.5 text-blue-600 dark:text-blue-400 text-sm font-medium hover:gap-2.5 transition-all duration-200 group"
          >
            View all projects
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform duration-200" />
          </NavLink>
        </div>

        {/* Recent Payments */}
        <div className="bg-white dark:bg-navy-800 border border-slate-200 dark:border-navy-700 rounded-2xl p-6 shadow-card animate-slideUp" style={{ animationDelay: "200ms" }}>
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-bold text-slate-800 dark:text-white text-lg">Recent Payments</h3>
              <p className="text-slate-400 text-xs mt-0.5">Latest invoice activity</p>
            </div>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center">
              <DollarSign size={16} className="text-emerald-600" />
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-10">
              <Loader2 size={20} className="animate-spin text-blue-500" />
            </div>
          ) : payments.length === 0 ? (
            <div className="flex items-center justify-center py-10">
              <p className="text-slate-400 text-sm">No payments yet</p>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {payments.slice(0, 5).map((payment, i) => (
                <div
                  key={payment.id}
                  className="group flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-navy-900/50 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200 animate-slideUp"
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  <div className="min-w-0">
                    <p className="font-semibold text-sm text-slate-700 dark:text-slate-200">{payment.invoiceNumber}</p>
                    <p className="text-slate-400 text-xs mt-0.5">{payment.project?.projectTitle}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1 flex-shrink-0 ml-3">
                    <span className="font-bold text-sm text-slate-700 dark:text-slate-200">
                      ${payment.amount?.toLocaleString()}
                    </span>
                    <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold ${getStatusStyle(payment.status)}`}>
                      {formatStatus(payment.status)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          <NavLink
            to="/payments"
            className="mt-4 flex items-center justify-center gap-1.5 text-blue-600 dark:text-blue-400 text-sm font-medium hover:gap-2.5 transition-all duration-200 group"
          >
            View all payments
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform duration-200" />
          </NavLink>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;