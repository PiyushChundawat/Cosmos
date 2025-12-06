import { useEffect, useState } from 'react';

const CircularProgress = ({ value, size = 240, strokeWidth = 14 }) => {
  const [progress, setProgress] = useState(0);

  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  useEffect(() => {
    const timer = setTimeout(() => {
      setProgress(value);
    }, 200);

    return () => clearTimeout(timer);
  }, [value]);

  const getColor = (score) => {
    if (score >= 80) return '#06b6d4';
    if (score >= 60) return '#3b82f6';
    if (score >= 40) return '#f59e0b';
    return '#ef4444';
  };

  const color = getColor(value);

  return (
    <div className="relative group" style={{ width: size, height: size }}>
      {/* Glow Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full blur-2xl opacity-40 group-hover:opacity-60 transition-opacity duration-500"></div>

      {/* SVG Progress Rings */}
      <svg className="transform -rotate-90 relative z-10" width={size} height={size}>
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#06b6d4" />
            <stop offset="100%" stopColor="#3b82f6" />
          </linearGradient>
        </defs>

        {/* Background Ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#374151"
          strokeWidth={strokeWidth}
          fill="none"
          opacity="0.3"
        />

        {/* Animated Progress Ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-1500 ease-out drop-shadow-lg"
          style={{
            filter: `drop-shadow(0 0 20px ${color}80)`
          }}
        />
      </svg>

      {/* Center Score Text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
        <span className="text-6xl font-black bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
          {Math.round(progress)}
        </span>
        <span className="text-xl text-gray-400 font-light mt-2">/ 100</span>
      </div>
    </div>
  );
};

export default CircularProgress;
