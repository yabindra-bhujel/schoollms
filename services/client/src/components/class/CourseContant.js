import React, { useEffect, useState } from "react";
import instance from "../../api/axios";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import DeleteIcon from "@mui/icons-material/Delete";
import { useParams } from "react-router-dom";
import { Dialog, DialogContent } from "@mui/material";
import UploadPDF from "./uploadPDF";
import "./style/FileList.css";
import { IoMdCloudUpload } from "react-icons/io";


const CourseContant = ({ setOpen, setMessage, fetchData }) => {
  const [file, setFile] = useState([]);
  const params = useParams();
  const subject_code = params.subject_code;
  const [isPDFModelOpen, setIsPDFModelOpen] = useState(false);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      const endpoint = `subject_materiales/${subject_code}/`;
      const response = await instance.get(endpoint);
      setFile(response.data);
    } catch {
      setMessage("データの取得中にエラーが発生しました");
      setOpen(true);
      setTimeout(() => {
        setOpen(false);
      }, 3000);
    }
  };

  const deleteFile = async (fileID) => {
    try {
      const endpoint = `subject_materiales/delete/${fileID}/`;
      const response = await instance.delete(endpoint);
      if (response.status === 204) {
        setMessage("ファイルが正常に削除されました。");
        getData();
      } else {
        throw new Error("ファイルの削除中にエラーが発生しました");
      }
    } catch (error) {
      setMessage(error.message);
      setOpen(true);
    }
  };

  const closePDFModel = () => {
    setIsPDFModelOpen(false);
  };

  const openPDFModel = () => {
    setIsPDFModelOpen(true);
  };

  return (
    <>
      <Dialog open={isPDFModelOpen} onClose={closePDFModel}>
        <DialogContent>
          <UploadPDF closePDFModel={closePDFModel} fetchData={fetchData} />
        </DialogContent>
      </Dialog>

      <div className="class-details-header">
        <p>
          授業材料
        </p>
        <button onClick={openPDFModel}>
          <IoMdCloudUpload size={40} className="file-upload-icon"/>
        </button>
      </div>

      <Paper style={{ padding: "16px", marginBottom: "16px" }}>
        {file.length > 0 &&
          file.map((courseMaterial, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "8px",
                background: "rgb(223, 227, 230)",
                padding: "10px",
                borderRadius: "5px",
              }}
            >
              <IconButton
                variant="contained"
                color="primary"
                component="a"
                target="_blank"
                style={{ marginRight: "8px" }}
                onClick={() => deleteFile(courseMaterial.id)}
              >
                <DeleteIcon />
              </IconButton>
              <IconButton
                variant="contained"
                color="primary"
                component="a"
                href={courseMaterial.pdf_file}
                download
                style={{ marginRight: "8px" }}
              >
                <CloudDownloadIcon />
              </IconButton>

              <Typography style={{ marginRight: "8px" }}>
                {courseMaterial.pdf_file.split("/").pop().replace(/_/g, "")}
              </Typography>
            </div>
          ))}
      </Paper>
    </>
  );
};

export default CourseContant;
