import {
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Maximize,
  Minimize,
  Download,
  BookOpen,
} from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

interface ControlsProps {
  currentPage: number;
  totalPages: number;
  zoom: number;
  isFullscreen: boolean;
  pdfUrl: string;
  onPrev: () => void;
  onNext: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onToggleFullscreen: () => void;
  onJumpToPage: (page: number) => void;
}

export function Controls({
  currentPage,
  totalPages,
  zoom,
  isFullscreen,
  pdfUrl,
  onPrev,
  onNext,
  onZoomIn,
  onZoomOut,
  onToggleFullscreen,
  onJumpToPage,
}: ControlsProps) {
  const [inputValue, setInputValue] = useState(String(currentPage + 1));
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setInputValue(String(currentPage + 1));
  }, [currentPage]);

  const handleJump = () => {
    const page = parseInt(inputValue, 10);
    if (!isNaN(page) && page >= 1 && page <= totalPages) {
      onJumpToPage(page - 1);
    } else {
      setInputValue(String(currentPage + 1));
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleJump();
      inputRef.current?.blur();
    }
  };

  const zoomPercent = Math.round(zoom * 100);

  return (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-4 py-2.5 bg-gray-900/90 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-800">
      {/* Prev */}
      <button
        onClick={onPrev}
        disabled={currentPage <= 0}
        className="p-2 rounded-xl text-gray-300 hover:text-white hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        title="Previous page"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      {/* Page counter */}
      <div className="flex items-center gap-1.5 px-2">
        <BookOpen className="w-4 h-4 text-gray-500" />
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleJump}
          className="w-12 bg-gray-800 text-white text-center text-sm rounded-lg py-1 border border-gray-700 focus:border-emerald-500 focus:outline-none"
        />
        <span className="text-sm text-gray-400">/ {totalPages}</span>
      </div>

      {/* Next */}
      <button
        onClick={onNext}
        disabled={currentPage >= totalPages - 1}
        className="p-2 rounded-xl text-gray-300 hover:text-white hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        title="Next page"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      <div className="w-px h-6 bg-gray-700 mx-1" />

      {/* Zoom out */}
      <button
        onClick={onZoomOut}
        disabled={zoom <= 0.5}
        className="p-2 rounded-xl text-gray-300 hover:text-white hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        title="Zoom out"
      >
        <ZoomOut className="w-5 h-5" />
      </button>

      <span className="text-xs text-gray-400 w-12 text-center">{zoomPercent}%</span>

      {/* Zoom in */}
      <button
        onClick={onZoomIn}
        disabled={zoom >= 3}
        className="p-2 rounded-xl text-gray-300 hover:text-white hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        title="Zoom in"
      >
        <ZoomIn className="w-5 h-5" />
      </button>

      <div className="w-px h-6 bg-gray-700 mx-1" />

      {/* Fullscreen */}
      <button
        onClick={onToggleFullscreen}
        className="p-2 rounded-xl text-gray-300 hover:text-white hover:bg-gray-700 transition-colors"
        title={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
      >
        {isFullscreen ? (
          <Minimize className="w-5 h-5" />
        ) : (
          <Maximize className="w-5 h-5" />
        )}
      </button>

      {/* Download */}
      <a
        href={pdfUrl}
        target="_blank"
        rel="noopener noreferrer"
        download
        className="p-2 rounded-xl text-gray-300 hover:text-white hover:bg-gray-700 transition-colors"
        title="Download PDF"
      >
        <Download className="w-5 h-5" />
      </a>
    </div>
  );
}
