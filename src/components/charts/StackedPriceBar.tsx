import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
  Cell
} from 'recharts';

interface ChangedProduct {
  sku: string;
  oldCost: number | null;
  newCost: number | null;
}

const StackedPriceBar: React.FC<{ data: ChangedProduct[] }> = ({ data }) => {
  const chartData = data
    .filter((item) => item.oldCost !== null && item.newCost !== null)
    .slice(0, 10)
    .map((item) => ({
      name: item.sku,
      oldCost: item.oldCost,
      newCost: item.newCost,
    }));

  return (
    <div className="card fade-in">
      <h2 className="text-lg font-semibold mb-4 text-theme-heading">
        📊 Old vs New Cost Comparison
      </h2>
      <ResponsiveContainer width="100%" height={350}>
        <BarChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" angle={-45} textAnchor="end" interval={0} height={80} />
          <YAxis />
          <Tooltip formatter={(value: number) => `$${value.toFixed(2)}`} />
          <Legend />
          <Bar dataKey="oldCost" fill="#94a3b8" name="Old Cost">
            {chartData.map((_, i) => (
              <Cell key={`old-${i}`} fill="#94a3b8" />
            ))}
          </Bar>
          <Bar dataKey="newCost" fill="#3b82f6" name="New Cost">
            {chartData.map((_, i) => (
              <Cell key={`new-${i}`} fill="#3b82f6" />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StackedPriceBar;
