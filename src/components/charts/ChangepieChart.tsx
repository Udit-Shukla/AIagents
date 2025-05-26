import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const COLORS = ['#10b981', '#ef4444', '#3b82f6'];

interface Summary {
  added: number;
  removed: number;
  changed: number;
}

const ChangePieChart: React.FC<{ summary: Summary }> = ({ summary }) => {
  const data = [
    { name: 'Added', value: summary.added },
    { name: 'Removed', value: summary.removed },
    { name: 'Changed', value: summary.changed },
  ];

  const total = summary.added + summary.removed + summary.changed;

  return (
    <div className="card fade-in">
      <h2 className="text-lg font-semibold mb-4 text-theme-heading">📊 Change Distribution</h2>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            dataKey="value"
            data={data}
            cx="50%"
            cy="50%"
            outerRadius={100}
            label={({ name, value }) =>
              `${name}: ${((value / total) * 100).toFixed(0)}%`
            }
          >
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value: number) => `${value} items`} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ChangePieChart;
