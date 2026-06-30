#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const pdfUrl = process.env.PDF_URL;

if (!pdfUrl) {
  console.error('Error: Set the PDF_URL environment variable.');
  console.error('Example: PDF_URL="https://example.com/file.pdf" node scripts/build-edupage.js');
  process.exit(1);
}

const inputPath = path.resolve(__dirname, '../dist/index.html');
const outputPath = path.resolve(__dirname, '../dist/edupage-flipbook.html');

if (!fs.existsSync(inputPath)) {
  console.error('Error: dist/index.html not found. Run "npm run build" first.');
  process.exit(1);
}

let html = fs.readFileSync(inputPath, 'utf-8');
const escapedUrl = JSON.stringify(pdfUrl);
const injection = `<script>window.PDF_FLIPBOOK_URL=${escapedUrl};</script>`;

if (!html.includes('</head>')) {
  console.error('Error: Could not find </head> tag in dist/index.html.');
  process.exit(1);
}

html = html.replace('</head>', `${injection}</head>`);

fs.writeFileSync(outputPath, html);
console.log(`Created: ${outputPath}`);
console.log(`PDF URL: ${pdfUrl}`);
