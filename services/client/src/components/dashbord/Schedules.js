import React, { useEffect, useState } from "react";
import "./style/Schedules.css";
import { FaRegCalendarAlt } from "react-icons/fa";
import instance from "../../api/axios";
import { LuClock8 } from "react-icons/lu";

const Schedules = () => {
    const today = new Date();
    const monthOptions = { month: "long" };
    const date = today.getDate();
    const monthName = new Intl.DateTimeFormat('en-US', monthOptions).format(today);
    const year = today.getFullYear();
    const currentDate = `${date} ${monthName} ${year}`;
    const [events, setEvents] = useState([]);

    const getTodayEvent = async () => {
        const endpoint = `/calendar/get_today_event`;
        try {
            const response = await instance.get(endpoint);
            if (response.status === 200) {
                setEvents(response.data);
            }
        } catch (error) {
        }
    };

    useEffect(() => {
        getTodayEvent();
    }, []);

    return (
        <div className="schedules-container">
            <div className="schedules-header">
                <h1>Schedule</h1>
                <div className="schedules-right">
                    <FaRegCalendarAlt className="schedules-icon" />
                    <span>{currentDate}</span>
                </div>
            </div>
            {events.length > 0 ? (
                <ul className="schedule-list">
                    {events.map(schedule => (
                        <li key={schedule.id} className="schedule-item">
                            <LuClock8 className="schedule-icon-list" size={25} />
                            <div className="schedule-content">
                                <span className="schedule-title">{schedule.title}</span>
                                <span className="schedule-time">{schedule.start_time} - {schedule.end_time}</span>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="no-events-message">You do not have any events.</p>
            )}
        </div>
    );
};

export default Schedules;
