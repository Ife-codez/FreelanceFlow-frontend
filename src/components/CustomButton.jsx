const CustomButton = ({ label, icon: Icon, iconSize = 16, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 active:scale-95 rounded-xl px-4 py-2.5 transition-all duration-200 font-semibold text-white text-sm shadow-sm shadow-blue-600/20"
    >
      {Icon && <Icon size={iconSize} />}
      <span>{label}</span>
    </button>
  );
};

export default CustomButton;