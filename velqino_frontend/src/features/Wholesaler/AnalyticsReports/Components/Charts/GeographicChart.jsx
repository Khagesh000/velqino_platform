export default function GeographicChart({ data }) {
  const cities = data?.data || [];
  const maxValue = Math.max(...cities.map(c => c.total), 1);
  
  return (
    <div className="h-64 relative">
      <div className="absolute inset-0 flex flex-col justify-around px-4">
        {cities.slice(0, 6).map((city, i) => (
          <div key={i} className="flex items-center gap-4">
            <span className="text-sm text-gray-600 w-28 truncate">{city.shipping_city || 'Unknown'}</span>
            <div className="flex-1 h-6 bg-gray-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-indigo-500 rounded-full"
                style={{ width: `${(city.total / maxValue) * 100}%` }}
              />
            </div>
            <span className="text-sm font-medium text-gray-900">₹{city.total.toLocaleString()}</span>
          </div>
        ))}
      </div>
    </div>
  );
}