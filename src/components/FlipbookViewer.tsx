import { useEffect, useRef, useState, useCallback } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { PageFlip } from 'page-flip';
import { Controls } from './Controls';

type PDFDocumentProxy = pdfjsLib.PDFDocumentProxy;
type PDFPageProxy = pdfjsLib.PDFPageProxy;

interface FlipbookViewerProps {
  pdfUrl: string;
  onError: (error: string) => void;
  onLoadingProgress: (current: number, total: number) => void;
}

export function FlipbookViewer({ pdfUrl, onError, onLoadingProgress }: FlipbookViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const flipbookRef = useRef<PageFlip | null>(null);
  const [pageImages, setPageImages] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [containerSize, setContainerSize] = useState({ width: 800, height: 600 });
  const [isMobile, setIsMobile] = useState(false);
  const renderedRef = useRef(false);

  // Detect mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Resize observer for container
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

  // Calculate page dimensions
  const pageDimensions = useCallback(() => {
    const padding = 120; // space for controls
    const availableWidth = containerSize.width - 40;
    const availableHeight = containerSize.height - padding;

    if (isMobile) {
      const pageWidth = Math.min(availableWidth, 500);
      const pageHeight = Math.min(availableHeight, pageWidth * 1.414);
      return { width: pageWidth, height: pageHeight };
    }

    // Desktop: two-page spread
    const maxPageW = 500;
    const pageHeight = Math.min(availableHeight, availableWidth / 2 * 1.3, 700);
    const pageWidth = Math.min(availableWidth / 2, maxPageW, pageHeight / 1.414);

    return { width: pageWidth, height: pageHeight };
  }, [containerSize, isMobile]);

  const dims = pageDimensions();

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!flipbookRef.current) return;
      if (e.key === 'ArrowLeft') {
        flipbookRef.current.flipPrev();
      } else if (e.key === 'ArrowRight') {
        flipbookRef.current.flipNext();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Fullscreen change listener
  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handler);
    return () => document.removeEventListener('fullscreenchange', handler);
  }, []);

  // Render PDF pages to images
  useEffect(() => {
    if (renderedRef.current) return;
    renderedRef.current = true;

    const renderPdf = async () => {
      try {
        onLoadingProgress(0, 1);

        // Set PDF.js worker
        pdfjsLib.GlobalWorkerOptions.workerSrc =
          'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.8.69/pdf.worker.min.js';

        const loadingTask = pdfjsLib.getDocument(pdfUrl);
        const pdf: PDFDocumentProxy = await loadingTask.promise;
        const numPages = pdf.numPages;
        setTotalPages(numPages);

        const images: string[] = [];
        const scale = Math.max(dims.width / 400, 1.5); // render at good resolution

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
          images.push(canvas.toDataURL('image/png', 0.9));
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

  // Initialize flipbook when images are ready
  useEffect(() => {
    if (pageImages.length === 0 || !containerRef.current) return;

    // Clean up previous instance
    if (flipbookRef.current) {
      flipbookRef.current.destroy();
      flipbookRef.current = null;
    }

    // Clear container
    containerRef.current.innerHTML = '';

    // Create page elements
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

    // Calculate dimensions
    const pageW = dims.width;
    const pageH = dims.height;

    // Create flipbook
    const flipbook = new PageFlip(containerRef.current, {
      width: pageW,
      height: pageH,
      size: isMobile ? 'fixed' : 'stretch',
      minWidth: 200,
      maxWidth: 1000,
      minHeight: 280,
      maxHeight: 1400,
      maxShadowOpacity: 0.5,
      showCover: true,
      mobileScrollSupport: false,
      usePortrait: isMobile,
      drawShadow: true,
      flippingTime: 500,
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

  // Update zoom
  const handleZoomIn = () => setZoom((z) => Math.min(z + 0.15, 3));
  const handleZoomOut = () => setZoom((z) => Math.max(z - 0.15, 0.5));

  // Fullscreen toggle
  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  // Page navigation
  const handlePrev = () => flipbookRef.current?.flipPrev();
  const handleNext = () => flipbookRef.current?.flipNext();
  const handleJumpToPage = (page: number) => {
    flipbookRef.current?.turnToPage(page);
  };

  const effectiveZoom = zoom;

  return (
    <div className="relative w-full h-full bg-gray-950 overflow-hidden flex flex-col items-center justify-center">
      {/* Flipbook container */}
      <div
        style={{
          transform: `scale(${effectiveZoom})`,
          transformOrigin: 'center center',
          transition: 'transform 0.2s ease',
        }}
      >
        <div
          ref={containerRef}
          className="flipbook-container"
          style={{
            width: isMobile ? dims.width : dims.width * 2,
            height: dims.height,
          }}
        />
      </div>

      {/* Controls */}
      {totalPages > 0 && (
        <Controls
          currentPage={currentPage}
          totalPages={totalPages}
          zoom={zoom}
          isFullscreen={isFullscreen}
          pdfUrl={pdfUrl}
          onPrev={handlePrev}
          onNext={handleNext}
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          onToggleFullscreen={handleToggleFullscreen}
          onJumpToPage={handleJumpToPage}
        />
      )}
    </div>
  );
}
