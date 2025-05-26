import React, { useState, useEffect } from 'react';
import axios from 'axios';
import FileUploader from '@/components/stockComparison/FileUploader';
import SummaryBlock from '@/components/stockComparison/SummaryBlock';
import TableChanged from '@/components/stockComparison/tableChanged';
import TableAdded from '@/components/stockComparison/TableAdded';
import TableRemoved from '@/components/stockComparison/TableRemoved';
import PriceChangeBar from '@/components/charts/PriceChangeBar';
import ChangePieChart from '@/components/charts/ChangepieChart';
import StackedPriceBar from '@/components/charts/StackedPriceBar';
import InsightChat from '@/components/stockComparison/InsightChat';
import Sidebar from '@/components/Sidebar';

interface ComparisonResult {
  summary: {
    oldCount: number;
    newCount: number;
    added: number;
    removed: number;
    changed: number;
  };
  changed: Array<{
    sku: string;
    oldCost: number | null;
    newCost: number | null;
    costChange: number | null;
    costPercent: string | null;
  }>;
  added: Array<{
    sku: string;
    cost: number;
  }>;
  removed: string[];
}

export default function Home() {
  const [oldFile, setOldFile] = useState<File | null>(null);
  const [newFile, setNewFile] = useState<File | null>(null);
  const [result, setResult] = useState<ComparisonResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [shouldRefetchInsights, setShouldRefetchInsights] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCompare = async () => {
    if (!oldFile || !newFile) {
      setError("Please select both files to compare");
      return;
    }

    setLoading(true);
    setError(null);
    setShouldRefetchInsights(true);

    try {
      const formData = new FormData();
      formData.append('oldFile', oldFile);
      formData.append('newFile', newFile);

      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/compare-stocks`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setResult(response.data);
    } catch (err) {
      console.error('Comparison failed:', err);
      setError('Failed to compare files. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Reset shouldRefetch after compare is done
  useEffect(() => {
    if (shouldRefetchInsights) {
      setShouldRefetchInsights(false);
    }
  }, [shouldRefetchInsights]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-row">
      <Sidebar />
      <div className=" mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Stock Comparison Tool</h1>
          <p className="mt-2 text-gray-600">Compare two stock files to analyze changes</p>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <FileUploader label="Upload Old Price File" onFileSelect={setOldFile} />
          <FileUploader label="Upload New Price File" onFileSelect={setNewFile} />
        </div>

        <div className="text-center mb-10">
          <button
            onClick={handleCompare}
            disabled={loading}
            className="btn btn-primary"
          >
            {loading ? 'Comparing...' : 'Compare Files'}
          </button>
        </div>

        {result && (
          <div className="flex flex-col-reverse lg:flex-row gap-6 w-full mx-auto fade-in">
            {/* LEFT: Tables + Charts */}
            <div className="w-full lg:w-3/5 space-y-8">
              <SummaryBlock summary={result.summary} />
              <TableChanged data={result.changed} />
              <TableAdded data={result.added} />
              <TableRemoved data={result.removed} />

              <div className="card fade-in">
                <PriceChangeBar data={result.changed} metric="costPercent" />
                <ChangePieChart summary={result.summary} />
              </div>

              <div className="text-center">
                <button
                  onClick={() => setShowDetails(prev => !prev)}
                  className="btn btn-outline"
                >
                  {showDetails ? 'Hide Advanced Charts' : 'Show More Insights'}
                </button>
              </div>

              {showDetails && (
                <div className="space-y-8">
                  <StackedPriceBar data={result.changed} />
                </div>
              )}
            </div>

            {/* RIGHT: Insights */}
            <div className="w-full lg:w-2/5">
              <div className=" max-h-lvh overflow-y-auto pr-4">
                <InsightChat
                  summary={result.summary}
                  changed={result.changed}
                  added={result.added}
                  removed={result.removed}
                  shouldRefetch={shouldRefetchInsights}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
