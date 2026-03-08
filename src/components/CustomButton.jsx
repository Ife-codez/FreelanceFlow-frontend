const CustomButton = ({label, icon: Icon,  iconSize = 16}) => {
  return ( 
    <>
      <button className="inline-flex items-center gap-2 bg-teal-500 rounded-2xl px-4 py-2 hover:bg-teal-400 transition-colors font-semibold text-white text-sm">
        {Icon && <Icon size={iconSize}  />}
        <span>{label}</span>
      </button>
    </>
   );
}
 
export default CustomButton;