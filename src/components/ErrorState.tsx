import { AlertTriangle, RefreshCw, ExternalLink } from 'lucide-react';
import { useState } from 'react';

interface ErrorStateProps {
  error: string;
  pdfUrl: string;
  onRetry: (proxyIndex: number) => void;
}

const PROXIES = [
  { name: 'AllOrigins', url: 'https://api.allorigins.win/raw?url=' },
  { name: 'CORSProxy.io', url: 'https://corsproxy.io/?' },
  { name: 'Direct (no proxy)', url: '' },
];

export function ErrorState({ error, pdfUrl, onRetry }: ErrorStateProps) {
  const [proxyIndex, setProxyIndex] = useState(0);
  const [showHelp, setShowHelp] = useState(false);

  const isCorsError = error.toLowerCase().includes('cors') ||
    error.toLowerCase().includes('network') ||
    error.toLowerCase().includes('fetch');

  return (
    <div className="flex flex-col items-center justify-center w-full h-full bg-gray-950 text-white px-6">
      <AlertTriangle className="w-14 h-14 text-amber-400 mb-5" />
      <h2 className="text-xl font-semibold mb-2">Failed to Load PDF</h2>
      <p className="text-sm text-gray-400 mb-6 max-w-md text-center">{error}</p>

      {isCorsError && (
        <div className="w-full max-w-md mb-6">
          <button
            onClick={() => setShowHelp(!showHelp)}
            className="text-sm text-emerald-400 hover:text-emerald-300 underline mb-3"
          >
            {showHelp ? 'Hide' : 'Show'} CORS help
          </button>

          {showHelp && (
            <div className="bg-gray-900 rounded-lg p-4 text-sm text-gray-300 space-y-3">
              <p>
                Browsers block cross-origin requests for security. Try these solutions:
              </p>
              <ol className="list-decimal list-inside space-y-2 text-gray-400">
                <li>Use a proxy server (select below)</li>
                <li>Host the PDF on the same domain</li>
                <li>Enable CORS on your server</li>
              </ol>
              <p className="text-xs text-gray-500 pt-1">
                URL: <span className="font-mono break-all">{pdfUrl}</span>
              </p>
            </div>
          )}
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md">
        <div className="flex gap-2">
          {PROXIES.map((proxy, i) => (
            <button
              key={proxy.name}
              onClick={() => setProxyIndex(i)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                proxyIndex === i
                  ? 'bg-emerald-500 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              {proxy.name}
            </button>
          ))}
        </div>

        <button
          onClick={() => onRetry(proxyIndex)}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-sm font-medium transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Retry
        </button>
      </div>

      <a
        href={pdfUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 mt-4 text-sm text-gray-400 hover:text-white transition-colors"
      >
        <ExternalLink className="w-4 h-4" />
        Open PDF directly
      </a>
    </div>
  );
}
