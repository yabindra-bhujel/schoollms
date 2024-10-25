import React, {useRef, useState, useEffect} from "react";
import "./style/AssigmentDetalis.css";
import { FiPlusCircle } from "react-icons/fi";
import { AiFillFilePdf } from "react-icons/ai";
import { IoMdRemoveCircleOutline } from "react-icons/io";
import { useTranslation } from "react-i18next";
import getUserInfo from "../../api/user/userdata";
import instance from "../../api/axios";
import { useParams } from "react-router-dom";

const FileSubmission = (

    isDeadlinePassed
) => {
    const userid = getUserInfo();
    const user = userid.username;
    const { t } = useTranslation();
    const [file, setFile] = useState([]);
    const fileInputRef = useRef(null);
    const { assignmentId, courseId } = useParams();
    const [fileUploadMessage, setFileUploadMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState("");



  const handleFileButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const selectedFiles = event.target.files;

    const validFiles = Array.from(selectedFiles).filter(
      (file) => file.size <= 10 * 1024 * 1024
    );

    if (validFiles.length > 0) {
      setFile((prevFiles) => [...prevFiles, ...validFiles]);
      setFileUploadMessage("");
    } else {
      setFileUploadMessage(t("studentAssigemnt.fileerror"));
      setTimeout(() => {
        setFileUploadMessage("");
      }, 2000);
    }
  };

  const handleFileDelete = (indexToDelete) => {
    setFile((prevFiles) =>
      prevFiles.filter((_, index) => index !== indexToDelete)
    );
  };

  const makeFileSubmission = async () => {
    try {
      const formData = new FormData();
      formData.append("student", user);
      formData.append("assignment_id", assignmentId);
      file.forEach((file) => {
        formData.append("file_submission", file);
      });
      const endpoint = `assignments/create-file-assignment/`;
      setIsLoading(true);
      const response = await instance.post(endpoint, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (response.status === 201) {
        window.history.back();
      }
    } catch (e) {
      setMessage("リクエスト失敗しました。しばらくしてからもう一度お試しください。");
      setOpen(true);
      setTimeout(() => {
        setOpen(false);
        setMessage("");
      }, 3000);
    } finally {
      setIsLoading(false);
    }

  };

  return (
    <div>
      <div className="file-attagement">
        {!isDeadlinePassed && (
          <>
            <button className="button" onClick={handleFileButtonClick}>
              <FiPlusCircle className="add-btn" />
              <span>{t("studentAssigemnt.drag")}</span>
              <span>{t("studentAssigemnt.maxFile")}</span>
            </button>
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={handleFileChange}
              multiple
            />
          </>
        )}

        <div className="file-items">
          {file.length > 0 && (
            <ul className="file-list">
              {file.map((file, index) => (
                <li key={index}>
                  <div className="fielname-size">
                    <AiFillFilePdf className="file-icon" />
                    <p>
                      {" "}
                      {file.name} <br />
                      <span>
                        {file && file.size
                          ? (file.size / (1024 * 1024)).toFixed(2)
                          : 0}{" "}
                        MB
                      </span>
                    </p>
                  </div>

                  <button>
                    <IoMdRemoveCircleOutline
                      onClick={() => handleFileDelete(index)}
                      className="btn-icon"
                    />
                  </button>
                </li>
              ))}
            </ul>
          )}
          <p className="fileerror">{fileUploadMessage}</p>
        </div>
      </div>
      <div className="file-bottom-button">
        {!isDeadlinePassed && (
          <button
            className={`submit-file`}
            // disabled={isInputEmpty()}
            onClick={makeFileSubmission}
          >
            <span>提出</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default FileSubmission;
