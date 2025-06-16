import { createElement } from "react";
import { useState, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export function PdfContainer({ file }) {
    const [numPages, setNumPages] = useState(null);
    const [pdfUrl, setPdfUrl] = useState(null);

    useEffect(() => {
        if (file?.value?.uri) {
            setPdfUrl(file.value.uri);
        }
    }, [file]);

    function onDocumentLoadSuccess({ numPages }) {
        setNumPages(numPages);
    }

    return (
        <div className="pdf-container">
            {pdfUrl && (
                <Document
                    file={pdfUrl}
                    onLoadSuccess={onDocumentLoadSuccess}
                    loading={<div>Loading PDF...</div>}
                    error={<div>Error loading PDF!</div>}
                >
                    {Array.from(new Array(numPages), (el, index) => (
                        <Page
                            key={`page_${index + 1}`}
                            pageNumber={index + 1}
                            renderTextLayer={true}
                            renderAnnotationLayer={true}
                        />
                    ))}
                </Document>
            )}
        </div>
    );
}
