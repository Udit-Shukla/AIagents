import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '@/config';
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
  const [resetKey, setResetKey] = useState(0);
  const [insightHtml, setInsightHtml] = useState<string | null>(null);
  
  // Chat state
  const [question, setQuestion] = useState('');
  const [chatHistory, setChatHistory] = useState<{ question: string; answer: string }[]>([]);
  const [chatLoading, setChatLoading] = useState(false);
  const [chatError, setChatError] = useState<string | null>(null);

  const handleCompare = async () => {
    if (!oldFile || !newFile) {
      setError("Please select both files to compare");
      return;
    }

    setLoading(true);
    setError(null);
    setShouldRefetchInsights(true);
    setResetKey(prev => prev + 1);

    try {
      const formData = new FormData();
      formData.append('oldFile', oldFile);
      formData.append('newFile', newFile);

      console.log('API URL:', API_URL);

      const response = await axios.post(`${API_URL}/api/compare-stocks`, formData, {
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

  const handleAsk = async () => {
    if (!question.trim()) return;
    setChatLoading(true);
    setChatError(null);
    try {
      const res = await axios.post(`${API_URL}/api/chat`, {
        question,
        insight: insightHtml,
        dataSummary: { summary: result?.summary, changed: result?.changed, added: result?.added, removed: result?.removed },
      });
      setChatHistory(prev => [...prev, { question, answer: res.data.answer }]);
      setQuestion('');
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setChatError(err.response?.data?.error || err.message || 'Failed to get answer');
      } else if (err instanceof Error) {
        setChatError(err.message);
      } else {
        setChatError('Failed to get answer');
      }
    } finally {
      setChatLoading(false);
    }
  };

  // Reset chat when comparison is reset
  useEffect(() => {
    setChatHistory([]);
    setQuestion('');
    setChatError(null);
  }, [resetKey]);

  // Reset shouldRefetch after compare is done
  useEffect(() => {
    if (shouldRefetchInsights) {
      setShouldRefetchInsights(false);
    }
  }, [shouldRefetchInsights]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-row h-screen">
      {/* Sidebar: 25% width, fixed height */}
      <div className=" min-w-[10%] max-w-[20%] h-screen">
        <Sidebar />
      </div>
      {/* Main content: 75% width, scrollable */}
      <div className="min-w-[90%] max-w-[80%] h-screen overflow-y-auto">
        <div className="px-4 sm:px-6 lg:px-8 py-8">
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
            <div className="flex flex-col-reverse lg:flex-row gap-6 w-full mx-auto fade-in h-screen">
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

              {/* RIGHT: Insights and Chat */}
              <div className="w-full lg:w-2/5 space-y-6">
                {/* AI Insights Section */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <h3 className="font-semibold text-gray-800">📊 AI Insights</h3>
                  </div>
                  <div className="p-4 max-h-80 overflow-y-auto">
                    <InsightChat
                      summary={result.summary}
                      changed={result.changed}
                      added={result.added}
                      removed={result.removed}
                      shouldRefetch={shouldRefetchInsights}
                      setInsightHtml={setInsightHtml}
                    />
                  </div>
                </div>

                {/* Interactive Chat Section */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <h3 className="font-semibold text-gray-800">💬 Ask AI About This Data</h3>
                  </div>
                  
                  {/* Chat History */}
                  <div className="p-4 max-h-80 overflow-y-auto space-y-4">
                    {chatHistory.length === 0 && (
                      <p className="text-gray-400 text-center italic text-sm">Ask anything about price changes or insights...</p>
                    )}
                    {chatHistory.map((msg, idx) => (
                      <div key={idx} className="space-y-2">
                        <div className="text-blue-700 font-medium text-sm">You:</div>
                        <div className="text-gray-800 text-sm mb-2">{msg.question}</div>
                        <div className="bg-gray-50 text-gray-700 p-3 rounded-md border border-gray-100">
                          <span className="font-semibold text-sm">AI:</span> 
                          <span className="text-sm ml-1">{msg.answer}</span>
                        </div>
                      </div>
                    ))}
                    {chatError && (
                      <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md border border-red-200">
                        {chatError}
                      </div>
                    )}
                  </div>

                  {/* Chat Input */}
                  <div className="p-4 border-t border-gray-100">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                        placeholder="Type your question..."
                        value={question}
                        onChange={e => setQuestion(e.target.value)}
                        onKeyDown={e => { if (e.key === 'Enter') handleAsk(); }}
                        disabled={chatLoading}
                      />
                      <button
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={handleAsk}
                        disabled={chatLoading || !question.trim()}
                      >
                        {chatLoading ? '...' : 'Ask'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
