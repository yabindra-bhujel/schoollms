import React, { useRef, useEffect, useState } from "react";
import Layout from "../navigations/Layout";
import "./style/folder_details.css";
import { useParams } from "react-router-dom";
import instance from "../../api/axios";
import getUserInfo from "../../api/user/userdata";


// Import icon components or classes for different file types
import { FaFilePdf, FaFileCode, FaFile } from "react-icons/fa";
import Modal from "react-modal";
import { BsCloudArrowUpFill } from "react-icons/bs";
import { CiCircleRemove } from "react-icons/ci";
Modal.setAppElement("#root");


export const Folder = () => {
  const { name } = useParams();
  const [folderName, setFolderName] = useState("");
  const [files, setFiles] = useState([]);
  const [fileuploadPopup, setFileuploadPopup] = useState(false);

  const openFileUpload = () => {
    setFileuploadPopup(true);
  };
  const closeFileUpload = () => {
    setFileuploadPopup(false);
  };

  // Function to determine file type based on the file name or extension
  const getFileType = (fileName) => {
    const extension = fileName.split(".").pop().toLowerCase();

  
    if (extension === "pdf") {
      return <FaFilePdf  />;
    } else if (["py", "python"].includes(extension)) {
      return <FaFileCode  />;
    } else {
      return <FaFile  />;
    }
  };
  

  const getFolderFile = async () => {
    try {
      const endpoint = `/file_manager/${name}`;
      const res = await instance.get(endpoint);
      setFolderName(res.data.name);
      setFiles(
        res.data.files.map((file) => ({
          ...file,
          fileName: file.file_content[0].file.split("/").pop(),
          fileType: getFileType(file.file_content[0].file), // Determine file type
        }))
      );
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    getFolderFile();
  }, []);

  return (
    <Layout>
      <div>
        {/* File upload popup */}
        <Modal
          isOpen={fileuploadPopup}
          onRequestClose={closeFileUpload}
          className="file__upload__modal"
          shouldCloseOverlayClick= {false}
        >
          <div className="file__upload__model_content">
            <Upload_File
            get_files = {getFolderFile}
             cancle_btn={closeFileUpload} 
             folderName={folderName} />
          </div>
        </Modal>
        <div className="folder__details_header">
          <div className="folder__header">
            <h1>{folderName}</h1>
          </div>
          <div className="file__search">
            <input type="text" placeholder="Search file or folder" />
          </div>
          <div className="other-btn">
            <div className="left__items">
              <p>Folder / {folderName}</p>
            </div>
            <div className="right__items">
              <button className="file__upload-btn" onClick={openFileUpload}>
                Upload
              </button>
              <button className="sub__folder__create">New Folder</button>
            </div>
          </div>
        </div>
        <div className="file__list">
          <div className="file-table">
            <table>
              <thead>
                <tr>
                  <th>
                    <input type="checkbox" />
                  </th>
                  <th>Name</th>
                  <th>Size</th>
                  <th>Modified</th>
                </tr>
              </thead>
              <tbody>
                {files.map((file) => (
                  <tr key={file.id}>
                    <td>
                      <input type="checkbox" />
                    </td>
                    <td>
                      {file.fileType} {file.fileName}
                    </td>
                    <td>{file.formatted_size}</td>
                    <td>{file.date_created}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="file-prve">
            <h1>Preview</h1>
          </div>
        </div>
      </div>
    </Layout>
  );
};

const Upload_File = ({ folderName, cancle_btn , get_files }) => {

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
    formData.append("folder", folderName);
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
      get_files()

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
        <h3>Upload to {folderName}</h3>
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
