import React, { useState } from "react";
import Layout from "../navigations/Layout";
import "./style/setting.css";
// import Profile from "./Profile";
import ChnagePassword from "./ChnagePassword";
import OtherSetting from "./otherSetting";
import TeacherProfile from "./Profile/TeacherProfile";
const Setting = () => {
  const [activeMenuItem, setActiveMenuItem] = useState("Profile");

  const handleMenuItemClick = (menu) => {
    setActiveMenuItem(menu);
  };

  const renderComponent = () => {
    switch (activeMenuItem) {
      case "Profile":
        return <TeacherProfile />;

        case "Change Password":
            return <ChnagePassword />;


        case "Other Settings":
            return <OtherSetting />;

      default:
        return null;
    }
  };

  return (
    <Layout>
      <div className="settings">
        <div className="setting-menu">
          <div className="setting-menu-items">
            <li
              className={activeMenuItem === "Profile" ? "act-menu" : ""}
              onClick={() => handleMenuItemClick("Profile")}
            >
              Profile
            </li>
            <li
              className={activeMenuItem === "Change Password" ? "act-menu" : ""}
              onClick={() => handleMenuItemClick("Change Password")}
            >
              Change Password
            </li>
            <li
              className={activeMenuItem === "Other Settings" ? "act-menu" : ""}
              onClick={() => handleMenuItemClick("Other Settings")}
            >
             Other Setting
            </li>
          </div>
        </div>
      <div className="component-container">{renderComponent()}</div>

      </div>
    </Layout>
  );
};

export default Setting;
