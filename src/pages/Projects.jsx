import CustomButton from "../components/CustomButton";
import { Plus, Search, Calendar, DollarSign } from "lucide-react";
import SearchInput from "../components/SearchInput";
import Status from "../components/Status";
import { projects } from "../data/projects";

const Projects = () => {
  const getStatusStyle = (status) => {
    switch (status) {
      case "In Progress": return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300";
      case "Pending":     return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300";
      case "Completed":   return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300";
      case "On Hold":     return "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400";
      default:            return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  return (
    <div className="animate-fadeIn">

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 mb-8">
        <div>
          <p className="text-xs uppercase tracking-widest text-blue-500 font-semibold mb-1">Workspace</p>
          <h1 className="font-bold text-3xl text-slate-800 dark:text-white tracking-tight">Projects</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Track and manage all your projects</p>
        </div>
        <div className="flex items-start">
          <CustomButton label="Add Project" icon={Plus} iconSize={16} />
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

      {/* Project Cards */}
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
                {project.status}
              </span>
            </div>

            {/* Client */}
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                <span className="text-blue-600 dark:text-blue-400 text-[10px] font-bold">
                  {project.clientName?.slice(0, 1)}
                </span>
              </div>
              <p className="text-slate-500 dark:text-slate-400 text-sm">{project.clientName} · {project.companyName}</p>
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
                  <p className="text-slate-700 dark:text-slate-200 text-sm font-semibold">{project.budget}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-center">
                  <Calendar size={13} className="text-slate-400" />
                </div>
                <div className="text-right">
                  <p className="text-slate-400 dark:text-slate-500 text-[10px] uppercase tracking-wide">Start date</p>
                  <p className="text-slate-700 dark:text-slate-200 text-sm font-semibold">{project.startDate}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Projects;