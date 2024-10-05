import React from "react";
import "./style/AnnouncementsList.css";
import { FaBullhorn } from 'react-icons/fa';

const AnnouncementsList = () => {
    const announcementList = [
        { title: "新しい学期が始まります", time: "2024-10-05 10:00" },
        { title: "スポーツイベントのお知らせ", time: "2024-10-07 14:00" },
        { title: "研究発表会の開催", time: "2024-10-10 15:00" },
        { title: "夏季休暇のスケジュール", time: "2024-10-12 09:00" },
        { title: "奨学金の申し込み締切", time: "2024-10-15 17:00" },
        { title: "キャリアフェアのご案内", time: "2024-10-20 11:00" },
        { title: "新入生歓迎会のお知らせ", time: "2024-10-25 09:00" },
        { title: "学生寮の募集 新入生歓迎会のお知らせ キャリアフェアのご案内", time: "2024-11-25 09:00" },
    ];

    return (
        <div className="announcement_container">
            <h1 className="title">Announcements</h1>
            <ul className="list">
                {announcementList.map((announcement, index) => (
                    <li key={index} className="item">
                        <div className="itemContent">
                            <FaBullhorn className="announcement-icon" />
                            <div className="textContent">
                                <p className="titleText">{announcement.title}</p>
                                <p className="announcement__time">{announcement.time}</p>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default AnnouncementsList;
