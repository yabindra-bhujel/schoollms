import React from "react";
import Layout from "../layout/Layout";
import "./style/dashbord.css";
import AnnouncementsList from "./Announcements";
import AssigmentList from "./AssigmentList";
import AttendanceReport from "./AttendanceReport";
import Schedules from "./Schedules";
import { Link } from 'react-router-dom';

const Dashboard = () => {


    return (
        <Layout>
            <div className="container">
                {/* left */}
                <div className="left">

                    {/* left top */}
                    <div className="left__header">
                        <div className="left_header__section"></div>
                        <div className="right_header_section">
                            <AnnouncementsList />
                        </div>
                    </div>

                    {/* left buttom */}
                    <div className="left__buttom">
                        <div className="left_buttom__section"></div>
                        <div className="right_buttom_section">
                            <AssigmentList />
                        </div>
                    </div>

                </div>

                <div className="center">

                    {/* left top */}
                    <div className="center_header">
                        <div className="center_header_left__section"></div>
                        <div className="center_header_right_section">
                            <AttendanceReport />
                        </div>
                    </div>

                    {/* left buttom */}
                    <div className="center__buttom">
                        <div className="center_buttom_left__section"></div>
                        <div className="center_buttom_right_section">
                            <h1>Quick Links</h1>
                            <ul>
                                <li><Link to="/submit-assignment">Submit Assignment</Link></li>
                                <li><Link to="/view-grades">View Grades</Link></li>
                                <li><Link to="/contact-support">Contact Support</Link></li>
                            </ul>
                        </div>
                    </div>

                </div>

                <div className="right">
                    <Schedules />
                </div>
            </div>
        </Layout>
    );
};

export default Dashboard;
