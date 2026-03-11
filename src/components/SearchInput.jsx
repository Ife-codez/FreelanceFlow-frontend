const SearchInput = ({ placeholder, icon: Icon, iconSize = 16, className = "" }) => {
  return (
    <div className={`relative w-full ${className}`}>
      {Icon && (
        <Icon
          size={iconSize}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
        />
      )}
      <input
        type="text"
        placeholder={placeholder}
        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-colors duration-200"
      />
    </div>
  );
};

export default SearchInput;