import { AlertTriangle, RefreshCw } from 'lucide-react';
import { useState } from 'react';

interface ErrorStateProps {
  error: string;
  pdfUrl: string;
  currentProxy: string;
  onRetry: (proxyIndex: number) => void;
  onSetProxy: (proxyUrl: string) => void;
}

const BUILT_IN_PROXIES = [
  { name: 'Direct', value: '' },
  { name: 'corsproxy.io', value: 'https://corsproxy.io/?' },
  { name: 'allorigins', value: 'https://api.allorigins.win/raw?url=' },
];

export function ErrorState({
  error,
  pdfUrl,
  currentProxy,
  onRetry,
  onSetProxy,
}: ErrorStateProps) {
  const [customProxy, setCustomProxy] = useState('');
  const isCorsError =
    error.toLowerCase().includes('cors') ||
    error.toLowerCase().includes('network') ||
    error.toLowerCase().includes('failed to fetch');

  const currentIndex = BUILT_IN_PROXIES.findIndex((p) => p.value === currentProxy);
  const nextIndex = (currentIndex + 1) % BUILT_IN_PROXIES.length;

  return (
    <div className="flex flex-col items-center justify-center w-full h-full bg-gray-950 text-white px-6 text-center">
      <AlertTriangle className="w-10 h-10 text-amber-400 mb-4" />
      <h2 className="text-lg font-medium mb-2">Could not load PDF</h2>
      <p className="text-sm text-white/50 mb-6 max-w-md break-all">
        {isCorsError
          ? 'The PDF server is blocking cross-origin requests. Try a different proxy or host the PDF on a server with CORS enabled.'
          : error}
      </p>

      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <button
          onClick={() => onRetry(nextIndex)}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Try {BUILT_IN_PROXIES[nextIndex].name}
        </button>
      </div>

      <div className="w-full max-w-sm">
        <p className="text-xs text-white/40 mb-2">Or enter your own CORS proxy:</p>
        <div className="flex gap-2">
          <input
            type="url"
            value={customProxy}
            onChange={(e) => setCustomProxy(e.target.value)}
            placeholder="https://your-proxy.com/?url="
            className="flex-1 bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-white/30 focus:border-white/40 focus:outline-none"
          />
          <button
            onClick={() => customProxy && onSetProxy(customProxy)}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm transition-colors"
          >
            Use
          </button>
        </div>
      </div>

      {pdfUrl && (
        <p className="text-xs text-white/30 mt-6 max-w-md break-all">
          URL: {pdfUrl}
        </p>
      )}
    </div>
  );
}
