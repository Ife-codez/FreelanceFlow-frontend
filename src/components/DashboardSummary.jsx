
const DashboardSummary = ({summaries}) => {
  return ( 
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3" >
      {summaries.map((summary) =>{
        const Icon = summary.icon;
        return (
          <div key={summary.title} className="bg-white rounded-xl px-3 py-5 border-[1px] border-gray-200 ">
            <div className="flex justify-between">
            <p className="text-gray-500 font-semibold text-sm mb-8 px-3">{summary.title}</p>
            <Icon size={18} className={summary.color} />
            </div>
            <div className="flex flex-col gap-2 px-3">
              <span className="text-3xl">{summary.value}</span>
              <span className="text-gray-500 text-xs">{summary.description}</span>
            </div>

          </div>
        )
      })}
    </div>
   );
}
 
export default DashboardSummary ;