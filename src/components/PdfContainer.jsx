import { createElement, useEffect, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
import "../ui/PDFPreview.css";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export function PdfContainer({ file }) {
    const [numPages, setNumPages] = useState(null);
    const [pdfUrl, setPdfUrl] = useState(null);
    const [pageWidth, setPageWidth] = useState(null);
    const containerRef = useRef(null);
    const debounceTimerRef = useRef(null);

    useEffect(() => {
        if (file?.value?.uri) {
            setPdfUrl(file.value.uri);
        } else {
            setPdfUrl(null);
        }
    }, [file]);

    useEffect(() => {
        const updatePageWidth = () => {
            if (containerRef.current) {
                const containerWidth = containerRef.current.clientWidth;
                setPageWidth(containerWidth);
            }
        };

        const debouncedUpdatePageWidth = () => {
            if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current);
            }
            debounceTimerRef.current = setTimeout(updatePageWidth, 100);
        };

        updatePageWidth(); // Initial call
        window.addEventListener('resize', debouncedUpdatePageWidth);
        
        return () => {
            window.removeEventListener('resize', debouncedUpdatePageWidth);
            if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current);
            }
        };
    }, []);

    function onDocumentLoadSuccess({ numPages: totalPages }) {
        setNumPages(totalPages);
    }

    return (
        <div className="pdf-container" ref={containerRef}>
            {pdfUrl && pageWidth && (
                <Document file={pdfUrl} onLoadSuccess={onDocumentLoadSuccess} error={<div>Error loading PDF!</div>}>
                    {Array.from(new Array(numPages), (el, index) => (
                        <Page 
                            key={`page_${index + 1}`} 
                            pageNumber={index + 1} 
                            width={pageWidth}
                            renderTextLayer={true} 
                            renderAnnotationLayer={true}
                        />
                    ))}
                </Document>
            )}
        </div>
    );
}
