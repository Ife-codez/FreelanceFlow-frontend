import CustomButton from "../components/CustomButton";
import SearchInput from "../components/SearchInput";
import { Search, Building2, Mail, Phone, Plus, X, Loader2 } from "lucide-react";
import { clients } from "../data/client";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import toast from "react-hot-toast";
import { createClient, getClients } from "../api/clients";
const AddClientModal = ({ onClose, onSuccess }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    clientName: "",
    companyName: "",
    email: "",
    phone: "",
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    if (!form.clientName || !form.email) {
      toast.error("Name and email are required");
      return;
    }
    setLoading(true);
    try {
      await createClient({ ...form, userId: user?.id });
      toast.success("Client added successfully!");
      onSuccess();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add client");
    } finally {
      setLoading(false);
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
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-slate-800 dark:text-white tracking-tight">Add Client</h2>
              <p className="text-slate-400 text-sm mt-0.5">Fill in the details to add a new client</p>
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
            {fields.map(({ name, label, placeholder, type }) => (
              <div key={name} className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                  {label}
                </label>
                <input
                  type={type}
                  name={name}
                  value={form[name]}
                  onChange={handleChange}
                  placeholder={placeholder}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition"
                />
              </div>
            ))}

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold rounded-xl text-sm shadow-sm shadow-blue-600/20 transition-all duration-200 mt-1"
            >
              {loading ? "Adding client..." : "Add Client"}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

const Clients = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const fetchClients = async () => {
    try {
      const data = await getClients();
      setClients(data);
    } catch (err) {
      toast.error("Failed to load clients");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);
  return (
    <div className="animate-fadeIn">

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 mb-8">
        <div>
          <p className="text-xs uppercase tracking-widest text-blue-500 font-semibold mb-1">Directory</p>
          <h1 className="font-bold text-3xl text-slate-800 dark:text-white tracking-tight">Clients</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Manage your client relationships</p>
        </div>
        <div className="flex items-start">
          <CustomButton label="Add Client" icon={Plus} iconSize={16} onClick={() => setShowModal(true)} />
        </div>
      </div>

      {showModal && (
        <AddClientModal
          onClose={() => setShowModal(false)}
          onSuccess={() => {
            fetchClients()
          }}
        />
      )}

      {/* Search */}
      <SearchInput placeholder="Search by name, company, or email..." icon={Search} className="mb-6" />

      {/* Loading state */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={24} className="animate-spin text-blue-500" />
        </div>
      )}

      {/* Empty state */}
      {!loading && clients.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
            <Building2 size={24} className="text-slate-400" />
          </div>
          <p className="text-slate-700 dark:text-slate-200 font-semibold mb-1">No clients yet</p>
          <p className="text-slate-400 text-sm">Click "Add Client" to get started</p>
        </div>
      )}

      {/* Client Cards */}
      {!loading && clients.length > 0 && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {clients.map((client, i) => (
            <div
              key={client.id}
              onClick={() => navigate(`/client-main/${client.id}`)}
              className="group bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 flex flex-col gap-3 hover:shadow-lg hover:shadow-slate-200/60 dark:hover:shadow-slate-900 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer animate-slideUp"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <div className="flex items-center gap-3 mb-1">
                <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-sm flex-shrink-0">
                  {client.clientName?.slice(0, 2).toUpperCase() || "CL"}
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-slate-800 dark:text-white text-sm truncate">{client.clientName}</p>
                  <p className="text-slate-400 text-xs">{client.companyName}</p>
                </div>
              </div>

              <div className="h-px bg-slate-100 dark:bg-slate-800" />

              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2.5 text-slate-500 dark:text-slate-400 text-sm">
                  <div className="w-7 h-7 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-center flex-shrink-0">
                    <Building2 size={13} className="text-slate-400" />
                  </div>
                  <span className="truncate">{client.companyName}</span>
                </div>
                <div className="flex items-center gap-2.5 text-slate-500 dark:text-slate-400 text-sm">
                  <div className="w-7 h-7 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-center flex-shrink-0">
                    <Mail size={13} className="text-slate-400" />
                  </div>
                  <span className="truncate">{client.email}</span>
                </div>
                <div className="flex items-center gap-2.5 text-slate-500 dark:text-slate-400 text-sm">
                  <div className="w-7 h-7 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-center flex-shrink-0">
                    <Phone size={13} className="text-slate-400" />
                  </div>
                  <span>{client.phone}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      </div>
    
    
  );
};

export default Clients;