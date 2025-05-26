import React from 'react';

interface Summary {
  oldCount: number;
  newCount: number;
  added: number;
  removed: number;
  changed: number;
}

const SummaryBlock: React.FC<{ summary: Summary }> = ({ summary }) => {
  return (
    <div className="card fade-in">
      <h2 className="text-xl font-semibold mb-4 text-theme-heading">✅ Summary</h2>
      <ul className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm text-theme-text">
        <li><span className="font-medium text-muted">Old SKUs:</span> {summary.oldCount}</li>
        <li><span className="font-medium text-muted">New SKUs:</span> {summary.newCount}</li>
        <li><span className="font-semibold text-green-600">Added:</span> {summary.added}</li>
        <li><span className="font-semibold text-red-500">Removed:</span> {summary.removed}</li>
        <li><span className="font-semibold text-blue-600">Changed:</span> {summary.changed}</li>
      </ul>
    </div>
  );
};

export default SummaryBlock;
