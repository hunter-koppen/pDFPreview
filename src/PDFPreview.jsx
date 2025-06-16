import { createElement } from "react";

import { HelloWorldSample } from "./components/HelloWorldSample";
import "./ui/PDFPreview.css";

export function PDFPreview({ sampleText }) {
    return <HelloWorldSample sampleText={sampleText} />;
}
