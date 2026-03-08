import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

const Status = ({ statuses = [], className="" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState("All statuses");
  const dropdownRef = useRef(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (status) => {
    setSelected(status);
    setIsOpen(false);
  };

  return (
    <div className={`relative w-full ${className}`} ref={dropdownRef}>
      {/* Trigger */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between border border-gray-200 rounded-2xl px-4 py-2 cursor-pointer bg-white hover:border-teal-400 transition"
      >
        <span className="text-sm">{selected}</span>
        <ChevronDown
          size={16}
          className={`transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </div>

      {/* Dropdown Card */}
      <div
        className={`absolute left-0 mt-2 w-full bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden transition-all duration-200 origin-top ${
          isOpen
            ? "opacity-100 scale-y-100"
            : "opacity-0 scale-y-95 pointer-events-none"
        }`}
      >
        <ul className="py-2">
          <li
            onClick={() => handleSelect("All statuses")}
            className="px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer"
          >
            All statuses
          </li>

          {statuses.map((status, index) => (
            <li
              key={index}
              onClick={() => handleSelect(status)}
              className="px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer"
            >
              {status}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Status;