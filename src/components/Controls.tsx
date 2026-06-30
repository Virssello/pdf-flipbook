import { ChevronLeft, ChevronRight, Maximize, Minimize } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

interface ControlsProps {
  currentPage: number;
  totalPages: number;
  isFullscreen: boolean;
  pdfUrl: string;
  onPrev: () => void;
  onNext: () => void;
  onToggleFullscreen: () => void;
  onJumpToPage: (page: number) => void;
}

export function Controls({
  currentPage,
  totalPages,
  isFullscreen,
  pdfUrl,
  onPrev,
  onNext,
  onToggleFullscreen,
  onJumpToPage,
}: ControlsProps) {
  const [inputValue, setInputValue] = useState(String(currentPage + 1));
  const [visible, setVisible] = useState(true);
  const hideTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setInputValue(String(currentPage + 1));
  }, [currentPage]);

  useEffect(() => {
    const handleMouseMove = () => {
      setVisible(true);
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = setTimeout(() => setVisible(false), 2500);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchstart', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchstart', handleMouseMove);
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    };
  }, []);

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

  return (
    <div
      className={`absolute bottom-3 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-4 py-2 bg-black/70 backdrop-blur-sm rounded-full shadow-lg border border-white/10 transition-opacity duration-300 ${
        visible ? 'opacity-100' : 'opacity-0'
      }`}
      onMouseEnter={() => setVisible(true)}
    >
      <button
        onClick={onPrev}
        disabled={currentPage <= 0}
        className="p-1.5 rounded-full text-white/80 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        aria-label="Previous page"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <div className="flex items-center gap-1.5 text-sm text-white/90">
        <input
          ref={inputRef}
          type="text"
          inputMode="numeric"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleJump}
          className="w-10 bg-white/10 text-white text-center rounded-md py-0.5 text-sm border border-white/10 focus:border-white/40 focus:outline-none"
        />
        <span className="text-white/50">/</span>
        <span>{totalPages}</span>
      </div>

      <button
        onClick={onNext}
        disabled={currentPage >= totalPages - 1}
        className="p-1.5 rounded-full text-white/80 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        aria-label="Next page"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      <div className="w-px h-5 bg-white/20" />

      <button
        onClick={onToggleFullscreen}
        className="p-1.5 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors"
        aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
      >
        {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
      </button>

      <a
        href={pdfUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="hidden"
        aria-hidden="true"
      >
        PDF
      </a>
    </div>
  );
}
