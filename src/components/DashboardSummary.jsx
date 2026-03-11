const DashboardSummary = ({ summaries }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
      {summaries.map((summary) => {
        const Icon = summary.icon;
        return (
          <div key={summary.title} className="bg-white dark:bg-slate-900 rounded-xl px-3 py-5 border border-slate-200 dark:border-slate-800 shadow-card transition-colors duration-300">
            <div className="flex justify-between items-start px-3 mb-6">
              <p className="text-slate-500 dark:text-slate-400 font-semibold text-sm">{summary.title}</p>
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${summary.bg}`}>
                <Icon size={16} className={summary.color} />
              </div>
            </div>
            <div className="flex flex-col gap-1 px-3">
              <span className="text-3xl font-bold text-slate-800 dark:text-white">{summary.value}</span>
              <span className="text-slate-400 dark:text-slate-500 text-xs">{summary.description}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DashboardSummary;