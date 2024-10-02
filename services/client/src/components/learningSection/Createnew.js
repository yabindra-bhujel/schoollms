import React, { useState, useRef } from "react";
import instance from "../../api/axios";
import getUserInfo from "../../api/user/userdata";
import { RiVideoUploadFill } from "react-icons/ri";
import { FaImage } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import "./style/search.css";


const CreateModel = (props) => {
  const user_id = getUserInfo();
  const user = user_id.user_id;
  const { t } = useTranslation();


  const initialVideoData = {
    title: "",
    description: "",
    user: user,
  };

  const videoFileInputRef = useRef(null);
  const thumbnailFileInputRef = useRef(null);

  const [newVideo, setNewVideo] = useState(initialVideoData);
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);

  const handleVideoFileChange = (e) => {
    const file = e.target.files[0];
    setVideoFile(file);
  };

  const handleThumbnailFileChange = (e) => {
    const file = e.target.files[0];
    setThumbnailFile(file);
  };

  const handleFileButtonClick = (fileInputRef) => {
    fileInputRef.current.click();
  };

  const makeCreateRequest = async () => {
    const formData = new FormData();
    formData.append("title", newVideo.title);
    formData.append("description", newVideo.description);
    formData.append("user", newVideo.user);
    formData.append("video", videoFile);
    formData.append("thumbnail", thumbnailFile);

    const endpoint = `/video_learning/addvideo/`;
    const res = await instance.post(endpoint, formData);
    props.closeNewVideoAdd();
  };

  const handleChange = (e, name) => {
    setNewVideo({ ...newVideo, [name]: e.target.value });
  };

  const isValidForm = () => {
    return (
      newVideo.title.trim() !== "" &&
      newVideo.description.trim() !== "" &&
      videoFile !== null &&
      thumbnailFile !== null
    );
  };

  return (
    <div className="create-model">
      <div className="create-model-container">
        <div className="create-model-header">
          <h3>{t("createNewCollection")}</h3>
        </div>
        <div className="create-model-body">
          <div className="create-model-body-input">
            <label>{t("title")}</label>
            <input
              type="text"
              placeholder={t("title")}
              value={newVideo.title}
              onChange={(e) => handleChange(e, "title")}
            />
            <label>{t("description")}</label>
            <textarea
              type="text"
              placeholder={t("description")}
              value={newVideo.description}
              onChange={(e) => handleChange(e, "description")}
            ></textarea>
          </div>

          <div className="file-input">
            <div className="video-input">
              <button onClick={() => handleFileButtonClick(videoFileInputRef)}>
                <RiVideoUploadFill className="video-btn" />
              </button>
              <input
                type="file"
                ref={videoFileInputRef}
                style={{ display: "none" }}
                onChange={(e) => handleVideoFileChange(e)}
              />
              <p>
                {videoFile ? (
                  videoFile.name
                ) : (
                  <>
                    <p>{t("selectVideoFile")}</p>
                    <strong>{t("maxFileSizeVideo")}</strong>
                  </>
                )}
              </p>
            </div>

            <div className="thumbnail-input">
              <button
                onClick={() => handleFileButtonClick(thumbnailFileInputRef)}
              >
                <FaImage className="image-btn" />
              </button>
              <input
                type="file"
                ref={thumbnailFileInputRef}
                style={{ display: "none" }}
                onChange={(e) => handleThumbnailFileChange(e)}
              />
              <p>
                {thumbnailFile ? (
                  thumbnailFile.name
                ) : (
                  <>
                    <p>{t("selectImageFile")}</p>
                    <strong>{t("maxFileSizeImage")}</strong>
                  </>
                )}
              </p>
            </div>
          </div>
        </div>
        <div className="create-model-footer">
        <button className="cancle-btn" type="submit" onClick={props.closeNewVideoAdd}>
            {t("video_cancle_btn")}
          </button>
          {isValidForm() && (
            <button className="create-btn" type="submit" onClick={makeCreateRequest}>
              {t("video_upload_btn")}
            </button>
          )}

          
        </div>
      </div>
    </div>
  );
};

export default CreateModel;
