import { createElement } from "react";
import { useState, useEffect, useRef } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
import "../ui/PDFPreview.css";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export function PdfContainer({ file }) {
    const [numPages, setNumPages] = useState(null);
    const [pdfUrl, setPdfUrl] = useState(null);
    const [containerWidth, setContainerWidth] = useState(null);
    const containerRef = useRef(null);
    const debounceTimeoutRef = useRef(null);

    useEffect(() => {
        if (file?.value?.uri) {
            setPdfUrl(file.value.uri);
        } else {
            setPdfUrl(null);
        }
    }, [file]);

    useEffect(() => {
        const updateWidth = () => {
            if (containerRef.current) {
                setContainerWidth(containerRef.current.offsetWidth);
            }
        };
        const debouncedUpdateWidth = () => {
            if (debounceTimeoutRef.current) {
                clearTimeout(debounceTimeoutRef.current);
            }
            debounceTimeoutRef.current = setTimeout(updateWidth, 100);
        };
        // Initial width
        updateWidth();
        window.addEventListener("resize", debouncedUpdateWidth);
        return () => {
            window.removeEventListener("resize", debouncedUpdateWidth);
            if (debounceTimeoutRef.current) {
                clearTimeout(debounceTimeoutRef.current);
            }
        };
    }, []);

    function onDocumentLoadSuccess({ numPages }) {
        setNumPages(numPages);
    }

    return (
        <div className="pdf-container" ref={containerRef}>
            {pdfUrl && containerWidth && (
                <Document file={pdfUrl} onLoadSuccess={onDocumentLoadSuccess} error={<div>Error loading PDF!</div>}>
                    {Array.from(new Array(numPages), (el, index) => (
                        <Page
                            key={`page_${index + 1}`}
                            pageNumber={index + 1}
                            width={containerWidth}
                            renderTextLayer={true}
                            renderAnnotationLayer={true}
                        />
                    ))}
                </Document>
            )}
        </div>
    );
}
