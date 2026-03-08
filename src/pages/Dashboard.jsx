import { useState } from "react";
import { projects } from "../data/projects";
import { payments } from "../data/payments";
import DashboardSummary from "../components/DashboardSummary";
import { NavLink } from "react-router-dom";
import { DollarSign, TrendingUp, Clock, FolderKanban } from "lucide-react";
const Dashboard = () => {
  const [summaries, useSummaries] = useState([
    {title: 'Total Income', value: '$34000', description: 'From paid invoices', icon: DollarSign, color: "text-teal-500"},
    {title: 'Outstanding', value: '$42000', description: 'Pending payments', icon: TrendingUp, color: "text-orange-600"},
    {title: 'Active Projects', value: '4', description: 'Currently in progress', icon: FolderKanban, color: "text-teal-500"  },
    {title: 'Overdue', value: '1', description: 'Payments overdue', icon: Clock, color: "text-red-500"},

  ])
  const getStatusStyle = (status) => {
    switch (status) {
      case "In Progress":
        return "bg-blue-100 text-blue-700";
      case "Pending":
        return "bg-yellow-100 text-yellow-700";
      case "Completed":
        return "bg-green-100 text-green-700";
      case "Paid":
        return "bg-green-100 text-green-700";
      case "Overdue":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  }
  return ( 
    <>
    <div className="flex flex-col gap-2 mb-8">
      <h1 className="font-semibold text-3xl">Dashboard</h1>
      <p className="text-gray-600">Welcome back! Here's your business overview.</p>
    </div>
    <DashboardSummary summaries={summaries} />
    <div className="grid lg:grid-cols-2 gap-3 mt-6">
      <div className="bg-white border-[1px] border-gray-200 py-7 px-5 rounded-xl">
        <h3 className=" font-semibold mb-5">Recent Projects</h3>
        <div className="flex flex-col gap-3">
          {projects.slice(0, 4).map((project) =>(
            <div key={project.id} className="bg-gray-50 rounded-xl p-4">
              <div className="flex justify-between mb-2">
              <p className="font-semibold text-sm sm:text-[15px]">{project.projectTitle}</p>
              <span className={`px-3 py-1 rounded-full text-[11px] md:text-xs font-semibold ${getStatusStyle( project.status )}`}>
                {project.status}
              </span>
              </div>
              <span className="text-gray-600 text-sm">{project.clientName}</span>
            </div>
          ))}
        </div>
        <div className="text-center mt-3">
        <NavLink to="/projects" className="text-teal-500 hover:underline">
          View all projects
        </NavLink>
        </div>
      </div>
      <div className="bg-white border-[1px] border-gray-200 py-7 px-5 rounded-xl">
        <h3 className=" font-semibold mb-5">Recent Payments</h3>
        <div className="flex flex-col gap-3">
          {payments.slice(0, 5).map((payment) =>(
            <div key={payment.invoiceNumber} className="bg-gray-50 rounded-xl p-4">
              <div className="flex justify-between mb-2">
                <p className="font-semibold">{payment.invoiceNumber}</p>
                <p>${payment.amount.toLocaleString()}</p>
              </div>
              <div className="flex justify-between mb-2">
                <p className="text-gray-600 text-sm">{payment.clientName}</p>
                 <span className={`px-3 py-1 rounded-full text-[11px] md:text-xs font-semibold ${getStatusStyle( payment.status )}`}>
                {payment.status}
              </span>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-3">
        <NavLink to="/payments" className="text-teal-500 hover:underline">
          View all payments
        </NavLink>
        </div>
      </div>
    </div>
    </>
   );
}
 
export default Dashboard;