import React, { useEffect, useState } from "react";
import "./style/coursecontant.css";
import { useParams } from "react-router-dom";
import instance from "../../api/axios";
import { useTranslation } from "react-i18next";
import { AiOutlineEye } from "react-icons/ai";
import { FaTrash } from "react-icons/fa6";
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';




const CourseContant = ({fetchData}) => {
  const params = useParams();
  const subject_code = params.subject_code;
  const [file, setFile] = useState([]);
  const { t } = useTranslation();
  const [fileDeleteMessage, setFileDeleteMessage] = useState("")

  useEffect(() => {
    const response = fetchData();
    response.then((res) => {
      setFile(res);
    });
  }, []);


  useEffect(() => {
    getData()

  }, []);

  const getData = async() =>{
    try{
      const response = await fetchData()
      setFile(response)
    }
    catch{
      console.log("error")
      }
  }
  



   // Function to extract file name from URL
   const getFileNameFromURL = (url) => {
    const parts = url.split("/");
    return parts[parts.length - 1];
  };



  const deleteFile = async(fileID) =>{
    try{
      const endpoint = `/course/delete_file/${fileID}/`;
      console.log(endpoint)
      const response = await instance.delete(endpoint);
      if(response.status === 200){
        setFileDeleteMessage("File deleted successfully")
        setTimeout(()=>{setFileDeleteMessage("")},5000)
        getData();
      }else{
        console.log("something wrong")
      }
    }catch{
      console.log("error");
    }
  }



  return (
    <div className="course-materials">
      <div className="course-contant-header">
        <h2>授業材料</h2>
      </div>
      <section className="materialse-body">
      {fileDeleteMessage && <Stack sx={{ width: '100%' }} spacing={2}>
        <Alert severity="success">{fileDeleteMessage}</Alert>
      </Stack>}
      
      {file.map((courseMaterial) => (
        <div className="course-contant-body" key={courseMaterial.id}>
          
          <div className="file-name">
          <FaTrash className="delete-icons"  onClick={()=>deleteFile(courseMaterial.id)}/>
            <p>{getFileNameFromURL(courseMaterial.pdf_file)}</p>
          </div>
          <div className="download-button">
            <a href={courseMaterial.pdf_file} download>
              <AiOutlineEye  className="view-icons"/>
            </a>
          </div>
        </div>
      ))}

      </section>
    </div>
  );
};
export default CourseContant;
