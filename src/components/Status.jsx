import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";

const Status = ({ statuses = [], className = "" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState("All statuses");
  const dropdownRef = useRef(null);

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

  const allOptions = ["All statuses", ...statuses];

  return (
    <div className={`relative w-full ${className}`} ref={dropdownRef}>
      {/* Trigger */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 cursor-pointer bg-white dark:bg-slate-900 hover:border-blue-400 dark:hover:border-blue-500 transition-colors duration-200"
      >
        <span className="text-sm text-slate-600 dark:text-slate-300">{selected}</span>
        <ChevronDown
          size={15}
          className={`text-slate-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </div>

      {/* Dropdown */}
      <div
        className={`absolute left-0 z-20 mt-2 w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg overflow-hidden transition-all duration-200 origin-top ${
          isOpen ? "opacity-100 scale-y-100" : "opacity-0 scale-y-95 pointer-events-none"
        }`}
      >
        <ul className="py-1.5">
          {allOptions.map((status, index) => (
            <li
              key={index}
              onClick={() => handleSelect(status)}
              className="flex items-center justify-between px-4 py-2.5 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer transition-colors duration-150"
            >
              <span className="capitalize">{status}</span>
              {selected === status && <Check size={13} className="text-blue-600" />}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Status;