import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  LabelList,
  Legend,
  Cell,
} from 'recharts';

interface ChangedProduct {
  sku: string;
  oldCost: number | null;
  newCost: number | null;
  costChange: number | null;
  costPercent: string | null;
  [key: string]: string | number | null; // Add index signature
}

const metricLabels: Record<string, string> = {
  costPercent: '% Cost Change',
};

const PriceChangeBar: React.FC<{ data: ChangedProduct[]; metric: string }> = ({ data, metric }) => {
  const chartData = [...data]
    .filter((item) => item[metric] !== null && item[metric] !== undefined)
    .map((item) => ({
      name: item.sku,
      value: parseFloat(item[metric] as string),
    }))
    .sort((a, b) => Math.abs(b.value) - Math.abs(a.value))
    .slice(0, 10);

  return (
    <div className="card fade-in">
      <h2 className="text-lg font-semibold mb-4 text-theme-heading">
        📊 Top Products by {metricLabels[metric] || metric}
      </h2>
      <ResponsiveContainer width="100%" height={350}>
        <BarChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" angle={-45} textAnchor="end" interval={0} height={80} />
          <YAxis />
          <Tooltip formatter={(value: number) => `${value}${metric.includes("Percent") ? "%" : ""}`} />
          <Legend />
          <Bar
            dataKey="value"
            name={metricLabels[metric]}
            isAnimationActive={true}
            radius={[4, 4, 0, 0]}
          >
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.value >= 0 ? '#10b981' : '#ef4444'} // green for up, red for down
              />
            ))}
            <LabelList
              dataKey="value"
              position="top"
              formatter={(val: number) =>
                `${val}${metric.includes('Percent') ? '%' : ''}`
              }
              className="text-xs font-semibold"
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PriceChangeBar;
