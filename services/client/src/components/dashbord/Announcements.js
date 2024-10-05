import React, { useState, useEffect } from "react";
import "./style/AnnouncementsList.css";
import { FaBullhorn } from 'react-icons/fa';
import getUserInfo from "../../api/user/userdata";
import instance from "../../api/axios";

const AnnouncementsList = () => {
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const isStudent = getUserInfo().isStudent;

    useEffect(() => {
        if (isStudent) {
            instance.get("students/announcement/")
                .then((response) => {
                    setAnnouncements(response.data);
                })
                .catch((err) => {
                    setError("公告の取得に失敗しました。");
                })
                .finally(() => {
                    setLoading(false);
                });
        } else {
            setLoading(false);
        }
    }, [isStudent]);

    function extractTextFromHtml(htmlString) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlString, "text/html");
        return doc.body.textContent || "";
    }

    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
    }

    function truncateText(text, length) {
        return text.length > length ? `${text.slice(0, length)}...` : text;
    }

    function formatDate(date) {
        const dateArray = date.split("T");
        const timeArray = dateArray[1].split(":");
        return `${dateArray[0]} ${timeArray[0]}:${timeArray[1]}`;
    }

    if (loading) {
        return <div>Loading announcements...</div>;
    }

    return (
        <div className="announcement_container">
            <h1 className="title">Announcements</h1>
            <ul className="list">
                {error ? (
                    <li>{error}</li>
                ) : announcements.length > 0 ? (
                    announcements.map((announcement) => (
                        <li key={announcement.id} className="item">
                            <div className="itemContent">
                                <FaBullhorn className="announcement-icon" />
                                <div className="textContent">
                                    <p className="titleText">{capitalizeFirstLetter(announcement.announcement_title)}</p>
                                    <p className="announcementText">{truncateText(extractTextFromHtml(announcement.announcement_description), 50)}</p>
                                    <p className="announcement__time">{formatDate(announcement.announcement_date)}</p>
                                </div>
                            </div>
                        </li>
                    ))
                ) : (
                    <li>No announcements available</li>
                )}
            </ul>
        </div>
    );
};

export default AnnouncementsList;
