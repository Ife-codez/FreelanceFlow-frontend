const SearchInput = ({placeholder, icon:Icon, iconSize = 16, className = ""}) => {
  return ( 
    <div className={`relative w-full ${className}`}>
      {Icon && (
        <Icon
          size={iconSize}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        />
      )}

      <input
        type="text"
        placeholder={placeholder}
        className="w-full pl-10 pr-4 py-2 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent text-sm"
      />
    </div>
   );
}
 
export default SearchInput;