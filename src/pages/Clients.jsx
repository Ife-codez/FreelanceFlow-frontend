import CustomButton from "../components/CustomButton";
import SearchInput from "../components/SearchInput";
import { Search, Building2, Mail, Phone, Plus } from "lucide-react";
import { clients } from "../data/client";
import { useNavigate } from 'react-router-dom';
const Clients = () => {
  const navigate = useNavigate();
  const handleNavigate = () => {
    navigate('/client-main'); 

  }
  return ( 
    <div>
      <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
        <div className="flex flex-col gap-2">
          <h1 className="font-semibold text-3xl">Clients</h1>
          <p className="text-gray-600">Manage your client relationships</p>
        </div>
        <div>
          <CustomButton label='Add client' icon={Plus} iconSize={18} />
        </div>
      </div>
      <SearchInput placeholder="search client by name, company, or email.." icon={Search} className="mb-5" />
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {clients.map((client) => (
          <div className="bg-white rounded-xl p-6 border-gray-200 border-[1px] flex flex-col gap-3 hover:shadow-md" onClick={handleNavigate}>
            <div className="w-14 h-14 rounded-full bg-teal-50 flex items-center justify-center text-teal-500 font-semibold">
                FL
            </div>
            <p className="mb-2 font-semibold">{client.clientName}</p>
            <div className="flex items-center gap-2 text-gray-500 text-sm">
              <Building2 size={18} />
              <span>{client.companyName}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-500 text-sm">
              <Mail size={18} />
              <span className="text-gray-500 text-sm">{client.email}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-500 text-sm">
              <Phone size={18} />
              <span className="text-gray-500 text-sm">{client.phone}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
   );
}
 
export default Clients;