import { useState } from "react";
import CustomButton from "../components/CustomButton";
import { Plus,  Search } from "lucide-react";
import SearchInput from "../components/SearchInput";
import Status from "../components/Status";
import { payments } from "../data/payments";
const Payments = () => {
  const [paymentSummaries, usePaymentSummaries] = useState([
    {summaryTitle: 'Total paid', avgSummary: '$34,000'},
    {summaryTitle: 'Pending', avgSummary: '$36,000'},
    {summaryTitle: 'Overdue', avgSummary: '$6,000'}
  ])
  const getStatusStyle = (status) => {
    switch (status) {
      case "Paid":
        return "bg-green-100 text-green-700";
      case "Pending":
        return "bg-yellow-100 text-yellow-700";
      case "Overdue":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  }
  return ( 
    <>
      <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
        <div className="flex flex-col gap-2">
          <h1 className="font-semibold text-3xl">Payments</h1>
          <p className="text-gray-600">Track Invoices and payment status</p>
        </div>
        <div>
          <CustomButton label='Create Invoice' icon={Plus} iconSize={18} className="w-full sm:w-auto" />
        </div>
      </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">{paymentSummaries.map((paymentSummary) => (
      <div className="bg-white p-6 rounded-2xl border-[1px] border-gray-200">
        <p className="text-gray-500 font-semibold text-sm mb-6">{paymentSummary.summaryTitle}</p>
        <p className="text-3xl">{paymentSummary.avgSummary}</p>
      </div>
    ))}</div>
    <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 mb-5">
      <SearchInput placeholder='Search projects...' icon={Search} className="col-span-2 sm:col-span-4" />
      <Status statuses={["paid", "pending", "overdue"]} className="col-span-1 sm:col-span-1" />
    </div>
    <div className="bg-white rounded-xl border-[1px] border-gray-200 overflow-x-auto">
      <table className="w-full text-sm text-left min-w-[700px]">
        
        {/* Table Head */}
        <thead className="bg-gray-50 text-gray-600 uppercase text-xs tracking-wider">
          <tr className="border-b">
            <th className="px-6 py-4">Invoice</th>
            <th className="px-6 py-4">Client</th>
            <th className="px-6 py-4">Project</th>
            <th className="px-6 py-4">Amount</th>
            <th className="px-6 py-4">Due Date</th>
            <th className="px-6 py-4">Status</th>
            <th className="px-6 py-4">Action</th>
          </tr>
        </thead>

        {/* Table Body */}
        <tbody>
          {payments.map((payment) => (
            <tr key={payment.invoiceNumber} className="border-b hover:bg-gray-50 transition">
              
              <td className="px-6 py-4 font-medium">
                {payment.invoiceNumber}
              </td>

              <td className="px-6 py-4">
                <div className="flex flex-col">
                  <span>
                    {payment.clientName}
                  </span>
                  <span className="text-gray-500 text-sm">
                    {payment.companyName}
                  </span>
                </div>
              </td>

              <td className="px-6 py-4">
                {payment.projectTitle}
              </td>

              <td className="px-6 py-4 font-medium">
                ${payment.amount.toLocaleString()}
              </td>

              <td className="px-6 py-4">
                {payment.dueDate}
              </td>

              <td className="px-6 py-4">
                <span
                  className={`px-3 py-1 rounded-full text-[11px] md:text-xs font-semibold ${getStatusStyle(
                    payment.status
                  )}`}
                >
                  {payment.status}
                </span>
              </td>

              <td className="px-6 py-4">
                <button className="text-teal-600 hover:text-teal-700 font-medium text-sm">
                  View
                </button>
              </td>

            </tr>
          ))}
        </tbody>

      </table>
    </div>
    </>
   );
}
 
export default Payments;