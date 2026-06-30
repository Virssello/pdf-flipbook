declare module 'page-flip' {
  export type SizeType = 'fixed' | 'stretch';
  export type FlipCorner = 'top' | 'bottom';

  export interface PageFlipSettings {
    width: number;
    height: number;
    size?: SizeType;
    minWidth?: number;
    maxWidth?: number;
    minHeight?: number;
    maxHeight?: number;
    maxShadowOpacity?: number;
    showCover?: boolean;
    mobileScrollSupport?: boolean;
    usePortrait?: boolean;
    drawShadow?: boolean;
    flippingTime?: number;
    startPage?: number;
    startZIndex?: number;
    autoSize?: boolean;
    swipeDistance?: number;
    clickEventForward?: boolean;
    useMouseEvents?: boolean;
    disableFlipByClick?: boolean;
  }

  export interface FlipEventData {
    data: number;
  }

  export class PageFlip {
    constructor(element: HTMLElement, settings: PageFlipSettings);
    loadFromHTML(elements: HTMLElement[]): void;
    loadFromImages(images: string[]): void;
    turnToPage(page: number): void;
    flipPrev(): void;
    flipNext(): void;
    flip(page: number, corner?: FlipCorner): void;
    getPageCount(): number;
    getCurrentPageIndex(): number;
    destroy(): void;
    update(): void;
    on(event: 'flip', callback: (e: FlipEventData) => void): void;
    on(event: string, callback: (e: unknown) => void): void;
    off(event: string, callback: (e: unknown) => void): void;
  }
}
