import React from "react";

const XLSViewer = ({ fileContent }) => {
    return (
        <div>
      <iframe
        title="Excel Viewer"
        src={`https://docs.google.com/viewer?embedded=true&url=${encodeURIComponent(
            fileContent
        )}`}
        width="100%"
        height="600"
      ></iframe>
    </div>
    );
    }
    export default XLSViewer;