import React, { useState } from "react";
import Layout from "../layout/Layout";
import "./style/setting.css";
import Profile from "./Profile";
import ChnagePassword from "./ChnagePassword";


const Setting = () => {
  const [activeMenuItem, setActiveMenuItem] = useState("Profile");
  const handleMenuItemClick = (menu) => {
    setActiveMenuItem(menu);
  };

  const renderComponent = () => {
    switch (activeMenuItem) {
      case "Profile":
        return <Profile />;

      case "Change_Password":
        return <ChnagePassword />;

      default:
        return null;
    }
  };

  return (
    <Layout>
      <div className="settings">
        <div className="setting-menu-header">
          <h1>設定</h1>
          <strong>設定と環境設定を管理しましょう。</strong>
        </div>
        <div className="setting-menu">
          <div className="setting-menu-items">
            <button className={activeMenuItem === "Profile" ? "act-menu" : ""}
              onClick={() => handleMenuItemClick("Profile")}>プロファイル設定</button>


            <button
              className={
                activeMenuItem === "Change_Password" ? "act-menu" : ""
              }
              onClick={() => handleMenuItemClick("Change_Password")}
            >セキュリティとその他</button>
          </div>
        </div>
        <div className="component-container">{renderComponent()}</div>
      </div>
    </Layout>
  );
};

export default Setting;
