import { useState } from 'react';
import { BookOpen, ExternalLink, Code } from 'lucide-react';

interface EmptyStateProps {
  onLoadPdf: (url: string) => void;
}

export function EmptyState({ onLoadPdf }: EmptyStateProps) {
  const [url, setUrl] = useState('');
  const [showEmbed, setShowEmbed] = useState(false);

  const samplePdfs = [
    'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    'https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
      onLoadPdf(url.trim());
    }
  };

  const embedCode = `<iframe
  src="https://YOUR_USERNAME.github.io/pdf-flipbook/?pdf=${encodeURIComponent(url || 'YOUR_PDF_URL')}"
  width="100%"
  height="600"
  frameborder="0"
  allowfullscreen
  style="border: none;"
></iframe>`;

  return (
    <div className="flex flex-col items-center justify-center w-full h-full bg-gray-950 text-white px-4">
      <div className="max-w-xl w-full">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-500/10 text-emerald-400 mb-5">
            <BookOpen className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold mb-2">PDF Flipbook Viewer</h1>
          <p className="text-gray-400">
            View any PDF as an interactive 3D flipbook. Embed on any website.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 mb-8">
          <div className="flex gap-2">
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Paste a PDF URL here..."
              className="flex-1 bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:border-emerald-500 focus:outline-none transition-colors"
              required
            />
            <button
              type="submit"
              className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-sm font-medium transition-colors"
            >
              Load PDF
            </button>
          </div>
        </form>

        <div className="mb-8">
          <p className="text-sm text-gray-500 mb-3">Or try a sample PDF:</p>
          <div className="flex flex-wrap gap-2">
            {samplePdfs.map((pdf, i) => (
              <button
                key={i}
                onClick={() => onLoadPdf(pdf)}
                className="flex items-center gap-2 px-3 py-2 bg-gray-900 hover:bg-gray-800 border border-gray-800 rounded-lg text-sm text-gray-300 transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                Sample {i + 1}
              </button>
            ))}
          </div>
        </div>

        <div className="border-t border-gray-800 pt-6">
          <button
            onClick={() => setShowEmbed(!showEmbed)}
            className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
          >
            <Code className="w-4 h-4" />
            {showEmbed ? 'Hide' : 'Show'} embed code
          </button>

          {showEmbed && (
            <div className="mt-3 bg-gray-900 rounded-xl p-4 border border-gray-800">
              <p className="text-xs text-gray-400 mb-2">
                Paste this iframe code on any website:
              </p>
              <pre className="text-xs text-gray-300 overflow-x-auto whitespace-pre-wrap break-all font-mono">
                {embedCode}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
