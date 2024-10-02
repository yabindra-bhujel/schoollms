import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import "./style/exam.css"
const CountdownTimer = ({ examlist }) => {
  const { t } = useTranslation()
  // Function to parse time string into seconds
  const parseTimeString = (timeString) => {
    if (timeString.includes(":")) {
      const [hours, minutes, seconds] = timeString.split(":").map(Number);
      return hours * 3600 + minutes * 60 + seconds;
    } else {
      return parseInt(timeString, 10);
    }
  };

  // Replace with your desired initial time or use examlist.duration
  const timeString = examlist?.duration || "";
  const initialDuration = parseTimeString(timeString);
  const [remainingTime, setRemainingTime] = useState(initialDuration);

  useEffect(() => {
    const timer = setInterval(() => {
      setRemainingTime((prevRemainingTime) =>
        prevRemainingTime > 0 ? prevRemainingTime - 1 : 0
      );
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []); // empty dependency array to run the effect once on mount

  const formatTimeUnit = (unit) => {
    return unit.toString().padStart(2, "0");
  };

  const formattedHours = formatTimeUnit(Math.floor(remainingTime / 3600));
  const formattedMinutes = formatTimeUnit(
    Math.floor((remainingTime % 3600) / 60)
  );
  const formattedSeconds = formatTimeUnit(remainingTime % 60);

  return (
    <div>
      <strong>
        {t("exma.timer")}
      </strong>
      <div className="timer">
        <h3>{formattedHours}</h3>:
        <h3>{formattedMinutes}</h3>:
        <h3>{formattedSeconds}</h3>
      </div>
    </div>
  );
};

export default CountdownTimer;
