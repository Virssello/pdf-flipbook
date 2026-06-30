import { useEffect, useRef, useState, useCallback } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { PageFlip } from 'page-flip';
import { Controls } from './Controls';

type PDFDocumentProxy = pdfjsLib.PDFDocumentProxy;
type PDFPageProxy = pdfjsLib.PDFPageProxy;

interface FlipbookViewerProps {
  pdfUrl: string;
  rawPdfUrl: string;
  onError: (error: string) => void;
  onLoadingProgress: (current: number, total: number) => void;
}

export function FlipbookViewer({
  pdfUrl,
  rawPdfUrl,
  onError,
  onLoadingProgress,
}: FlipbookViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const flipbookRef = useRef<PageFlip | null>(null);
  const [pageImages, setPageImages] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [containerSize, setContainerSize] = useState({ width: 800, height: 600 });
  const [isMobile, setIsMobile] = useState(false);
  const renderedRef = useRef(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        setContainerSize({ width, height });
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const pageDimensions = useCallback(() => {
    const padding = 80;
    const availableWidth = containerSize.width - 24;
    const availableHeight = containerSize.height - padding;

    if (isMobile) {
      const pageWidth = Math.min(availableWidth, 520);
      const pageHeight = Math.min(availableHeight, pageWidth * 1.414);
      return { width: Math.max(pageWidth, 200), height: Math.max(pageHeight, 280) };
    }

    const pageHeight = Math.min(availableHeight, (availableWidth / 2) * 1.35, 760);
    const pageWidth = Math.min(availableWidth / 2, 520, pageHeight / 1.414);

    return { width: Math.max(pageWidth, 220), height: Math.max(pageHeight, 300) };
  }, [containerSize, isMobile]);

  const dims = pageDimensions();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!flipbookRef.current) return;
      if (e.key === 'ArrowLeft') flipbookRef.current.flipPrev();
      else if (e.key === 'ArrowRight') flipbookRef.current.flipNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handler);
    return () => document.removeEventListener('fullscreenchange', handler);
  }, []);

  useEffect(() => {
    if (renderedRef.current) return;
    renderedRef.current = true;

    const renderPdf = async () => {
      try {
        onLoadingProgress(0, 1);

        pdfjsLib.GlobalWorkerOptions.workerSrc =
          'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.8.69/pdf.worker.mjs';

        const loadingTask = pdfjsLib.getDocument(pdfUrl);
        const pdf: PDFDocumentProxy = await loadingTask.promise;
        const numPages = pdf.numPages;
        setTotalPages(numPages);

        const images: string[] = [];
        const scale = Math.max(dims.width / 320, 1.4);

        for (let i = 1; i <= numPages; i++) {
          onLoadingProgress(i, numPages);
          const page: PDFPageProxy = await pdf.getPage(i);
          const viewport = page.getViewport({ scale });

          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          if (!ctx) continue;

          canvas.width = viewport.width;
          canvas.height = viewport.height;

          await page.render({ canvasContext: ctx, viewport }).promise;
          images.push(canvas.toDataURL('image/png', 0.92));
          page.cleanup();
        }

        setPageImages(images);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Unknown error loading PDF';
        onError(message);
        renderedRef.current = false;
      }
    };

    renderPdf();
  }, [pdfUrl, onError, onLoadingProgress, dims.width]);

  useEffect(() => {
    if (pageImages.length === 0 || !containerRef.current) return;

    if (flipbookRef.current) {
      flipbookRef.current.destroy();
      flipbookRef.current = null;
    }

    containerRef.current.innerHTML = '';

    const pageElements: HTMLElement[] = [];
    pageImages.forEach((src, index) => {
      const pageDiv = document.createElement('div');
      pageDiv.className = 'page';
      pageDiv.dataset.density = index === 0 || index === pageImages.length - 1 ? 'hard' : 'soft';

      const img = document.createElement('img');
      img.src = src;
      img.style.width = '100%';
      img.style.height = '100%';
      img.style.objectFit = 'contain';
      img.style.display = 'block';
      img.alt = `Page ${index + 1}`;
      img.draggable = false;

      pageDiv.appendChild(img);
      containerRef.current!.appendChild(pageDiv);
      pageElements.push(pageDiv);
    });

    const flipbook = new PageFlip(containerRef.current, {
      width: dims.width,
      height: dims.height,
      size: isMobile ? 'fixed' : 'stretch',
      minWidth: 200,
      maxWidth: 1100,
      minHeight: 280,
      maxHeight: 1500,
      maxShadowOpacity: 0.5,
      showCover: true,
      mobileScrollSupport: false,
      usePortrait: isMobile,
      drawShadow: true,
      flippingTime: 480,
      startPage: 0,
      swipeDistance: 20,
      clickEventForward: false,
      useMouseEvents: true,
    });

    flipbook.loadFromHTML(pageElements);

    flipbook.on('flip', (e) => {
      const data = e as { data: number };
      setCurrentPage(data.data);
    });

    flipbookRef.current = flipbook;

    return () => {
      flipbook.destroy();
      flipbookRef.current = null;
    };
  }, [pageImages, dims.width, dims.height, isMobile]);

  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  const handlePrev = () => flipbookRef.current?.flipPrev();
  const handleNext = () => flipbookRef.current?.flipNext();
  const handleJumpToPage = (page: number) => flipbookRef.current?.turnToPage(page);

  return (
    <div className="relative w-full h-full bg-gray-950 overflow-hidden flex flex-col items-center justify-center">
      <div
        style={{
          width: isMobile ? dims.width : dims.width * 2,
          height: dims.height,
        }}
      >
        <div ref={containerRef} className="flipbook-container" />
      </div>

      {totalPages > 0 && (
        <Controls
          currentPage={currentPage}
          totalPages={totalPages}
          isFullscreen={isFullscreen}
          pdfUrl={rawPdfUrl}
          onPrev={handlePrev}
          onNext={handleNext}
          onToggleFullscreen={handleToggleFullscreen}
          onJumpToPage={handleJumpToPage}
        />
      )}
    </div>
  );
}
