# PDF Flipbook Viewer

A static, embeddable PDF flipbook viewer built with React, Vite, PDF.js, and `page-flip`. Host it on GitHub Pages and embed it anywhere via an `<iframe>`.

## Live usage

Load any PDF via the `?pdf=` URL parameter:

```
https://YOUR_USERNAME.github.io/pdf-flipbook/?pdf=https://example.com/document.pdf
```

For URLs with special characters, base64-encode the URL and use `?pdf_b64=`:

```
https://YOUR_USERNAME.github.io/pdf-flipbook/?pdf_b64=BASE64_ENCODED_URL
```

## Embed as iframe

Paste this into your CMS/HTML:

```html
<iframe
  width="100%"
  height="700"
  src="https://YOUR_USERNAME.github.io/pdf-flipbook/?pdf=YOUR_PDF_URL"
  title="PDF Flipbook"
  frameborder="0"
  allowfullscreen
  style="border: 1px solid #ddd; border-radius: 8px;">
</iframe>
```

## Deploy to GitHub Pages

1. Push this repo to GitHub.
2. Go to **Settings → Pages**.
3. Under **Build and deployment**, select **GitHub Actions** as the source.
4. The included workflow (`.github/workflows/deploy.yml`) will build and deploy automatically on every push to `main`.

Your site will be available at:

```
https://YOUR_USERNAME.github.io/pdf-flipbook/
```

## Local development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

Static output is written to `./dist`.

## Features

- 3D page-flip animation
- PDF loading from URL parameter or base64 URL
- CORS proxy fallback for external PDFs
- Two-page spread on desktop, single page on mobile
- Previous/Next navigation, keyboard arrow keys, page jump
- Zoom, fullscreen, and download controls
- iframe-friendly, fills the container with no body scroll
