import React, { useState , useRef} from "react";
import "./style/coursecontant.css";
import instance from "../../api/axios";
import { useParams } from "react-router-dom";
import { MdCloudUpload } from "react-icons/md";
import { CiCircleRemove } from "react-icons/ci";
import { useTranslation } from "react-i18next";



const UploadPDF = ({ closePDFModel, fetchData }) => {
  const params = useParams();
  const subject_code = params.subject_code;
  const [file, setFile] = useState();
  const [fileName, setFileName] = useState();
  const [uploadedFile, setUploadedFile] = useState({});
  const fileInputRef = useRef();
  const [fileInputError, setFileInputError] = useState("")
  const { t } = useTranslation();

  // handel file input
 const handleFileInput = (e) =>{
    fileInputRef.current.click();
 }

    // handle file removal
    function handleFileRemoval() {
      setFile(null);
      setFileName(null);
      setUploadedFile(null);
    }



  async function handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData();
    formData.append("file", file);
    formData.append("subject_code", subject_code);
    try {
      const res = await instance.post("/course/get_file/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      const { fileName, filePath } = res.data;
      setUploadedFile({ fileName, filePath });
      setFileName("");
    } catch (err) {
      console.log(err);
    }
    closePDFModel();
    fetchData();

  }

  function handleChange(event) {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      const fileType = selectedFile.type;
      const validTypes = [
        "application/zip",
        "application/pdf",
        "application/vnd.ms-powerpoint",
        "text/csv",
      ];

      if (validTypes.includes(fileType)) {
        setFile(selectedFile);
        setFileName(selectedFile.name);
        setFileInputError(""); // Clear any previous error
      } else {
        setFileInputError(t("fileInput.fileUploadError"));
        setTimeout(() => {
          setFileInputError("");
        }, 3000);
      }
    }
  }

  const isValidForm = () => {
    return fileName !== "";

  };

  return (
    <div>
      <div className="form">
      <p>{t("fileInput.classRelatedFiles")}</p>
        <button className="file-input" onClick={handleFileInput}>
          <MdCloudUpload className="file-icon" />
          <span>{t("fileInput.uploadFiles")}</span>
          <span>{t("fileInput.maxFileSize")} <strong>100MB.</strong></span>



        </button >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleChange}
          style={{ display: "none" }}
        />


        {/* file list */}
        {fileName && 
        <div className="file-list">
          <li>
          <p>{fileName}</p>
          <button className="remove-btn" onClick={handleFileRemoval}>
            <CiCircleRemove   className="remove-btn"/>
          </button>

          </li>
         
        </div>


}
        
        {fileInputError &&
        <div className="error">
          <p>{fileInputError}</p>
        </div>
}
        <div className="fotter-butt">
          <button className="cancel-btn" type="button" onClick={closePDFModel}>
            {t("fileInput.cancelButton")}
          </button>
          {fileName && isValidForm() && (
            <button className="upload-btn" type="submit" onClick={handleSubmit}>
              {t("fileInput.uploadButton")}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default UploadPDF;
