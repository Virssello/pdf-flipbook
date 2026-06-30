# PDF Flipbook Viewer

Minimal embeddable PDF flipbook. Pass any PDF URL via `?pdf=` and it renders as a 3D book.

## Usage

```
https://YOUR_USERNAME.github.io/pdf-flipbook/?pdf=https://example.com/file.pdf
```

With a custom CORS proxy (needed if the PDF server blocks cross-origin requests):

```
https://YOUR_USERNAME.github.io/pdf-flipbook/?pdf=https://example.com/file.pdf&proxy=https://your-proxy.com/?url=
```

## Embed as iframe

```html
<iframe
  width="100%"
  height="700"
  src="https://YOUR_USERNAME.github.io/pdf-flipbook/?pdf=YOUR_PDF_URL"
  frameborder="0"
  allowfullscreen>
</iframe>
```

## Deploy to GitHub Pages

1. Push this repo to GitHub.
2. Go to **Settings → Pages**.
3. Select **GitHub Actions** as the source.
4. The workflow in `.github/workflows/deploy.yml` deploys automatically on every push to `main`.

## Important: CORS

This viewer runs entirely in the browser. If the PDF server does not send `Access-Control-Allow-Origin: *` (or your GitHub Pages domain), the browser will block the download.

Options if you see a CORS error:

- Host the flipbook on the same domain as the PDF.
- Add your GitHub Pages domain to the PDF server's CORS allowlist.
- Use a CORS proxy you control and pass it via `?proxy=`.

## Local development

```bash
npm install
npm run dev
```

Build:

```bash
npm run build
```
