import React from "react";
import "./style/pdf.css"


const PDFViewer = ({ pdfContent , closeFileViewer }) => {
    console.log(pdfContent)


  return (
    <div>
        <div className="pdf_header">
            <h1>PDF Viewer</h1>
            <buttton
            onClick ={closeFileViewer}
            >Close</buttton>
        </div>
        <div className="pdf_viewer">
        <iframe src={pdfContent} width="100%" height="80vh"></iframe>
        </div>
     
    </div>
  );
};

export default PDFViewer;
