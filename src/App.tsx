import { useState, useEffect, useCallback, useRef } from 'react';
import { FlipbookViewer } from './components/FlipbookViewer';
import { LoadingState } from './components/LoadingState';
import { ErrorState } from './components/ErrorState';
import { EmptyState } from './components/EmptyState';

type ViewState =
  | { type: 'empty' }
  | { type: 'loading'; current: number; total: number }
  | { type: 'error'; error: string; pdfUrl: string }
  | { type: 'loaded'; pdfUrl: string };

const DEFAULT_PROXIES = [
  '', // direct
  'https://corsproxy.io/?',
  'https://api.allorigins.win/raw?url=',
];

function applyProxy(url: string, proxy: string): string {
  if (!proxy) return url;
  return `${proxy}${encodeURIComponent(url)}`;
}

function App() {
  const [view, setView] = useState<ViewState>({ type: 'empty' });
  const [rawPdfUrl, setRawPdfUrl] = useState('');
  const [proxy, setProxy] = useState('');
  const viewerKey = useRef(0);

  const loadPdf = useCallback((url: string, proxyUrl: string = '') => {
    setRawPdfUrl(url);
    setProxy(proxyUrl);
    viewerKey.current += 1;
    setView({ type: 'loading', current: 0, total: 1 });
    setTimeout(() => {
      setView({ type: 'loaded', pdfUrl: applyProxy(url, proxyUrl) });
    }, 50);
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const pdfParam = params.get('pdf');
    const pdfB64 = params.get('pdf_b64');
    const proxyParam = params.get('proxy') || '';

    if (pdfParam) {
      loadPdf(pdfParam, proxyParam);
    } else if (pdfB64) {
      try {
        loadPdf(atob(pdfB64), proxyParam);
      } catch {
        setView({ type: 'error', error: 'Invalid base64 PDF URL', pdfUrl: '' });
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleError = useCallback((error: string) => {
    if (view.type === 'loaded') {
      setView({ type: 'error', error, pdfUrl: rawPdfUrl });
    }
  }, [rawPdfUrl, view.type]);

  const handleLoadingProgress = useCallback((current: number, total: number) => {
    setView({ type: 'loading', current, total });
  }, []);

  const handleRetry = useCallback((proxyIndex: number) => {
    if (!rawPdfUrl) return;
    const nextProxy = DEFAULT_PROXIES[proxyIndex] ?? '';
    loadPdf(rawPdfUrl, nextProxy);
  }, [rawPdfUrl, loadPdf]);

  const handleSetProxy = useCallback((proxyUrl: string) => {
    if (rawPdfUrl) {
      loadPdf(rawPdfUrl, proxyUrl);
    }
  }, [rawPdfUrl, loadPdf]);

  switch (view.type) {
    case 'empty':
      return <EmptyState onLoadPdf={loadPdf} />;

    case 'loading':
      return <LoadingState current={view.current} total={view.total} />;

    case 'error':
      return (
        <ErrorState
          error={view.error}
          pdfUrl={view.pdfUrl}
          currentProxy={proxy}
          onRetry={handleRetry}
          onSetProxy={handleSetProxy}
        />
      );

    case 'loaded':
      return (
        <FlipbookViewer
          key={viewerKey.current}
          pdfUrl={view.pdfUrl}
          rawPdfUrl={rawPdfUrl}
          onError={handleError}
          onLoadingProgress={handleLoadingProgress}
        />
      );
  }
}

export default App;
