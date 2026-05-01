export default function RevenueChart({ data, showComparison }) {
  const chartData = data?.data || {};
  const values = chartData.values || [0, 0, 0, 0, 0, 0, 0];
  const labels = chartData.labels || ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const maxValue = Math.max(...values, 1);
  
  const points = values.map((v, i) => {
    const x = 40 + (i * (420 / (values.length - 1)));
    const y = 180 - (v / maxValue) * 140;
    return `${x},${y}`;
  }).join(' ');
  
  return (
    <div className="h-64 relative">
      <svg className="w-full h-full" viewBox="0 0 500 200" preserveAspectRatio="none">
        <line x1="40" y1="20" x2="40" y2="180" stroke="#e5e7eb" strokeWidth="1" />
        <line x1="40" y1="100" x2="460" y2="100" stroke="#e5e7eb" strokeWidth="1" strokeDasharray="4" />
        <line x1="40" y1="180" x2="460" y2="180" stroke="#e5e7eb" strokeWidth="1" />
        <polyline points={points} fill="none" stroke="#3b82f6" strokeWidth="3" className="chart-line" />
        {values.map((v, i) => {
          const x = 40 + (i * (420 / (values.length - 1)));
          const y = 180 - (v / maxValue) * 140;
          return <circle key={i} cx={x} cy={y} r="4" fill="#3b82f6" className="chart-point" />;
        })}
      </svg>
      <div className="absolute bottom-0 left-0 right-0 flex justify-between px-8 text-xs text-gray-500">
        {labels.map((label, i) => <span key={i}>{label}</span>)}
      </div>
    </div>
  );
}