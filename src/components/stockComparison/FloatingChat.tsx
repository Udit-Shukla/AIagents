import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '@/config';

interface FloatingChatProps {
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
  resetKey: number;
  insightHtml: string | null;
}

const FloatingChat: React.FC<FloatingChatProps> = ({
  summary,
  changed,
  added,
  removed,
  resetKey,
  insightHtml,
}) => {
  const [open, setOpen] = useState(false);
  const [question, setQuestion] = useState('');
  const [chatHistory, setChatHistory] = useState<{ question: string; answer: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setChatHistory([]);
    setQuestion('');
    setError(null);
  }, [resetKey]);

  const handleAsk = async () => {
    if (!question.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await axios.post(`${API_URL}/api/chats`, {
        question,
        insight: insightHtml,
        dataSummary: { summary, changed, added, removed },
      });
      setChatHistory(prev => [...prev, { question, answer: res.data.answer }]);
      setQuestion('');
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.error || err.message || 'Failed to get answer');
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to get answer');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button
        className="fixed bottom-6 right-6 z-50 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-xl w-14 h-14 flex items-center justify-center transition-all duration-300 ease-in-out"
        onClick={() => setOpen(true)}
        aria-label="Open Chat"
        style={{ display: open ? 'none' : 'flex' }}
      >
        <span className="text-2xl">💬</span>
      </button>

      {/* Chat Panel */}
      {open && (
        <div className="fixed bottom-6 right-6 z-50 w-96 max-w-[90vw] bg-white rounded-xl shadow-2xl border border-gray-200 flex flex-col animate-fade-in">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <span className="font-semibold text-gray-800 text-base">💡 Ask AI About This Data</span>
            <button
              onClick={() => setOpen(false)}
              className="text-gray-400 hover:text-gray-600 transition text-xl"
              aria-label="Close"
            >
              ×
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4 text-sm" style={{ maxHeight: '320px' }}>
            {chatHistory.length === 0 && (
              <p className="text-gray-400 text-center italic">Ask anything about price changes or insights...</p>
            )}
            {chatHistory.map((msg, idx) => (
              <div key={idx}>
                <div className="text-blue-700 font-medium">You:</div>
                <div className="text-gray-800 mb-2">{msg.question}</div>
                <div className="bg-gray-100 text-gray-700 p-3 rounded-md border border-gray-200">
                  <span className="font-semibold">AI:</span> {msg.answer}
                </div>
              </div>
            ))}
            {error && <div className="text-red-600 text-sm">{error}</div>}
          </div>

          <div className="p-3 border-t border-gray-100 flex gap-2">
            <input
              type="text"
              className="flex-1 border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              placeholder="Type your question..."
              value={question}
              onChange={e => setQuestion(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') handleAsk(); }}
              disabled={loading}
            />
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition disabled:opacity-50"
              onClick={handleAsk}
              disabled={loading || !question.trim()}
            >
              {loading ? '...' : 'Ask'}
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default FloatingChat;
