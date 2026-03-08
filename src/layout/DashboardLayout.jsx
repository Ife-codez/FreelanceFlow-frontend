import { Outlet } from "react-router-dom";
import { useState } from "react";
import { Menu } from "lucide-react";
import Sidebar from "../components/Sidebar";

const DashboardLayout = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-gray-100 flex min-h-screen relative overflow-x-hidden">

      {/* Sidebar */}
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:ml-[260px] min-w-0">

        {/* Mobile Top Bar */}
        <div className="lg:hidden flex items-center p-4 border-b bg-white">
          <button onClick={() => setIsOpen(true)}>
            <Menu size={22} />
          </button>
        </div>

        {/* Page Content */}
        <div className="flex-1 p-7">
          <Outlet />
        </div>

      </div>
    </div>
  );
};

export default DashboardLayout;