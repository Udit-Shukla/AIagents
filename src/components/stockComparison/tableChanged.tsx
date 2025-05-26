import React from 'react';

interface ChangedProduct {
  sku: string;
  oldCost: number | null;
  newCost: number | null;
  costChange: number | null;
  costPercent: string | null;
}

const TableChanged: React.FC<{ data: ChangedProduct[] }> = ({ data }) => {
  return (
    <div className="card fade-in">
      <h2 className="text-lg font-semibold mb-4 text-theme-heading">🔁 Changed Products</h2>
      <div className="max-h-[400px] overflow-auto">
        <table className="min-w-full text-sm text-left border rounded">
          <thead className="bg-gray-100 text-xs uppercase font-semibold sticky top-0">
            <tr>
              <th className="px-4 py-2 border">SKU</th>
              <th className="px-4 py-2 border">Old Cost</th>
              <th className="px-4 py-2 border">New Cost</th>
              <th className="px-4 py-2 border">% Change</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, i) => {
              const percent = item.costPercent ? parseFloat(item.costPercent) : 0;
              const isIncrease = percent > 0;
              const color = isIncrease ? 'text-green-600' : percent < 0 ? 'text-red-500' : 'text-gray-600';

              return (
                <tr key={i} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-2 border font-medium">{item.sku}</td>
                  <td className="px-4 py-2 border">{item.oldCost !== null ? `$${item.oldCost.toFixed(2)}` : '—'}</td>
                  <td className="px-4 py-2 border">{item.newCost !== null ? `$${item.newCost.toFixed(2)}` : '—'}</td>
                  <td className={`px-4 py-2 border font-semibold ${color}`}>
                    {item.costPercent ? `${item.costPercent}%` : '—'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TableChanged;
