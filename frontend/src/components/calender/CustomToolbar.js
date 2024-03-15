
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import axios from "axios";
import moment from "moment";
import { TiWeatherPartlySunny } from "react-icons/ti";
import "./style/Calendar.css";

// CustomToolbar component for styling the toolbar
const CustomToolbar = ({ view, label, onView, onNavigate }) => {
    const { t } = useTranslation();
  
    const apiKey = "cbc5ac4d514d4c48ba271633232008";
    const location = "Tokushima Japan";
  
    const [weatherData, setWeatherData] = useState({});
  
    useEffect(() => {
      getweater();
    }, []);
  
    const getweater = async () => {
      try {
        const endpoint = `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${location}&aqi=no`;
        const response = await axios.get(endpoint);
        setWeatherData(response.data);
      } catch (e) {
        console.log(e);
      }
    };

    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); 
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours() % 12 || 12).padStart(2, '0'); 
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const ampm = now.getHours() >= 12 ? 'PM' : 'AM';
    
    const formattedDate = `${year}-${month}-${day} ${hours}:${minutes} ${ampm}`;
    
    
    return (
      <div className="custom-toolbar">
        <div className="toolbar-navigation">
          <button onClick={() => onNavigate("PREV")}>Previous</button>
          <button onClick={() => onNavigate("TODAY")}>Today</button>
          <button onClick={() => onNavigate("NEXT")}>Next</button>
          <div className="toolbar-label">{formattedDate}</div>
        </div>
        <div className="centered">
            <span>{month}</span>
          </div>
        <div className="toolbar-views">
         
          <button
            className={view === "month" ? "active" : ""}
            onClick={() => onView("month")}
          >
            {t("month")}
          </button>
          <button
            className={view === "week" ? "active" : ""}
            onClick={() => onView("week")}
          >
            {t("week")}
          </button>
          <button
            className={view === "day" ? "active" : ""}
            onClick={() => onView("day")}
          >
            {t("day")}
          </button>
          <button
            className={view === "List" ? "active" : ""}
            onClick={() => onView("agenda")}
          >
            {t("event list")}
          </button>
        </div>
      </div>
    );
  };
  
  export default CustomToolbar;
  