import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import CustomButton from "../components/CustomButton";
import { Plus, Search, Calendar, DollarSign, X, Loader2, AlertCircle } from "lucide-react";
import SearchInput from "../components/SearchInput";
import Status from "../components/Status";
import { getProjects, createProject } from "../api/projects";
import { getClients } from "../api/clients";
import toast from "react-hot-toast";

// ── Add Project Modal ──────────────────────────────────────────────────────────
const AddProjectModal = ({ onClose, onSuccess }) => {
  const [form, setForm] = useState({
    projectTitle: "",
    description: "",
    budget: "",
    startDate: "",
    status: "PENDING",
    clientId: "",
  });
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getClients()
      .then(setClients)
      .catch(() => toast.error("Failed to load clients"));
  }, []);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async () => {
    if (!form.projectTitle || !form.budget || !form.startDate || !form.clientId) {
      toast.error("Please fill in all required fields");
      return;
    }
    setLoading(true);
    try {
      const newProject = await createProject({
        projectTitle: form.projectTitle,
        description: form.description,
        budget: Number(form.budget),
        startDate: form.startDate,
        status: form.status,
        clientId: form.clientId,
      });
      toast.success("Project created successfully!");
      onSuccess(newProject);
      onClose();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to create project");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition";

  const labelClass =
    "text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide";

  return createPortal(
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-slideUp">
        {/* Top accent bar */}
        <div className="h-[3px] w-full bg-gradient-to-r from-blue-600 via-blue-400 to-transparent" />

        <div className="p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-slate-800 dark:text-white tracking-tight">Add Project</h2>
              <p className="text-slate-400 text-sm mt-0.5">Fill in the details to create a new project</p>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              <X size={16} />
            </button>
          </div>

          {/* Form */}
          <div className="flex flex-col gap-4">
            {/* Project Title */}
            <div className="flex flex-col gap-1.5">
              <label className={labelClass}>Project Title</label>
              <input
                name="projectTitle"
                value={form.projectTitle}
                onChange={handleChange}
                placeholder="e.g. Brand Identity Redesign"
                className={inputClass}
              />
            </div>

            {/* Client */}
            <div className="flex flex-col gap-1.5">
              <label className={labelClass}>Client</label>
              <select name="clientId" value={form.clientId} onChange={handleChange} className={inputClass}>
                <option value="">Select a client...</option>
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.clientName} — {c.companyName}
                  </option>
                ))}
              </select>
            </div>

            {/* Description */}
            <div className="flex flex-col gap-1.5">
              <label className={labelClass}>Description</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Brief overview of the project scope..."
                rows={3}
                className={`${inputClass} resize-none`}
              />
            </div>

            {/* Budget & Start Date */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>Budget</label>
                <input
                  name="budget"
                  value={form.budget}
                  onChange={handleChange}
                  placeholder="e.g. 5000"
                  type="number"
                  className={inputClass}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>Start Date</label>
                <input
                  type="date"
                  name="startDate"
                  value={form.startDate}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>
            </div>

            {/* Status */}
            <div className="flex flex-col gap-1.5">
              <label className={labelClass}>Status</label>
              <select name="status" value={form.status} onChange={handleChange} className={inputClass}>
                <option value="PENDING">Pending</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="COMPLETED">Completed</option>
                <option value="ON_HOLD">On Hold</option>
              </select>
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold rounded-xl text-sm shadow-sm shadow-blue-600/20 transition-all duration-200 mt-1"
            >
              {loading ? "Creating project..." : "Create Project"}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

// ── Projects Page ──────────────────────────────────────────────────────────────
const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const fetchProjects = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getProjects();
      setProjects(data || []);
    } catch (err) {
      setError("Failed to load projects. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleProjectAdded = (newProject) => {
    setProjects((prev) => [newProject, ...prev]);
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "IN_PROGRESS": return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300";
      case "PENDING":     return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300";
      case "COMPLETED":   return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300";
      case "ON_HOLD":     return "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400";
      default:            return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  const formatStatus = (status) => {
    const map = { IN_PROGRESS: "In Progress", PENDING: "Pending", COMPLETED: "Completed", ON_HOLD: "On Hold" };
    return map[status] ?? status;
  };

  const formatDate = (iso) => {
    if (!iso) return "—";
    return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  return (
    <div className="animate-fadeIn">
      {/* Modal */}
      {showModal && (
        <AddProjectModal
          onClose={() => setShowModal(false)}
          onSuccess={handleProjectAdded}
        />
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 mb-8">
        <div>
          <p className="text-xs uppercase tracking-widest text-blue-500 font-semibold mb-1">Workspace</p>
          <h1 className="font-bold text-3xl text-slate-800 dark:text-white tracking-tight">Projects</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Track and manage all your projects</p>
        </div>
        <div className="flex items-start">
          <CustomButton label="Add Project" icon={Plus} iconSize={16} onClick={() => setShowModal(true)} />
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="flex-1">
          <SearchInput placeholder="Search projects..." icon={Search} />
        </div>
        <div className="sm:w-48">
          <Status statuses={["Pending", "In Progress", "Completed", "On Hold"]} />
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={24} className="animate-spin text-blue-500" />
        </div>
      )}

      {/* Error State */}
      {!loading && error && (
        <div className="flex flex-col items-center justify-center py-16 gap-4">
          <div className="w-12 h-12 rounded-2xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center">
            <AlertCircle size={22} className="text-red-400" />
          </div>
          <div className="text-center">
            <p className="text-slate-700 dark:text-slate-200 font-semibold mb-1">Something went wrong</p>
            <p className="text-slate-400 dark:text-slate-500 text-sm">{error}</p>
          </div>
          <button
            onClick={fetchProjects}
            className="px-4 py-2 rounded-xl text-sm font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
          >
            Try again
          </button>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && projects.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
            <Calendar size={24} className="text-slate-300 dark:text-slate-600" />
          </div>
          <div className="text-center">
            <p className="text-slate-700 dark:text-slate-200 font-semibold mb-1">No projects yet</p>
            <p className="text-slate-400 dark:text-slate-500 text-sm">Get started by adding your first project.</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-all"
          >
            <Plus size={14} /> Add Project
          </button>
        </div>
      )}

      {/* Project Cards */}
      {!loading && !error && projects.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {projects.map((project, i) => (
            <div
              key={project.id}
              className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 hover:shadow-lg hover:shadow-slate-200/60 dark:hover:shadow-none hover:-translate-y-0.5 transition-all duration-200 animate-slideUp"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <p className="font-bold text-slate-800 dark:text-white text-[17px] leading-snug">{project.projectTitle}</p>
                <span className={`flex-shrink-0 px-2.5 py-1 rounded-full text-[11px] font-semibold ${getStatusStyle(project.status)}`}>
                  {formatStatus(project.status)}
                </span>
              </div>

              {/* Client */}
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-600 dark:text-blue-400 text-[10px] font-bold">
                    {project.client?.clientName?.slice(0, 1)}
                  </span>
                </div>
                <p className="text-slate-500 dark:text-slate-400 text-sm">
                  {project.client?.clientName} · {project.client?.companyName}
                </p>
              </div>

              {/* Description */}
              <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-4 line-clamp-2">{project.description}</p>

              {/* Divider */}
              <div className="h-px bg-slate-100 dark:bg-slate-800 mb-4" />

              {/* Footer */}
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-center">
                    <DollarSign size={13} className="text-slate-400" />
                  </div>
                  <div>
                    <p className="text-slate-400 dark:text-slate-500 text-[10px] uppercase tracking-wide">Budget</p>
                    <p className="text-slate-700 dark:text-slate-200 text-sm font-semibold">${project.budget?.toLocaleString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-center">
                    <Calendar size={13} className="text-slate-400" />
                  </div>
                  <div className="text-right">
                    <p className="text-slate-400 dark:text-slate-500 text-[10px] uppercase tracking-wide">Start date</p>
                    <p className="text-slate-700 dark:text-slate-200 text-sm font-semibold">{formatDate(project.startDate)}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Projects;
