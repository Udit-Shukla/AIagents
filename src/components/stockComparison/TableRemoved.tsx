import React from 'react';

const TableRemoved: React.FC<{ data: string[] }> = ({ data }) => {
  return (
    <div className="card fade-in">
      <h2 className="text-lg font-semibold mb-4 text-theme-heading">❌ Removed Products</h2>
      <div className="max-h-[400px] overflow-auto">
        <div className="flex flex-wrap gap-2 p-2">
          {data.map((sku, i) => (
            <span
              key={i}
              className="px-3 py-1 bg-red-50 text-red-600 rounded-full text-sm font-medium hover:bg-red-100 transition-colors"
            >
              {sku}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TableRemoved;
