export default function ProgressBar({ completed, total }) {
  const percent = Math.round((completed / total) * 100);

  return (
    <div className="mb-8">
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${percent}%` }}
        />
      </div>
      <p className="text-center text-sm text-gray-400 mt-2">{percent}% complete</p>
    </div>
  );
}
