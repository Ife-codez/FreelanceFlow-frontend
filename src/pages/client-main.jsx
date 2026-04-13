import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getClient, updateClient, deleteClient } from "../api/clients";
import toast from "react-hot-toast";
import {
  ArrowLeft, Building2, Mail, Phone, Calendar, Pencil,
  FolderKanban, X, Loader2, DollarSign, Clock
} from "lucide-react";
import { createPortal } from "react-dom";

const getStatusStyle = (status) => {
  switch (status) {
    case "IN_PROGRESS": return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300";
    case "PENDING":     return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300";
    case "COMPLETED":   return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300";
    case "ON_HOLD":     return "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400";
    default:            return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300";
  }
};

const formatStatus = (status) =>
  status?.replace("_", " ").charAt(0) + status?.replace("_", " ").slice(1).toLowerCase();

const formatDate = (dateStr) => {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric", month: "short", day: "numeric",
  });
};

const EditClientModal = ({ client, onClose, onSuccess, onDeleted }) => {
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [form, setForm] = useState({
    clientName: client.clientName || "",
    companyName: client.companyName || "",
    email: client.email || "",
    phone: client.phone || "",
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    if (!form.clientName || !form.email) {
      toast.error("Name and email are required");
      return;
    }
    setLoading(true);
    try {
      await updateClient(client.id, form);
      toast.success("Client updated successfully!");
      onSuccess();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update client");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      await deleteClient(client.id);
      toast.success("Client deleted");
      onClose();
      onDeleted(); // navigate away after deletion
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete client");
    } finally {
      setDeleteLoading(false);
    }
  };

  const fields = [
    { name: "clientName", label: "Full Name", placeholder: "David Mensah", type: "text" },
    { name: "companyName", label: "Company Name", placeholder: "FinEdge Consulting", type: "text" },
    { name: "email", label: "Email Address", placeholder: "david@company.com", type: "email" },
    { name: "phone", label: "Phone Number", placeholder: "+234 807 890 1234", type: "tel" },
  ];

  return createPortal(
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-slideUp">
        <div className="h-[3px] w-full bg-gradient-to-r from-blue-600 via-blue-400 to-transparent" />
        <div className="p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-slate-800 dark:text-white tracking-tight">Edit Client</h2>
              <p className="text-slate-400 text-sm mt-0.5">Update client information</p>
            </div>
            <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition">
              <X size={16} />
            </button>
          </div>

          <div className="flex flex-col gap-4">
            {fields.map(({ name, label, placeholder, type }) => (
              <div key={name} className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">{label}</label>
                <input type={type} name={name} value={form[name]} onChange={handleChange} placeholder={placeholder}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition" />
              </div>
            ))}

            <button onClick={handleSubmit} disabled={loading}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold rounded-xl text-sm shadow-sm shadow-blue-600/20 transition-all duration-200 mt-1">
              {loading ? "Saving changes..." : "Save Changes"}
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3 my-1">
              <div className="flex-1 h-px bg-slate-100 dark:bg-slate-800" />
              <span className="text-xs text-slate-400">Danger Zone</span>
              <div className="flex-1 h-px bg-slate-100 dark:bg-slate-800" />
            </div>

            {/* Delete — two step */}
            {!confirmDelete ? (
              <button
                onClick={() => setConfirmDelete(true)}
                className="w-full py-2.5 border border-red-200 dark:border-red-900/50 text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 font-semibold rounded-xl text-sm transition-all duration-200"
              >
                Delete Client
              </button>
            ) : (
              <div className="rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-900/10 p-4">
                <p className="text-sm font-semibold text-red-600 dark:text-red-400 mb-1">Are you sure?</p>
                <p className="text-xs text-red-400 dark:text-red-500 mb-3">
                  This will permanently delete <span className="font-semibold">{client.clientName}</span> and all associated data. This cannot be undone.
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setConfirmDelete(false)}
                    className="flex-1 py-2 text-sm font-semibold text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDelete}
                    disabled={deleteLoading}
                    className="flex-1 py-2 text-sm font-semibold text-white bg-red-500 hover:bg-red-600 rounded-xl disabled:opacity-60 transition active:scale-95"
                  >
                    {deleteLoading ? "Deleting..." : "Yes, Delete"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

const Client = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showEdit, setShowEdit] = useState(false);

  const fetchClient = async () => {
    try {
      const data = await getClient(id);
      setClient(data);
    } catch (err) {
      toast.error("Failed to load client");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClient();
  }, [id]);

  if (loading) return (
    <div className="flex items-center justify-center py-32">
      <Loader2 size={28} className="animate-spin text-blue-500" />
    </div>
  );

  if (!client) return (
    <div className="flex flex-col items-center justify-center py-32 text-center">
      <p className="text-slate-600 dark:text-slate-300 font-semibold">Client not found</p>
      <button onClick={() => navigate("/clients")} className="mt-3 text-blue-600 text-sm hover:underline">
        Back to clients
      </button>
    </div>
  );

  return (
    <div className="animate-fadeIn">

      {showEdit && (
        <EditClientModal
          client={client}
          onClose={() => setShowEdit(false)}
          onSuccess={fetchClient}
          onDeleted={() => navigate("/clients")} // navigates back after deletion
        />
      )}

      {/* Back button */}
      <button
        onClick={() => navigate("/clients")}
        className="flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white text-sm font-medium mb-6 transition-colors"
      >
        <ArrowLeft size={16} />
        Back to Clients
      </button>

      {/* Profile Header Card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 mb-5 shadow-card">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-xl flex-shrink-0">
              {client.clientName?.slice(0, 2).toUpperCase() || "CL"}
            </div>
            <div>
              <h1 className="font-bold text-2xl text-slate-800 dark:text-white tracking-tight">{client.clientName}</h1>
              <p className="text-slate-400 text-sm mt-0.5">{client.companyName}</p>
              <div className="flex items-center gap-1.5 mt-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span className="text-xs text-slate-400">Active client</span>
              </div>
            </div>
          </div>
          <button
            onClick={() => setShowEdit(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-all duration-200 active:scale-95 shadow-sm shadow-blue-600/20 self-start sm:self-auto"
          >
            <Pencil size={14} />
            Edit Client
          </button>
        </div>
      </div>

      {/* Info Grid */}
      <div className="grid sm:grid-cols-2 gap-4 mb-5">

        {/* Contact Info */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-card">
          <p className="text-xs uppercase tracking-widest text-blue-500 font-semibold mb-4">Contact Information</p>
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center flex-shrink-0">
                <Mail size={15} className="text-slate-400" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wide text-slate-400 font-semibold">Email</p>
                <p className="text-slate-700 dark:text-slate-200 text-sm font-medium">{client.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center flex-shrink-0">
                <Phone size={15} className="text-slate-400" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wide text-slate-400 font-semibold">Phone</p>
                <p className="text-slate-700 dark:text-slate-200 text-sm font-medium">{client.phone}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center flex-shrink-0">
                <Building2 size={15} className="text-slate-400" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wide text-slate-400 font-semibold">Company</p>
                <p className="text-slate-700 dark:text-slate-200 text-sm font-medium">{client.companyName}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Meta Info */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-card">
          <p className="text-xs uppercase tracking-widest text-blue-500 font-semibold mb-4">Account Details</p>
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center flex-shrink-0">
                <Calendar size={15} className="text-slate-400" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wide text-slate-400 font-semibold">Client Since</p>
                <p className="text-slate-700 dark:text-slate-200 text-sm font-medium">{formatDate(client.createdAt)}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center flex-shrink-0">
                <FolderKanban size={15} className="text-slate-400" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wide text-slate-400 font-semibold">Total Projects</p>
                <p className="text-slate-700 dark:text-slate-200 text-sm font-medium">{client.projects?.length || 0}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center flex-shrink-0">
                <DollarSign size={15} className="text-slate-400" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wide text-slate-400 font-semibold">Total Budget</p>
                <p className="text-slate-700 dark:text-slate-200 text-sm font-medium">
                  ${client.projects?.reduce((sum, p) => sum + (p.budget || 0), 0).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Projects */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-card">
        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="text-xs uppercase tracking-widest text-blue-500 font-semibold mb-0.5">Projects</p>
            <h3 className="font-bold text-slate-800 dark:text-white">All Projects</h3>
          </div>
          <span className="text-xs font-semibold text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg">
            {client.projects?.length || 0} total
          </span>
        </div>

        {client.projects?.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-3">
              <FolderKanban size={20} className="text-slate-400" />
            </div>
            <p className="text-slate-600 dark:text-slate-300 font-semibold text-sm">No projects yet</p>
            <p className="text-slate-400 text-xs mt-1">Projects assigned to this client will appear here</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {client.projects.map((project, i) => (
              <div
                key={project.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200 animate-slideUp"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <div className="min-w-0">
                  <p className="font-semibold text-slate-700 dark:text-slate-200 text-sm">{project.projectTitle}</p>
                  {project.description && (
                    <p className="text-slate-400 text-xs mt-0.5 line-clamp-1">{project.description}</p>
                  )}
                  <div className="flex items-center gap-3 mt-2">
                    <div className="flex items-center gap-1 text-slate-400 text-xs">
                      <DollarSign size={11} />
                      <span>${project.budget?.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-1 text-slate-400 text-xs">
                      <Clock size={11} />
                      <span>{formatDate(project.startDate)}</span>
                    </div>
                  </div>
                </div>
                <span className={`flex-shrink-0 self-start sm:self-auto px-2.5 py-1 rounded-full text-[11px] font-semibold ${getStatusStyle(project.status)}`}>
                  {formatStatus(project.status)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Client;