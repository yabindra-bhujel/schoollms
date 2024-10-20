import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { IoIosCloseCircleOutline } from "react-icons/io";
import "./style/attendaceHeader.scss";

const MENU = {
  OVERVIEW_TABLE: "overview-table",
  CREATE_ATTENDANCE: "create-attendance",
};

const AttendaceHeader = ({ tableData, setActiveMenu }) => {
  const params = useParams();
  const subject_code = params.courseID;
  const [activeMenu, setActiveMenuLocal] = useState(MENU.OVERVIEW_TABLE);

  const handleMenuClick = (menu) => {
    setActiveMenu(menu);
    setActiveMenuLocal(menu);
  };

  const date = new Date();
  const todayDate = `${date.getFullYear()}-${
    date.getMonth() + 1
  }-${date.getDate()}`;

  return (
    <div className="attendace-header-component">
      <div className="action-buttons">
        <div className="actions">
          <button
            className={`btn-attdance ${
              activeMenu === MENU.OVERVIEW_TABLE ? "active" : ""
            }`}
            onClick={() => handleMenuClick(MENU.OVERVIEW_TABLE)}
          >
            Attendance Overview
          </button>
          <button
            className={`btn-attdance ${
              activeMenu === MENU.CREATE_ATTENDANCE ? "active" : ""
            }`}
            onClick={() => handleMenuClick(MENU.CREATE_ATTENDANCE)}
          >
            Create new Attendance
          </button>
        </div>
      </div>

      <div className="subject-name">
        {Array.from(new Set(tableData.map((item) => item.course))).map(
          (course, index) => (
            <p key={index}>{course}</p>
          )
        )}

        <small>{todayDate}</small>
      </div>

      <div className="back-btn">
        <Link to={`/class/${subject_code}`}>
          <IoIosCloseCircleOutline size={50} className="close-icon" />
        </Link>
      </div>
    </div>
  );
};

export default AttendaceHeader;
