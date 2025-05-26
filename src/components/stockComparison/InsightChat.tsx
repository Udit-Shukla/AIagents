import React, { useEffect, useState } from 'react';
import axios, { AxiosError } from 'axios';

interface InsightChatProps {
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
  shouldRefetch: boolean;
}

const InsightChat: React.FC<InsightChatProps> = ({ summary, changed, added, removed, shouldRefetch }) => {
  const [insight, setInsight] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInsight = async () => {
      // Don't fetch if we already have an insight and shouldn't refetch
      if (insight && !shouldRefetch) return;

      setLoading(true);
      setError(null);
      try {
        console.log("Sending request with data:", {
          summary,
          changedCount: changed.length,
          addedCount: added.length,
          removedCount: removed.length
        });

        const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/generate-insights`, {
          summary,
          changed,
          added,
          removed,
        });

        console.log("Received response:", res.data);

        if (!res.data.insight) {
          throw new Error("No insight data in response");
        }

        // Enhance output with keyword highlighting (simple client-side)
        let html = res.data.insight;
        html = html
          .replace(/\b(increase|gain|profit|positive)\b/gi, `<span class="text-green-600 font-semibold">$1</span>`)
          .replace(/\b(decrease|loss|drop|negative)\b/gi, `<span class="text-red-600 font-semibold">$1</span>`)
          .replace(/(\$[\d,.]+)/g, `<span class="font-bold text-blue-700">$1</span>`);

        setInsight(html);
      } catch (err: unknown) {
        const error = err as AxiosError<{ error: string }>;
        console.error("Insight fetch failed:", {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status
        });
        setError(error.response?.data?.error || error.message || "Failed to generate insight");
        setInsight(null);
      } finally {
        setLoading(false);
      }
    };

    fetchInsight();
  }, [summary, changed, added, removed, shouldRefetch, insight]);

  return (
    <div className="fade-in animate-slide-up">
      <h2 className="text-xl font-semibold mb-4 text-theme-heading">💡 AI Insights</h2>

      <div className="text-sm leading-relaxed bg-white p-4 rounded shadow prose max-w-none transition-all duration-300 ease-in-out">
        {loading ? (
          <p className="italic text-gray-500 animate-pulse">Generating summary...</p>
        ) : error ? (
          <p className="text-red-600">⚠️ {error}</p>
        ) : (
          <div dangerouslySetInnerHTML={{ __html: insight || '' }} />
        )}
      </div>
    </div>
  );
};

export default InsightChat;
