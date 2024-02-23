import React, { useState } from "react";
import Layout from "../layout/Layout";
import "./style/setting.css";
import Profile from "./Profile";
import ChnagePassword from "./ChnagePassword";
import OtherSetting from "./otherSetting";
import TeacherProfile from "./Profile/TeacherProfile";
import getUserInfo from "../../api/user/userdata";
import NotificationOtherSettings from "./NotificationOtherSettings";


const Setting = () => {
  const [activeMenuItem, setActiveMenuItem] = useState("Profile");

  const isTeacher = getUserInfo().isTeacher;

  const handleMenuItemClick = (menu) => {
    setActiveMenuItem(menu);
  };

  const renderComponent = () => {
    switch (activeMenuItem) {
      case "Profile":
        return <Profile />;

      case "Change_Password":
        return <ChnagePassword />;


      case "notification":
        return <NotificationOtherSettings />;

      default:
        return null;
    }
  };

  return (
    <Layout>
      <div className="settings">
        <div className="setting-menu-header">
          <h1>Settings</h1>
          <strong>Manage your settings and preference.</strong>
        </div>
        <div className="setting-menu">
          <div className="setting-menu-items">
            <button className={activeMenuItem === "Profile" ? "act-menu" : ""}
              onClick={() => handleMenuItemClick("Profile")}>Profile Settings</button>
            <button
              className={
                activeMenuItem === "notification" ? "act-menu" : ""
              }
              onClick={() => handleMenuItemClick("notification")}
            >Notification Preferences</button>



            <button
              className={
                activeMenuItem === "Change_Password" ? "act-menu" : ""
              }
              onClick={() => handleMenuItemClick("Change_Password")}
            >Password and Security</button>


            {isTeacher && (
              <button
                className={
                  activeMenuItem === "teaching_preferences" ? "act-menu" : ""
                }
                onClick={() => handleMenuItemClick("teaching_preferences")}
              >Teaching Preferences</button>
            )}



          </div>


        </div>
        <div className="component-container">{renderComponent()}</div>

      </div>
    </Layout>
  );
};

export default Setting;
