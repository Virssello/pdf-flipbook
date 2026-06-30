# PDF Flipbook Viewer

Minimal 3D PDF flipbook. Renders a PDF with realistic page-turn animation.

## Usage

```
https://YOUR_USERNAME.github.io/pdf-flipbook/?pdf=https://example.com/file.pdf
```

With a custom CORS proxy:

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
3. Under **Build and deployment**:
   - Source: **Deploy from a branch**
   - Branch: **main**
   - Folder: **/(root)**
4. Click **Save**.
5. Wait ~1 minute, then visit `https://YOUR_USERNAME.github.io/pdf-flipbook/`.

The root `index.html` is the production build and works with the default Pages setting.

### Alternative: /docs folder

If you prefer, you can also set the folder to `/docs`. Both contain the same built file.

### Alternative: GitHub Actions

Select **GitHub Actions** as the Pages source and trigger the workflow in the **Actions** tab.

## Edupage embed (bypasses CORS)

For Edupage PDFs, paste the single-file HTML directly into Edupage's HTML dialog.

Build it for your PDF:

```bash
PDF_URL="https://cloud-3.edupage.org/cloud/..." npm run build:edupage
```

Then use `embed/edupage-flipbook.html`.

## Local development

```bash
npm install
npm run dev
```

The dev server opens `dev.html`.

Build:

```bash
npm run build
```

Build a single-file Edupage embed:

```bash
PDF_URL="https://example.com/file.pdf" npm run build:edupage
```

## CORS note

Edupage PDFs send `Access-Control-Allow-Origin: https://olaszkola.edupage.org`. The GitHub Pages version cannot fetch them directly because of browser CORS rules. Use the Edupage paste-in HTML file for those PDFs.
