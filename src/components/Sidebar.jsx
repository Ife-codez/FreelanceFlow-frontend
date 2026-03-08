import { NavLink } from "react-router-dom";
import { LayoutDashboard, Users, FolderKanban, CreditCard, X } from "lucide-react";

const Sidebar = ({ isOpen, setIsOpen }) => {
  const baseLink =
    "flex items-center gap-3 px-4 py-2 rounded-2xl transition font-medium";

  const getLinkClass = ({ isActive }) =>
    `${baseLink} ${
      isActive
        ? "bg-teal-500 text-white"
        : "text-gray-700 hover:bg-gray-100"
    }`;

  return (
    <>
      {/* Overlay (Mobile) */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed z-50 top-0 left-0 h-screen w-[260px] bg-white border-r transform transition-transform duration-300
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      >
        <div className="flex flex-col h-full p-5">

          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-teal-500 font-semibold text-2xl">
                FreelanceFlow
              </h2>
              <p className="text-gray-500 text-lg">
                Freelancer Management
              </p>
            </div>

            {/* Close button (mobile only) */}
            <button
              onClick={() => setIsOpen(false)}
              className="lg:hidden"
            >
              <X size={20} />
            </button>
          </div>

          {/* Divider */}
          <div className="h-px bg-gray-200 w-full my-6" />

          {/* Navigation */}
          <nav className="flex-1 space-y-2">
            <NavLink to="/" end className={getLinkClass}>
              <LayoutDashboard size={18} />
              Dashboard
            </NavLink>

            <NavLink to="/clients" className={getLinkClass}>
              <Users size={18} />
              Clients
            </NavLink>

            <NavLink to="/projects" className={getLinkClass}>
              <FolderKanban size={18} />
              Projects
            </NavLink>

            <NavLink to="/payments" className={getLinkClass}>
              <CreditCard size={18} />
              Payments
            </NavLink>
          </nav>

          {/* Bottom Profile Section */}
          <div className="border-t pt-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center text-teal-500 font-semibold">
                FL
              </div>
              <div>
                <p className="text-lg font-medium">Freelancer</p>
                <p className="text-xs text-gray-500">
                  freelancer@example.com
                </p>
              </div>
            </div>
          </div>

        </div>
      </aside>
    </>
  );
};

export default Sidebar;