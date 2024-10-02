import React, { useEffect, useState } from "react";
import Layout from "../layout/Layout";
import "./style/learningsection.css";

import ReactPlayer from "react-player";
import Comment from "./comment";
import { useParams } from "react-router-dom";
import instance from "../../api/axios";
import getUserInfo from "../../api/user/userdata";
import { useTranslation } from "react-i18next";


const VideoDetails = () => {
  const user_id = getUserInfo();
  const like_user = user_id.user_id;
  const { id } = useParams();
  const { t } = useTranslation();

  const [video, setVideo] = useState({
    id: null,
    title: "",
    description: "",
    videoUrl: "",
    thumbnailUrl: "",
    createdAt: "",
    time: "",
  });

  const [user, setUser] = useState({
    id: null,
    username: "",
    profile: "",
  });

  const getVideoURL = async () => {
    const endpoint = `/video_learning/${id}/`;

    const res = await instance.get(endpoint);
    const videoData = res.data;
    setVideo({
      id: videoData.id,
      title: videoData.title,
      description: videoData.description,
      videoUrl: videoData.video,
      thumbnailUrl: videoData.thumbnail,
      createdAt: videoData.created_at,
      time: videoData.time_since_created,
    });
    // Set user data
    setUser({
      id: videoData.user.id,
      username: `${videoData.user.first_name} ${videoData.user.last_name}`,
      profile: videoData.user_profile.image,
    });
  };

  const makeLike = async () => {
    const endpoint = "/video_learning/addlike/";
    const likeData = {
      user: like_user, // Send the user ID
      video: id, // Send the video ID
    };

    try {
      // Make an API request to add/remove the like
      const res = await instance.post(endpoint, likeData);

      // Update the liked status in your state or data

      getVideoURL();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getVideoURL();
  }, []);

  return (
    <Layout>
      <div className="learningSection">
        <div className="playear">
          <div className="video">
            <ReactPlayer
              controls={true}
              width="1120px"
              height="590px"
              url={video.videoUrl}
            />

            <div className="video-discraption">
              <div className="userprofile">
                <img src={user.profile} />
              </div>
              <div className="video-info">
                <h3>
                  {user.username} <br /> <small>{video.time}</small>
                </h3>

                <strong>{video.title}</strong>
                <p>{video.description}</p>
              </div>
            </div>
          </div>

          <Comment />
        </div>
      </div>
    </Layout>
  );
};
export default VideoDetails;
