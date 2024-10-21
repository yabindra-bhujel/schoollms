import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import instance from "../../api/axios";
import { useTranslation } from "react-i18next";
import './style/CourseContent.css';

const CourseContent = () => {
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
      const endpoint = `subject_materiales/${id}/`;
      const response = await instance.get(endpoint);
      setFiles(response.data);
    } catch (error) {
      setError("An error occurred while fetching data.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="course-content-container">
      <div className="student-course-content-header">
        <h4>{t("studentAssigemnt.materiales")}</h4>
        <div></div>
      </div>

      {loading ? (
        <div className="loading-container">
          <div className="spinner"></div>
        </div>
      ) : error ? (
        <div className="error-container">
          <p className="error-text">{error}</p>
          <button className="retry-button" onClick={getFile}>{t('Retry')}</button>
        </div>
      ) : (
        <div className="files-container">
          {files.length > 0 && files.map((courseMaterial, index) => (
            <div key={index} className="file-item">
              <a href={courseMaterial.pdf_file} download className="download-link">
                <span className="download-icon">&#x1F4E5;</span> 
              </a>
              <span className="file-name">{courseMaterial.pdf_file.split("/").pop().replace(/_/g, '')}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CourseContent;
