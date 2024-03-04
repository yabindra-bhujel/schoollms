import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import instance from "../../api/axios";
import { useTranslation } from "react-i18next";
import { AiOutlineEye } from "react-icons/ai";
import { FaTrash } from "react-icons/fa6";
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';

const CourseContant = ({ fetchData }) => {
  const params = useParams();
  const subject_code = params.subject_code;
  const [file, setFile] = useState([]);
  const { t } = useTranslation();
  const [fileDeleteMessage, setFileDeleteMessage] = useState("")

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      const response = await fetchData();
      setFile(response);
    } catch {
      console.log("error")
    }
  }

  const getFileNameFromURL = (url) => {
    const parts = url.split("/");
    return parts[parts.length - 1];
  };

  const deleteFile = async (fileID) => {
    try {
      const endpoint = `/course/delete_file/${fileID}/`;
      console.log(endpoint)
      const response = await instance.delete(endpoint);
      if (response.status === 200) {
        setFileDeleteMessage("File deleted successfully")
        setTimeout(() => { setFileDeleteMessage("") }, 5000)
        getData();
      } else {
        console.log("something wrong")
      }
    } catch {
      console.log("error");
    }
  }

  return (
    <Paper style={{ padding: "16px", marginBottom: "16px" }}>
      <Typography variant="h5" gutterBottom>授業材料</Typography>
      {fileDeleteMessage && 
        <Stack sx={{ width: '100%' }} spacing={2}>
          <Alert severity="success">{fileDeleteMessage}</Alert>
        </Stack>
      }
      {file.map((courseMaterial) => (
        <div key={courseMaterial.id} style={{ display: "flex", alignItems: "center", marginBottom: "8px" }}>
          <FaTrash 
            style={{ marginRight: "8px", cursor: "pointer" }}
            onClick={() => deleteFile(courseMaterial.id)}
          />
          <Typography>{getFileNameFromURL(courseMaterial.pdf_file)}</Typography>
          <div style={{ marginLeft: "auto" }}>
            <Button variant="text">
              <a href={courseMaterial.pdf_file} download>
                <AiOutlineEye size={30}/>
              </a>
            </Button>
          </div>
        </div>
      ))}
    </Paper>
  );
};

export default CourseContant;
