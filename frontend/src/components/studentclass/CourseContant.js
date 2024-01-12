import React, { useEffect, useState } from "react";
import "./style/coursecontant.css";
import { AiOutlineDownload } from "react-icons/ai";
import { useParams } from "react-router-dom";
import instance from "../../api/axios";
import { useTranslation } from "react-i18next";

const FileItem = ({ file }) => {
  // Function to extract file name from URL
  const getFileNameFromURL = (url) => {
    const parts = url.split("/");
    return parts[parts.length - 1];
  };

  return (
    <div className="course-contant-body" key={file.id}>
      <div className="file-name">
        <p>{getFileNameFromURL(file.pdf_file)}</p>
      </div>
      <div className="download-button">
        <a href={file.pdf_file} download>
          <AiOutlineDownload />
        </a>
      </div>
    </div>
  );
};

const CourseContant = () => {
  const { id } = useParams();
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { t } = useTranslation();

  useEffect(() => {
    getFile();
  }, []);

  const getFile = async () => {
    try {
      const endpoint = `/course/${id}/`;
      const response = await instance.get(endpoint);

      if (response.data[0] && response.data[0].course_materiales) {
        const files = response.data[0].course_materiales;
        setFiles(files);
      }
    } catch (error) {
      setError("An error occurred while fetching data.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="course-contant-header">
        <h2>{t("studentAssigemnt.materiales")}</h2>
      </div>
      <section className="materials-body">
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>{error}</p>
        ) : (
          files.map((courseMaterial) => (
            <FileItem key={courseMaterial.id} file={courseMaterial} />
          ))
        )}
      </section>
    </div>
  );
};

export default CourseContant;
