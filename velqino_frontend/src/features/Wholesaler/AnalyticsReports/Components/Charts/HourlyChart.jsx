export default function HourlyChart({ data }) {
  const hourlyData = data?.data || [];
  const maxValue = Math.max(...hourlyData.map(h => h.total), 1);
  
  return (
    <div className="h-64 relative overflow-x-auto">
      <div className="min-w-[600px] h-full flex items-end gap-1 px-4">
        {hourlyData.map((hour, i) => (
          <div key={i} className="flex-1 flex flex-col items-center">
            <div 
              className="w-full bg-pink-500 rounded-t"
              style={{ height: `${(hour.total / maxValue) * 140}px` }}
            />
            <span className="text-xs text-gray-500 mt-2 transform -rotate-45 origin-top-left">{hour.hour}</span>
          </div>
        ))}
      </div>
    </div>
  );
}