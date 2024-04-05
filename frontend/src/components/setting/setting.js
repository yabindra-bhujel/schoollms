import React, { useState } from "react";
import Layout from "../layout/Layout";
import "./style/setting.css";
import Profile from "./Profile";
import ChnagePassword from "./ChnagePassword";
import { useTranslation } from "react-i18next";



const Setting = () => {
  const [activeMenuItem, setActiveMenuItem] = useState("Profile");
  const handleMenuItemClick = (menu) => {
    setActiveMenuItem(menu);
  };
  const { t } = useTranslation();

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
          <h1>{t("settings.title")}</h1>
          <strong>{t("settings.attention")}</strong>
        </div>
        <div className="setting-menu">
          <div className="setting-menu-items">
            <button className={activeMenuItem === "Profile" ? "act-menu" : ""}
              onClick={() => handleMenuItemClick("Profile")}>{t("settings.setProfile")}</button>


            <button
              className={
                activeMenuItem === "Change_Password" ? "act-menu" : ""
              }
              onClick={() => handleMenuItemClick("Change_Password")}
            >{t("settings.securities")}</button>
          </div>
        </div>
        <div className="component-container">{renderComponent()}</div>
      </div>
    </Layout>
  );
};

export default Setting;
