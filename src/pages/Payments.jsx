import { useState } from "react";
import CustomButton from "../components/CustomButton";
import { Plus, Search, DollarSign, Clock, AlertCircle } from "lucide-react";
import SearchInput from "../components/SearchInput";
import Status from "../components/Status";
import { payments } from "../data/payments";

const Payments = () => {
  const [paymentSummaries] = useState([
    { summaryTitle: "Total Paid", avgSummary: "$34,000", icon: DollarSign, color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-900/20" },
    { summaryTitle: "Pending",    avgSummary: "$36,000", icon: Clock,       color: "text-yellow-600", bg: "bg-yellow-50 dark:bg-yellow-900/20" },
    { summaryTitle: "Overdue",    avgSummary: "$6,000",  icon: AlertCircle, color: "text-red-500",    bg: "bg-red-50 dark:bg-red-900/20" },
  ]);

  const getStatusStyle = (status) => {
    switch (status) {
      case "Paid":    return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300";
      case "Pending": return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300";
      case "Overdue": return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300";
      default:        return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  return (
    <div className="animate-fadeIn">

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 mb-8">
        <div>
          <p className="text-xs uppercase tracking-widest text-blue-500 font-semibold mb-1">Finance</p>
          <h1 className="font-bold text-3xl text-slate-800 dark:text-white tracking-tight">Payments</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Track invoices and payment status</p>
        </div>
        <div className="flex items-start">
          <CustomButton label="Create Invoice" icon={Plus} iconSize={16} />
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {paymentSummaries.map((summary, i) => {
          const Icon = summary.icon;
          return (
            <div
              key={summary.summaryTitle}
              className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-card animate-slideUp transition-colors duration-300"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <div className="flex items-center justify-between mb-4">
                <p className="text-slate-500 dark:text-slate-400 font-semibold text-sm">{summary.summaryTitle}</p>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${summary.bg}`}>
                  <Icon size={15} className={summary.color} />
                </div>
              </div>
              <p className="text-3xl font-bold text-slate-800 dark:text-white">{summary.avgSummary}</p>
            </div>
          );
        })}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="flex-1">
          <SearchInput placeholder="Search invoices..." icon={Search} />
        </div>
        <div className="sm:w-48">
          <Status statuses={["Paid", "Pending", "Overdue"]} />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-x-auto shadow-card">
        <table className="w-full text-sm text-left min-w-[700px]">

          {/* Head */}
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800">
              <th className="px-6 py-4 text-[11px] uppercase tracking-widest font-semibold text-slate-400 dark:text-slate-500">Invoice</th>
              <th className="px-6 py-4 text-[11px] uppercase tracking-widest font-semibold text-slate-400 dark:text-slate-500">Client</th>
              <th className="px-6 py-4 text-[11px] uppercase tracking-widest font-semibold text-slate-400 dark:text-slate-500">Project</th>
              <th className="px-6 py-4 text-[11px] uppercase tracking-widest font-semibold text-slate-400 dark:text-slate-500">Amount</th>
              <th className="px-6 py-4 text-[11px] uppercase tracking-widest font-semibold text-slate-400 dark:text-slate-500">Due Date</th>
              <th className="px-6 py-4 text-[11px] uppercase tracking-widest font-semibold text-slate-400 dark:text-slate-500">Status</th>
              <th className="px-6 py-4 text-[11px] uppercase tracking-widest font-semibold text-slate-400 dark:text-slate-500">Action</th>
            </tr>
          </thead>

          {/* Body */}
          <tbody>
            {payments.map((payment, i) => (
              <tr
                key={payment.invoiceNumber}
                className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors duration-150 animate-slideUp"
                style={{ animationDelay: `${i * 40}ms` }}
              >
                <td className="px-6 py-4 font-semibold text-slate-700 dark:text-slate-200">
                  {payment.invoiceNumber}
                </td>

                <td className="px-6 py-4">
                  <p className="font-medium text-slate-700 dark:text-slate-200">{payment.clientName}</p>
                  <p className="text-slate-400 text-xs">{payment.companyName}</p>
                </td>
                <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                  {payment.projectTitle}
                </td>

                <td className="px-6 py-4 font-bold text-slate-700 dark:text-slate-200">
                  ${payment.amount.toLocaleString()}
                </td>

                <td className="px-6 py-4 text-slate-500 dark:text-slate-400">
                  {payment.dueDate}
                </td>

                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold ${getStatusStyle(payment.status)}`}>
                    {payment.status}
                  </span>
                </td>

                <td className="px-6 py-4">
                  <button className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold text-sm transition-colors duration-150">
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Payments;