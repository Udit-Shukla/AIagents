import React from 'react';

interface AddedProduct {
  sku: string;
  cost: number;
}

const TableAdded: React.FC<{ data: AddedProduct[] }> = ({ data }) => {
  return (
    <div className="card fade-in">
      <h2 className="text-lg font-semibold mb-4 text-theme-heading">➕ Added Products</h2>
      <div className="max-h-[400px] overflow-auto">
        <table className="min-w-full text-sm text-left border rounded">
          <thead className="bg-green-100 text-xs uppercase font-semibold text-theme-text sticky top-0">
            <tr>
              <th className="px-4 py-2 border">SKU</th>
              <th className="px-4 py-2 border">Cost</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, i) => (
              <tr key={i} className="hover:bg-green-50 transition-all">
                <td className="px-4 py-2 border font-medium">{item.sku}</td>
                <td className="px-4 py-2 border text-blue-600 font-semibold">${item.cost.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TableAdded;
