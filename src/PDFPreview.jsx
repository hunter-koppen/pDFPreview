import { createElement } from "react";

import { PdfContainer } from "./components/PdfContainer";
import "./ui/PDFPreview.css";

export function PDFPreview({ file }) {
    return <PdfContainer file={file} />;
}
