# PDF Flipbook Viewer

Minimal 3D PDF flipbook. Renders a PDF with realistic page-turn animation.

## Two ways to use it

### Option A — Paste into Edupage (recommended, no CORS issues)

The app can be built as a single self-contained HTML file. Paste it directly into Edupage's **Wstaw kod HTML** dialog. Because it runs on the Edupage origin, it can fetch Edupage PDFs without CORS problems.

1. Build the edupage-ready file for your PDF:

```bash
PDF_URL="https://cloud-3.edupage.org/cloud/1_Bujak.pdf?z=..." npm run build:edupage
```

2. Open `embed/edupage-flipbook.html` (or `dist/edupage-flipbook.html`), copy the entire content, and paste it into Edupage.

The generated file already has your PDF URL hardcoded.

### Option B — Host on GitHub Pages and embed via iframe

```
https://YOUR_USERNAME.github.io/pdf-flipbook/?pdf=https://example.com/file.pdf
```

```html
<iframe
  width="100%"
  height="700"
  src="https://YOUR_USERNAME.github.io/pdf-flipbook/?pdf=YOUR_PDF_URL"
  frameborder="0"
  allowfullscreen>
</iframe>
```

This only works if the PDF server allows cross-origin requests. Edupage PDFs currently block this.

## Deploy to GitHub Pages

1. Push this repo to GitHub.
2. Go to **Settings → Pages**.
3. Under **Build and deployment**, select **GitHub Actions** as the source.
4. Push any change to `main` (or trigger the workflow manually from the **Actions** tab).
5. Wait ~1–2 minutes, then visit `https://YOUR_USERNAME.github.io/pdf-flipbook/`.

If you see a 404 or the page tries to load `/src/main.tsx`, it means Pages is still set to "Deploy from a branch" instead of GitHub Actions. Change the source to GitHub Actions.

## CORS note

Edupage PDFs send:

```http
Access-Control-Allow-Origin: https://olaszkola.edupage.org
```

Because the GitHub Pages version runs on `virssello.github.io`, the browser blocks the PDF download. Either paste the single-file HTML into Edupage (Option A) or ask your Edupage admin to add your GitHub Pages domain to the CORS allowlist.

## Local development

```bash
npm install
npm run dev
```

Build:

```bash
npm run build
```

Build a single-file Edupage embed:

```bash
PDF_URL="https://example.com/file.pdf" npm run build:edupage
```
