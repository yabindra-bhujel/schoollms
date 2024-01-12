import React, { useState, useEffect } from "react";
import Layout from "../navigations/Layout";
import "./style/videoList.css";
import instance from "../../api/axios";

import { BsPlayCircle } from "react-icons/bs";
import { Link } from "react-router-dom";
import Search from "./Search"; 
import { useTranslation } from "react-i18next";
import { getArticleList } from "./LearningSectionService";

const VideoList = () => {
  const [items, setItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [notFound, setNotFound] = useState(false); 
  const { t } = useTranslation();

  const fetchData = async () => {
    try {
      const [videoRes, articleRes] = await Promise.all([
        instance.get("/video_learning/"),
        getArticleList(),
      ]);

      const videos = videoRes.data.map((video) => ({
        ...video,
        type: "video",
      }));

      const articles = articleRes.map((article) => ({
        ...article,
        type: "article",
      }));

      const combinedData = [...videos, ...articles];

      setItems(combinedData);
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filterData = async () => {
    const endpoint = `/video_learning/search/?query=${searchQuery}`;
    try {
      const res = await instance.get(endpoint);
      const filteredData = res.data.map((item) => ({
        ...item,
        type: item.video ? "video" : "article",
      }));
      setItems(filteredData);
      setNotFound(filteredData.length === 0);
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  useEffect(() => {
    if (searchQuery === "") {
      fetchData();
    } else {
      filterData();
    }
  }, [searchQuery]);

  return (
    <Layout>
      <div className="search-container">
        <Search query={setSearchQuery} />
      </div>
      <div className="videoList">
        {notFound ? (
          <p>{t("noResultsFound")} "{searchQuery}"</p>
        ) : (
          items.map((item) => (
            <Link
              key={item.id}
              to={item.type === "video" ? `/video/${item.id}` : `/article/${item.id}`}
              className="videoList__container"
            >
              <div className="videoList__container__video">
                {item.type === "video" && (
                  <>
                    <img src={item.thumbnail} alt="Video Thumbnail" />
                    <div className="play-button">
                      <BsPlayCircle />
                    </div>
                  </>
                )}
              </div>
              <div className="videoList-info">
                <div className="user-info">
                  {item.user_profile && item.user_profile.image && (
                    <img
                      src={item.user_profile.image}
                      alt="User Profile"
                    />
                  )}
                </div>
                <div className="video-info">
                  <h3>
                    {item.first_name} {item.last_name}
                  </h3>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </Layout>
  );
};

export default VideoList;
