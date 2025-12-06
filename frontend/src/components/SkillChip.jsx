const SkillChip = ({ skill }) => {
  return (
    <span className="px-5 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm font-semibold rounded-full shadow-lg hover:shadow-2xl transition-all hover:scale-110 hover:-translate-y-1 cursor-pointer group relative overflow-hidden">
      <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity"></div>
      <span className="relative">{skill}</span>
    </span>
  );
};

export default SkillChip;
