import * as pdfjsLib from 'pdfjs-dist';

// Configure the worker source from cdnjs matching pdfjs-dist
if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version || '4.10.38'}/pdf.worker.min.mjs`;
}

export interface RenderedPdfPage {
  pageNumber: number;
  imageUrl: string;
  extractedText: string;
}

export async function renderPdfToPages(file: File): Promise<RenderedPdfPage[]> {
  const arrayBuffer = await file.arrayBuffer();
  const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
  const pdf = await loadingTask.promise;
  const numPages = Math.min(pdf.numPages, 10); // Safe limit to prevent memory exhaustion
  const results: RenderedPdfPage[] = [];

  for (let i = 1; i <= numPages; i++) {
    const page = await pdf.getPage(i);
    const viewport = page.getViewport({ scale: 1.5 });
    const canvas = document.createElement('canvas');
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    const context = canvas.getContext('2d');

    if (context) {
      await page.render({ canvasContext: context, viewport, canvas } as any).promise;
      const imageUrl = canvas.toDataURL('image/jpeg', 0.85);

      // Extract text content
      let extractedText = '';
      try {
        const textContent = await page.getTextContent();
        extractedText = textContent.items
          .map((item: any) => item.str || '')
          .join(' ')
          .replace(/\s+/g, ' ')
          .trim();
      } catch (err) {
        console.warn('Text extraction from PDF page failed:', err);
      }

      results.push({
        pageNumber: i,
        imageUrl,
        extractedText,
      });
    }
  }

  return results;
}
