import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import instance from "../../api/axios";
import { useTranslation } from "react-i18next";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import IconButton from "@mui/material/IconButton";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";

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
    <div>
      <Typography variant="h4" gutterBottom>
        {t("studentAssigemnt.materiales")}
      </Typography>
      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "200px" }}>
          <CircularProgress />
        </div>
      ) : error ? (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: "16px" }}>
          <Typography variant="body1" color="error" gutterBottom>
            {error}
          </Typography>
          <Button variant="contained" color="primary" onClick={getFile} style={{ marginTop: "8px" }}>
            Retry
          </Button>
        </div>
      ) : (
        <div>
           {files.length > 0 && files.map((courseMaterial, index) => (

            <div key={index} style={{ display: "flex", alignItems: "center", marginBottom: "8px", background: "rgb(223, 227, 230)", padding: "10px", borderRadius: "5px" }}>
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
                {courseMaterial.pdf_file.split("/").pop().replace(/_/g, '')}
              </Typography>

            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CourseContent;
