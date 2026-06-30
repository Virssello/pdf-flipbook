import { useState, useEffect, useCallback, useRef } from 'react';
import { FlipbookViewer } from './components/FlipbookViewer';
import { LoadingState } from './components/LoadingState';
import { ErrorState } from './components/ErrorState';
import { EmptyState } from './components/EmptyState';

type ViewState =
  | { type: 'empty' }
  | { type: 'loading'; current: number; total: number }
  | { type: 'error'; error: string }
  | { type: 'loaded'; pdfUrl: string };

const PROXY_LIST = [
  '', // direct
  'https://api.allorigins.win/raw?url=',
  'https://corsproxy.io/?',
];

function getProxyUrl(url: string, proxyIndex: number): string {
  const proxy = PROXY_LIST[proxyIndex] || '';
  return proxy ? `${proxy}${encodeURIComponent(url)}` : url;
}

function App() {
  const [view, setView] = useState<ViewState>({ type: 'empty' });
  const [rawPdfUrl, setRawPdfUrl] = useState('');
  const viewerKey = useRef(0);

  // Load PDF directly — no pre-checks, fully automatic
  const loadPdf = useCallback((url: string, proxyIdx: number = 1) => {
    setRawPdfUrl(url);
    viewerKey.current += 1;
    const proxiedUrl = getProxyUrl(url, proxyIdx);
    // Go straight to loading — PDF.js handles errors internally
    setView({ type: 'loading', current: 0, total: 1 });
    // Small delay then mount the viewer — it handles its own loading
    setTimeout(() => {
      setView({ type: 'loaded', pdfUrl: proxiedUrl });
    }, 100);
  }, []);

  // Read URL parameter on mount — auto-load if present
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const pdfParam = params.get('pdf');
    const pdfB64 = params.get('pdf_b64');

    if (pdfParam) {
      loadPdf(pdfParam, 1);
    } else if (pdfB64) {
      try {
        const decoded = atob(pdfB64);
        loadPdf(decoded, 1);
      } catch {
        setView({ type: 'error', error: 'Invalid base64 PDF URL' });
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleError = useCallback((error: string) => {
    setView({ type: 'error', error });
  }, []);

  const handleLoadingProgress = useCallback((current: number, total: number) => {
    setView({ type: 'loading', current, total });
  }, []);

  const handleRetry = useCallback((newProxyIndex: number) => {
    if (rawPdfUrl) {
      loadPdf(rawPdfUrl, newProxyIndex);
    }
  }, [rawPdfUrl, loadPdf]);

  const handleLoadPdf = useCallback((url: string) => {
    loadPdf(url, 1);
  }, [loadPdf]);

  switch (view.type) {
    case 'empty':
      return <EmptyState onLoadPdf={handleLoadPdf} />;

    case 'loading':
      return (
        <LoadingState
          current={view.current}
          total={view.total}
        />
      );

    case 'error':
      return (
        <ErrorState
          error={view.error}
          pdfUrl={rawPdfUrl}
          onRetry={handleRetry}
        />
      );

    case 'loaded':
      return (
        <FlipbookViewer
          key={viewerKey.current}
          pdfUrl={view.pdfUrl}
          onError={handleError}
          onLoadingProgress={handleLoadingProgress}
        />
      );
  }
}

export default App;
