import React, { useState, useEffect, useRef } from "react";
import "./style/filelist.css";
import { FiMoreVertical } from "react-icons/fi";
import {
  BsFillFileEarmarkPdfFill,
  BsFileEarmarkCodeFill,
  BsImage,
  BsFillCameraVideoFill,
  BsFiletypeDocx,
  BsFiletypeXls,
  BsCloudArrowUpFill,
} from "react-icons/bs";
import PDFViewer from "./viwer/pdf";
import Modal from "react-modal";
import instance from "../../api/axios";
import getUserInfo from "../../api/user/userdata";
import { CiCircleRemove } from "react-icons/ci";



Modal.setAppElement("#root");

const FileList = ({ selectedFolder }) => {
  const [files, setFiles] = useState([]);
  const [fileViewerIsOpen, setFileViewerIsOpen] = useState(false);
  const [selectedFileContent, setSelectedFileContent] = useState(null);
  const [fileuploadPopup, setFileuploadPopup] = useState(false);
  const foldername = selectedFolder.name;

  const openFileUpload = () => {
    setFileuploadPopup(true);
  };
  const closeFileUpload = () => {
    setFileuploadPopup(false);
  };

  const openFileViewer = (content) => {
    setSelectedFileContent(content);
    setFileViewerIsOpen(true);
  };

  const closeFileViewer = () => {
    setFileViewerIsOpen(false);
  };

  useEffect(() => {
    if (selectedFolder && selectedFolder.files) {
      // Map the selectedFolder.files to files array with required properties
      const filesData = selectedFolder.files.map((file) => ({
        id: file.id,
        size: file.size,
        date_created: file.date_created,
        user: file.user,
        folder: file.folder,
        formatted_size: file.formatted_size,
        file: file.file, // Assuming your API provides a pdf_file property
        // Extract other file attributes as needed
      }));

      setFiles(filesData);
    }
  }, [selectedFolder]);

  const getFileType = (fileName) => {
    const extension = fileName.split(".").pop().toLowerCase();

    if (extension === "pdf") {
      return <BsFillFileEarmarkPdfFill />;
    } else if (["py", "python"].includes(extension)) {
      return <BsFileEarmarkCodeFill />;
    } else {
      return <BsFiletypeDocx />;
    }
  };

  function isPDF(fileContent) {
    // You may need to adjust this logic based on your specific requirements
    // For simplicity, this checks if the file content contains the string "pdf"
    return fileContent.toLowerCase().includes("pdf");
  }
  

  return (
    <>
     {/* File upload popup */}
     <Modal
          isOpen={fileuploadPopup}
          onRequestClose={closeFileUpload}
          className="file__upload__modal"
          shouldCloseOverlayClick= {false}
        >
          <div className="file__upload__model_content">
            <Upload_File
            // get_files = {getFolderFile}
             cancle_btn={closeFileUpload} 
             foldername={foldername}
             />
          </div>
        </Modal>


      {/* File viewer popup */}
      <Modal
        isOpen={fileViewerIsOpen}
        onRequestClose={closeFileViewer}
        className="file-modal_viewer"
        shouldCloseOnOverlayClick={false}
      >
       <div className="modal__content_viewer">
  {selectedFileContent && (
    <div>
      {isPDF(selectedFileContent) ? (
        <PDFViewer pdfContent={selectedFileContent} closeFileViewer={closeFileViewer} />
      ) : (
        <iframe
          src={`https://view.officeapps.live.com/op/embed.aspx?src=${selectedFileContent}`}
          width="100%"
          height="565px"
          frameBorder="0"
        ></iframe>
      )}
    </div>
  )}
</div>

      </Modal>

      <div className="file_manager_folder_list">
        <div className="file_list_header">
          <div className="header_text">
            <p>{selectedFolder.name}</p>
          </div>
          <div className="sorted__by">
            <div className="add__file">
              <button onClick={openFileUpload}>
                <span>Add File</span>
              </button>
            </div>
            <p>Sort by:</p>
            <select>
              <option value="name">Name</option>
              <option value="date">Date</option>
              <option value="size">Size</option>
            </select>
          </div>
        </div>

        <div className="file_list_body">
          <div className="search__bar">
            <input type="text" placeholder="Type to search." />
          </div>
          <div className="file_list_container">
            {files.map((item, index) => (
              <div className="file_list_body_item" key={index}>
                <button
                  onClick={() => openFileViewer(item.file)}
                >
                  <div className="file_list_body_item_left">
                    <div className="file_list_body_item_left_icon">
                      {item.fileType}
                    </div>
                    <div className="file_list_body_item_left_text">
                      <p>{item.file.split("/").pop()}</p>
                      <span>
                        {item.formatted_size} {item.date_created}
                      </span>
                    </div>
                  </div>
                </button>
                <div className="file_list_body_item_right">
                  <FiMoreVertical />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default FileList;


const Upload_File = ({ cancle_btn , foldername }) => {

  const fileInputRef = useRef(null);
  const [file, setFile] = useState([]);
  const userdata = getUserInfo();
  const userid = userdata.user_id;

  const handleFileButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const newFiles = e.target.files;
    setFile((prevFiles) => [...prevFiles, ...Array.from(newFiles)]);
  };


  const handleFileUplaod = async() =>{
    const formData = new FormData();
    formData.append("folder", foldername);
    formData.append("user_id", userid)
    file.forEach((file) => {
      formData.append("file", file);
      formData.append("filesize", file.size)
    });
    try{
      const endpoint = "/file_manager/upload_files/";
      const res = await instance.post(endpoint, formData,{
        headers: {
          'Content-Type': 'multipart/form-data', // Set the content type to multipart/form-data
        },
      });
      console.log(res.data);
      cancle_btn()

    }catch(e){
      console.log(e);
    }
  }


  const handleFileDelete = (indexTODelete) =>{
    setFile((prevFiles) => 
    prevFiles.filter((_, index) => index !== indexTODelete));
  }

  const formatFileSize = (bytes) => {
    if (bytes < 1024) {
      return bytes + " bytes";
    } else if (bytes < 1024 * 1024) {
      return (bytes / 1024).toFixed(2) + " KB";
    } else if (bytes < 1024 * 1024 * 1024) {
      return (bytes / (1024 * 1024)).toFixed(2) + " MB";
    } else {
      return (bytes / (1024 * 1024 * 1024)).toFixed(2) + " GB";
    }
  };

  
  

  return (
    <>
      <div className="file__upload__modal__header">
      </div>

      <div className="file__upload_btn">
        <button className="click__btn" onClick={handleFileButtonClick}>
          <BsCloudArrowUpFill className="cloud-btn" />
        </button>
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={handleFileChange}
          multiple
        />
        <p>Drag and drop files here or Click to upload</p>
        <span>Max file size 1GB</span>
      </div>

      <div className="uploaded__file_list">
        <div className="uploaded__file">
          <ul>
            {file.map((file, index) => (
              <li key={index}>

               
                <p> {file.name}</p>
                <span>{formatFileSize(file.size)}</span>
                <button>
                  <CiCircleRemove 
                  onClick={() => handleFileDelete(index)}
                  className="btn-icon" />
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="cancle__upload-btn">
        <button onClick={cancle_btn} className="cancle">
          Cancle
        </button>
        <button 
        onClick={handleFileUplaod}
        className="upload">Upload</button>
      </div>
    </>
  );
};

