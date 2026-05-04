export default function TopProductsChart({ data }) {
  const products = data?.data || [];
  const maxValue = Math.max(...products.map(p => p.total_sold), 1);
  
  return (
    <div className="h-64 relative">
      <div className="absolute inset-0 flex flex-col justify-around px-4">
        {products.slice(0, 5).map((product, i) => (
          <div key={i} className="flex items-center gap-4">
            <span className="text-sm text-gray-600 w-32 truncate">{product.product_name}</span>
            <div className="flex-1 h-6 bg-gray-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-warning-500 rounded-full"
                style={{ width: `${(product.total_sold / maxValue) * 100}%` }}
              />
            </div>
            <span className="text-sm font-medium text-gray-900">{product.total_sold}</span>
          </div>
        ))}
      </div>
    </div>
  );
}