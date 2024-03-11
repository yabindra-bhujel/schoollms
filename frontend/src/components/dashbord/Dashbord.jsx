import React from "react";
import Layout from "../navigations/Layout";
import "./style/dashbord.css";
import instance from "../../api/axios";
import { useEffect, useState } from "react";
import jwtDecode from "jwt-decode";
import {ResponsiveContainer,LineChart,Line,XAxis,YAxis,CartesianGrid,Tooltip,Legend} from "recharts";
import BasicDateCalendar from "./Calender";
import TodayCourseList from "./TodayCourseList";
import TodayEventList from "./TodayEventList";
import HeatmapChart from "./heatmapChart";
import AnnouncementList from "./Announcement/AnnouncementList";
import getUserInfo from "../../api/user/userdata";

const Dashboard = () => {
    const loginedinUserdata = JSON.parse(localStorage.getItem("userData"));
    const accessToken = loginedinUserdata.access;
    const decoded = jwtDecode(accessToken);
    const username = decoded.username;
    const isTeacher = getUserInfo().isTeacher;

    const lineChartData = [
        { name: "Jan", sales: 500 },
        { name: "Feb", sales: 600 },
        { name: "Mar", sales: 800 },
    ];

    const barChartData = [
        { name: "Jan", revenue: 200 },
        { name: "Feb", revenue: 400 },
        { name: "Mar", revenue: 300 },
        { name: "Mar", revenue: 500 },
        { name: "Mar", revenue: 250 },
        { name: "Mar", revenue: 500 },
        { name: "Mar", revenue: 450 },
    ];

    return (
        <Layout>
            <div className="container">
                <div className="left-item">
                    <div className="dashboard-cards">
                        <div className="assigemnt-deadeline">
                            
                        </div>
                        <div className="card">
                            <h2>Total Students</h2>
                            <p>600</p>
                        </div>
                        <div className="card">
                            <h2>Total Teachers</h2>
                            <p>20</p>
                        </div>
                    </div>

                    <div className="chart-section-one">
                        <div className="chart-item-big">
                        </div>
                        <div className="calender-item">
                        <BasicDateCalendar />
                        </div>
                    </div>
                    {/* <div className="dashbord-section-two">
                        <div className="dashbord-announcement">
                            {isTeacher ?(
                                <h2>
                                    Teacher data 
                                </h2>


                            ):(
                            <AnnouncementList/>

                            )}
                           
                        </div>
                        <div className="chart-item">
                            <h2>Chart 4</h2>
                        </div>
                    </div> */}
                </div>
                <div className="right-item">
                    <div className="subject-list">
                    <TodayCourseList/>

                    </div>
                    <div className="event-list">
                    <TodayEventList/>

                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Dashboard;
