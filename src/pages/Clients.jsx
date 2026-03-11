import CustomButton from "../components/CustomButton";
import SearchInput from "../components/SearchInput";
import { Search, Building2, Mail, Phone, Plus, ArrowRight } from "lucide-react";
import { clients } from "../data/client";
import { useNavigate } from "react-router-dom";

const Clients = () => {
  const navigate = useNavigate();

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
          <CustomButton label="Add Client" icon={Plus} iconSize={16} />
        </div>
      </div>

      {/* Search */}
      <SearchInput
        placeholder="Search by name, company, or email..."
        icon={Search}
        className="mb-6"
      />

      {/* Client Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {clients.map((client, i) => (
          <div
            key={client.email}
            onClick={() => navigate("/client-main")}
            className="group bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 flex flex-col gap-3 hover:shadow-lg hover:shadow-slate-200/60 dark:hover:shadow-slate-900 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer animate-slideUp"
            style={{ animationDelay: `${i * 50}ms` }}
          >
            {/* Avatar + Name */}
            <div className="flex items-center gap-3 mb-1">
              <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-sm flex-shrink-0">
                {client.clientName?.slice(0, 2).toUpperCase() || "CL"}
              </div>
              <div className="min-w-0">
                <p className="font-bold text-slate-800 dark:text-white text-sm truncate">{client.clientName}</p>
                <p className="text-slate-400 text-xs">{client.companyName}</p>
              </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-slate-100 dark:bg-slate-800" />

            {/* Contact Info */}
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

            {/* Footer */}
            {/* <div className="flex items-center justify-end mt-1">
              <span className="text-blue-600 dark:text-blue-400 text-xs font-medium flex items-center gap-1 group-hover:gap-2 transition-all duration-200">
                View profile <ArrowRight size={12} />
              </span>
            </div> */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Clients;