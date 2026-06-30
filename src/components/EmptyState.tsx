import { useState } from 'react';

interface EmptyStateProps {
  onLoadPdf: (url: string) => void;
}

export function EmptyState({ onLoadPdf }: EmptyStateProps) {
  const [url, setUrl] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) onLoadPdf(url.trim());
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-full bg-gray-950 text-white px-6 text-center">
      <p className="text-white/60 mb-4">Paste a PDF URL to view it as a flipbook.</p>
      <form onSubmit={handleSubmit} className="w-full max-w-md flex gap-2">
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://example.com/file.pdf"
          className="flex-1 bg-white/10 border border-white/10 rounded-lg px-4 py-2 text-sm text-white placeholder-white/30 focus:border-white/40 focus:outline-none"
          required
        />
        <button
          type="submit"
          className="px-5 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm transition-colors"
        >
          Load
        </button>
      </form>
      <p className="text-xs text-white/30 mt-4">
        Example: ?pdf=https://example.com/file.pdf
      </p>
    </div>
  );
}
