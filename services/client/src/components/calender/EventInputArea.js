import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useTranslation } from 'react-i18next';


const EventInputArea = ({
  newEvent,
  handleInputChange,
  handleStartDateChange,
  handleEndDateChange,
  handleAddEvent,
  isVallidFrom,
  selectedColorButton,
  handleButtonClick,
}) => {
  const buttonColors = ["#FFD600", "#FF5733", "#33FF57", "#3357FF", "#FF33DC"];
  const { t } = useTranslation();

  return (
    <div className="input-area">
      <input
        type="text"
        placeholder={t("event")}
        name="title"
        value={newEvent.title}
        onChange={handleInputChange}
        required
      />
      
      <div className="date-picker-wrapper">
        <DatePicker
          selected={newEvent.start_date}
          onChange={handleStartDateChange}
          dateFormat="yyyy-MM-dd"
        />
        <DatePicker
          selected={newEvent.end_date}
          onChange={handleEndDateChange}
          dateFormat="yyy-MM-dd"
          required
        />
      </div>

      <input
        type="time"
        placeholder="Time"
        name="time"
        value={newEvent.time}
        onChange={handleInputChange}
        required
      />

      {/* Color Selector */}
      <div className="color-selecter">
        {buttonColors.map((color, index) => (
          <button
            key={index}
            className={`color-button ${selectedColorButton === index ? "selected" : ""}`}
            onClick={() => handleButtonClick(index)}
            style={{ backgroundColor: color }}
          >
            {selectedColorButton === index && <span className="selected-indicator" />}
          </button>
        ))}
      </div>

      {isVallidFrom() && <button onClick={handleAddEvent}>Add</button>}
    </div>
  );
};

export default EventInputArea;
