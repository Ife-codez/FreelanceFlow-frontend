import CustomButton from "../components/CustomButton";
import { Plus, Search } from "lucide-react";
import SearchInput from "../components/SearchInput";
import Status from "../components/Status";
import { projects } from "../data/projects";
const Projects = () => {
  const getStatusStyle = (status) => {
    switch (status) {
      case "In Progress":
        return "bg-blue-100 text-blue-700";
      case "Pending":
        return "bg-yellow-100 text-yellow-700";
      case "Completed":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  }
  return ( 
    <>
    <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
      <div className="flex flex-col gap-2">
        <h1 className="font-semibold text-3xl">Projects</h1>
        <p className="text-gray-600">Track and manage all your projects</p>
      </div>
      <div>
        <CustomButton label='Add projects' icon={Plus} iconSize={18} />
      </div>
    </div>
    <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 mb-5">
      <SearchInput placeholder='Search projects...' icon={Search} className="col-span-2 sm:col-span-4" />
      <Status statuses={["pending", "in-progress", "completed", "on-hold"]} className="col-span-1 sm:col-span-1" />
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {projects.map((project) => (
        <div className="bg-white p-6 rounded-xl border-[1px] border-gray-200 hover:shadow-md">
          <div className="flex justify-between mb-2">
            <p className="font-semibold text-[18px]">{project.projectTitle}</p>
            <span className={`px-3 py-1 rounded-full text-[11px] md:text-xs font-semibold ${getStatusStyle(project.status)}`}>
              {project.status}
            </span>
          </div>
          <p className="text-gray-400 text-sm mb-1">{project.clientName}</p>
          <p className="text-gray-400 text-sm mb-3">{project.companyName}</p>
          <p className="mb-3 text-sm">{project.description}</p>
          <hr className="text-gray-50 text[1px] mb-3 opacity-50" />
          <div className="flex justify-between">
            <div className="flex flex-col">
              <p className="text-gray-400">Budget</p>
              <p>{project.budget}</p>
            </div>
            <div className="flex flex-col">
              <p className="text-gray-400">Start date</p>
              <p>{project.startDate}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
    </>
   );
}
 
export default Projects;