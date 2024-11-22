export default function MetricBar({ label, value, max = 5 }) {
    return (
      <div className="flex items-center space-x-3">
        <span className="text-sm font-medium w-24">{label}</span>
        <div className="flex items-center space-x-1">
          {Array.from({ length: max }).map((_, index) => (
            <div
              key={index}
              className={`w-4 h-4 rounded-full border border-gray-300 ${
                index < value ? "bg-blue-500" : "bg-transparent"
              }`}
            />
          ))}
        </div>
      </div>
    );
  }
  