import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import CustomButton from "../components/CustomButton";
import { Plus, Search, DollarSign, Clock, AlertCircle, X, Loader2, FolderKanban, Calendar, Hash } from "lucide-react";
import SearchInput from "../components/SearchInput";
import Status from "../components/Status";
import { getPayments, createPayment, deletePayment } from "../api/payments";
import { getProjects } from "../api/projects";
import toast from "react-hot-toast";

// ── Helpers ────────────────────────────────────────────────────────────────────
const getStatusStyle = (status) => {
  switch (status) {
    case "PAID":    return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300";
    case "PENDING": return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300";
    case "OVERDUE": return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300";
    default:        return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300";
  }
};

const formatStatus = (status) => {
  const map = { PAID: "Paid", PENDING: "Pending", OVERDUE: "Overdue" };
  return map[status] ?? status;
};

const formatDate = (iso) => {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};

// ── Add Payment Modal ──────────────────────────────────────────────────────────
const AddPaymentModal = ({ onClose, onSuccess }) => {
  const [form, setForm] = useState({
    amount: "",
    dueDate: "",
    status: "PENDING",
    projectId: "",
  });
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getProjects()
      .then(setProjects)
      .catch(() => toast.error("Failed to load projects"));
  }, []);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async () => {
    if (!form.amount || !form.dueDate || !form.projectId) {
      toast.error("Please fill in all required fields");
      return;
    }
    setLoading(true);
    try {
      const newPayment = await createPayment({
        amount: Number(form.amount),
        dueDate: form.dueDate,
        status: form.status,
        projectId: form.projectId,
      });
      toast.success("Payment created successfully!");
      onSuccess(newPayment);
      onClose();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to create payment");
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
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-slideUp">
        <div className="h-[3px] w-full bg-gradient-to-r from-blue-600 via-blue-400 to-transparent" />
        <div className="p-8 max-h-[85vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-slate-800 dark:text-white tracking-tight">Create Invoice</h2>
              <p className="text-slate-400 text-sm mt-0.5">Add a new payment record</p>
            </div>
            <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition">
              <X size={16} />
            </button>
          </div>

          <div className="flex flex-col gap-4">
            {/* Project */}
            <div className="flex flex-col gap-1.5">
              <label className={labelClass}>Project</label>
              <select name="projectId" value={form.projectId} onChange={handleChange} className={inputClass}>
                <option value="">Select a project...</option>
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>{p.projectTitle}</option>
                ))}
              </select>
            </div>

            {/* Amount & Due Date */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>Amount</label>
                <input name="amount" value={form.amount} onChange={handleChange} placeholder="e.g. 2000" type="number" className={inputClass} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>Due Date</label>
                <input type="date" name="dueDate" value={form.dueDate} onChange={handleChange} className={inputClass} />
              </div>
            </div>

            {/* Status */}
            <div className="flex flex-col gap-1.5">
              <label className={labelClass}>Status</label>
              <select name="status" value={form.status} onChange={handleChange} className={inputClass}>
                <option value="PENDING">Pending</option>
                <option value="PAID">Paid</option>
                <option value="OVERDUE">Overdue</option>
              </select>
            </div>

            <button onClick={handleSubmit} disabled={loading}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold rounded-xl text-sm shadow-sm shadow-blue-600/20 transition-all duration-200 mt-1">
              {loading ? "Creating..." : "Create Invoice"}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

// ── Invoice View Modal ─────────────────────────────────────────────────────────
const InvoiceModal = ({ payment, onClose, onDeleted }) => {
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deletePayment(payment.id);
      toast.success("Payment deleted");
      onDeleted(payment.id);
      onClose();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to delete payment");
    } finally {
      setDeleting(false);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-slideUp">
        <div className="h-[3px] w-full bg-gradient-to-r from-blue-600 via-blue-400 to-transparent" />

        <div className="p-8 max-h-[85vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-xs uppercase tracking-widest text-blue-500 font-semibold mb-0.5">Invoice</p>
              <h2 className="text-xl font-bold text-slate-800 dark:text-white tracking-tight">{payment.invoiceNumber}</h2>
            </div>
            <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition">
              <X size={16} />
            </button>
          </div>

          {/* Status badge */}
          <div className="mb-6">
            <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${getStatusStyle(payment.status)}`}>
              {formatStatus(payment.status)}
            </span>
          </div>

          {/* Details */}
          <div className="flex flex-col gap-4 mb-6">
            {/* Amount */}
            <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
              <div className="w-9 h-9 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center flex-shrink-0">
                <DollarSign size={15} className="text-slate-400" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wide text-slate-400 font-semibold">Amount</p>
                <p className="text-slate-800 dark:text-white font-bold text-lg">${payment.amount?.toLocaleString()}</p>
              </div>
            </div>

            {/* Project */}
            <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
              <div className="w-9 h-9 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center flex-shrink-0">
                <FolderKanban size={15} className="text-slate-400" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wide text-slate-400 font-semibold">Project</p>
                <p className="text-slate-700 dark:text-slate-200 font-semibold text-sm">{payment.project?.projectTitle}</p>
              </div>
            </div>

            {/* Due Date */}
            <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
              <div className="w-9 h-9 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center flex-shrink-0">
                <Calendar size={15} className="text-slate-400" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wide text-slate-400 font-semibold">Due Date</p>
                <p className="text-slate-700 dark:text-slate-200 font-semibold text-sm">{formatDate(payment.dueDate)}</p>
              </div>
            </div>

            {/* Invoice # */}
            <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
              <div className="w-9 h-9 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center flex-shrink-0">
                <Hash size={15} className="text-slate-400" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wide text-slate-400 font-semibold">Invoice Number</p>
                <p className="text-slate-700 dark:text-slate-200 font-semibold text-sm">{payment.invoiceNumber}</p>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 my-1 mb-4">
            <div className="flex-1 h-px bg-slate-100 dark:bg-slate-800" />
            <span className="text-xs text-slate-400">Danger Zone</span>
            <div className="flex-1 h-px bg-slate-100 dark:bg-slate-800" />
          </div>

          {/* Delete — two step */}
          {!confirmDelete ? (
            <button onClick={() => setConfirmDelete(true)}
              className="w-full py-2.5 border border-red-200 dark:border-red-900/50 text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 font-semibold rounded-xl text-sm transition-all duration-200">
              Delete Invoice
            </button>
          ) : (
            <div className="rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-900/10 p-4">
              <p className="text-sm font-semibold text-red-600 dark:text-red-400 mb-1">Are you sure?</p>
              <p className="text-xs text-red-400 dark:text-red-500 mb-3">
                This will permanently delete invoice <span className="font-semibold">{payment.invoiceNumber}</span>. This cannot be undone.
              </p>
              <div className="flex gap-2">
                <button onClick={() => setConfirmDelete(false)}
                  className="flex-1 py-2 text-sm font-semibold text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 transition">
                  Cancel
                </button>
                <button onClick={handleDelete} disabled={deleting}
                  className="flex-1 py-2 text-sm font-semibold text-white bg-red-500 hover:bg-red-600 rounded-xl disabled:opacity-60 transition active:scale-95">
                  {deleting ? "Deleting..." : "Yes, Delete"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};

// ── Payments Page ──────────────────────────────────────────────────────────────
const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);

  const fetchPayments = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getPayments();
      setPayments(data || []);
    } catch (err) {
      setError("Failed to load payments. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const handlePaymentAdded = (newPayment) => {
    setPayments((prev) => [newPayment, ...prev]);
  };

  const handlePaymentDeleted = (id) => {
    setPayments((prev) => prev.filter((p) => p.id !== id));
  };

  // Compute summaries from live data
  const totalPaid    = payments.filter(p => p.status === "PAID").reduce((sum, p) => sum + (p.amount || 0), 0);
  const totalPending = payments.filter(p => p.status === "PENDING").reduce((sum, p) => sum + (p.amount || 0), 0);
  const totalOverdue = payments.filter(p => p.status === "OVERDUE").reduce((sum, p) => sum + (p.amount || 0), 0);

  const paymentSummaries = [
    { summaryTitle: "Total Paid", avgSummary: `$${totalPaid.toLocaleString()}`,    icon: DollarSign, color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-900/20" },
    { summaryTitle: "Pending",    avgSummary: `$${totalPending.toLocaleString()}`, icon: Clock,       color: "text-yellow-600", bg: "bg-yellow-50 dark:bg-yellow-900/20" },
    { summaryTitle: "Overdue",    avgSummary: `$${totalOverdue.toLocaleString()}`, icon: AlertCircle, color: "text-red-500",    bg: "bg-red-50 dark:bg-red-900/20" },
  ];

  return (
    <div className="animate-fadeIn">
      {/* Modals */}
      {showModal && (
        <AddPaymentModal
          onClose={() => setShowModal(false)}
          onSuccess={handlePaymentAdded}
        />
      )}
      {selectedPayment && (
        <InvoiceModal
          payment={selectedPayment}
          onClose={() => setSelectedPayment(null)}
          onDeleted={handlePaymentDeleted}
        />
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 mb-8">
        <div>
          <p className="text-xs uppercase tracking-widest text-blue-500 font-semibold mb-1">Finance</p>
          <h1 className="font-bold text-3xl text-slate-800 dark:text-white tracking-tight">Payments</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Track invoices and payment status</p>
        </div>
        <div className="flex items-start">
          <CustomButton label="Create Invoice" icon={Plus} iconSize={16} onClick={() => setShowModal(true)} />
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {paymentSummaries.map((summary, i) => {
          const Icon = summary.icon;
          return (
            <div key={summary.summaryTitle}
              className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-card animate-slideUp transition-colors duration-300"
              style={{ animationDelay: `${i * 60}ms` }}>
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

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={24} className="animate-spin text-blue-500" />
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="flex flex-col items-center justify-center py-16 gap-4">
          <div className="w-12 h-12 rounded-2xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center">
            <AlertCircle size={22} className="text-red-400" />
          </div>
          <div className="text-center">
            <p className="text-slate-700 dark:text-slate-200 font-semibold mb-1">Something went wrong</p>
            <p className="text-slate-400 text-sm">{error}</p>
          </div>
          <button onClick={fetchPayments}
            className="px-4 py-2 rounded-xl text-sm font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all">
            Try again
          </button>
        </div>
      )}

      {/* Empty */}
      {!loading && !error && payments.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
            <DollarSign size={24} className="text-slate-300 dark:text-slate-600" />
          </div>
          <div className="text-center">
            <p className="text-slate-700 dark:text-slate-200 font-semibold mb-1">No payments yet</p>
            <p className="text-slate-400 text-sm">Create your first invoice to get started.</p>
          </div>
          <button onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-all">
            <Plus size={14} /> Create Invoice
          </button>
        </div>
      )}

      {/* Table */}
      {!loading && !error && payments.length > 0 && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-x-auto shadow-card">
          <table className="w-full text-sm text-left min-w-[700px]">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800">
                <th className="px-6 py-4 text-[11px] uppercase tracking-widest font-semibold text-slate-400 dark:text-slate-500">Invoice</th>
                <th className="px-6 py-4 text-[11px] uppercase tracking-widest font-semibold text-slate-400 dark:text-slate-500">Project</th>
                <th className="px-6 py-4 text-[11px] uppercase tracking-widest font-semibold text-slate-400 dark:text-slate-500">Amount</th>
                <th className="px-6 py-4 text-[11px] uppercase tracking-widest font-semibold text-slate-400 dark:text-slate-500">Due Date</th>
                <th className="px-6 py-4 text-[11px] uppercase tracking-widest font-semibold text-slate-400 dark:text-slate-500">Status</th>
                <th className="px-6 py-4 text-[11px] uppercase tracking-widest font-semibold text-slate-400 dark:text-slate-500">Action</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment, i) => (
                <tr key={payment.id}
                  className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors duration-150 animate-slideUp"
                  style={{ animationDelay: `${i * 40}ms` }}>
                  <td className="px-6 py-4 font-semibold text-slate-700 dark:text-slate-200">
                    {payment.invoiceNumber}
                  </td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                    {payment.project?.projectTitle}
                  </td>
                  <td className="px-6 py-4 font-bold text-slate-700 dark:text-slate-200">
                    ${payment.amount?.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-slate-500 dark:text-slate-400">
                    {formatDate(payment.dueDate)}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold ${getStatusStyle(payment.status)}`}>
                      {formatStatus(payment.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => setSelectedPayment(payment)}
                      className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold text-sm transition-colors duration-150">
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Payments;
