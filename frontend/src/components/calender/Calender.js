import React, { useState, useEffect } from "react";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import "./style/Calendar.css";
import Layout from "../navigations/Layout";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./style/CustomToolbar.css";
import "./style/weekday.css";
import { TiWeatherPartlySunny } from "react-icons/ti";
import { useTranslation } from "react-i18next";
import instance from "../../api/axios";
import getUserInfo from "../../api/user/userdata";
import axios from "axios";
import { Calendar, momentLocalizer } from "react-big-calendar";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import {
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import EventIcon from "@mui/icons-material/Event";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

const DnDCalendar = withDragAndDrop(Calendar);
const localizer = momentLocalizer(moment);

const CalendarComponent = () => {
  const userData = getUserInfo();
  const user = userData.user_id;
  const username = userData.username;
  const initialEvent = {
    title: "",
    start_date: new Date(),
    end_date: new Date(),
    time: "",
    user: user,
  };
  const buttonColors = ["#FFD600", "#FF5733", "#33FF57", "#3357FF", "#FF33DC"]; 
  const [events, setEvents] = useState([]);
  const [newEvent, setNewEvent] = useState(initialEvent);
  const [todayevent, setTodayevent] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [selected, setSelected] = useState();
  const { t } = useTranslation();
  const [seletedColorButton, setSeletedColorButton] = useState(
    buttonColors.indexOf("#3357FF")
  );




  const formats = {
    weekdayFormat: (date, culture, localizer) =>
      localizer.format(date, "dddd", culture),
  };

  const handleEventClick = (event, target) => {
    setSelectedEvent(event);
    setAnchorEl(target);
    setOpenDialog(true);
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };


  const onEventDrop = ({ event, start, end, isAllDay }) => {
    if (event.color === "red" || event.color === "green") {
      setSnackbarOpen(true);
      return;
    }

    // Proceed with updating the event
    const updatedEvent = { ...event, start, end, isAllDay };
    setEvents((prevEvents) => {
      const filtered = prevEvents.filter((item) => item.id !== event.id);
      return [...filtered, updatedEvent];
    });

    // Update to backend
    eventUpdate(updatedEvent);
  };

  const eventUpdate = async (data) => {
    try {
      const endpoint = `/notification/update_event_date/`;
      const response = await instance.put(endpoint, data);
      if (response.status === 200) {
        getEvent();
      }
    } catch (e) {
      console.log(e);
    }
  };

  const onEventResize = ({ event, start, end }) => {
    const updatedEvents = events.map((evt) => {
      if (evt.id === event.id) {
        return { ...evt, start, end };
      }
      return evt;
    });
    setEvents(updatedEvents);
    // Optionally, update the event in your backend here
  };


  const handleButtonClick = (index) => {
    setSeletedColorButton(index);
  };

  useEffect(() => {
    getEvent();
  }, []);

  const getEvent = async () => {
    try {
      const endpoint = `/notification/calendar/${username}/`;
      const response = await instance.get(endpoint);
      setEvents(response.data);
    } catch (e) {}
  };

  const formattedEvents = events.map((event) => ({
    id: event.id,
    title: event.title,
    start: new Date(`${event.start_date}T${event.time}`), // Combine date and time
    end: new Date(`${event.end_date}T${event.time}`), // Combine date and time
    color: event.color,
  }));

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewEvent((prevEvent) => ({
      ...prevEvent,
      [name]: value,
    }));
  };

  const handleStartDateChange = (date) => {
    setNewEvent((prevEvent) => ({
      ...prevEvent,
      start_date: date,
    }));
  };

  const handleEndDateChange = (date) => {
    setNewEvent((prevEvent) => ({
      ...prevEvent,
      end_date: date,
    }));
  };

  const addEvent = async () => {
    try {
      const formattedEvent = {
        title: newEvent.title,
        start_date: newEvent.start_date.toISOString().split("T")[0], // Format to 'YYYY-MM-DD'
        end_date: newEvent.end_date.toISOString().split("T")[0], // Format to 'YYYY-MM-DD'
        time: newEvent.time,
        user: parseInt(newEvent.user),
        username: username,
        color: buttonColors[seletedColorButton],
      };

      const endpoint = `/notification/addevent/${username}/`;
      const response = await instance.post(endpoint, formattedEvent);
      setNewEvent(initialEvent);
    } catch (e) {}
  };

  const handleAddEvent = async () => {
    await addEvent();
    await getEvent();
    getTodayData();
  };

  const isVallidFrom = () => {
    return (
      newEvent.title !== "" &&
      newEvent.start_date !== "" &&
      newEvent.end_date !== "" &&
      newEvent.time !== ""
    );
  };
  const eventStyleGetter = (event, start, end, isSelected) => {
    const backgroundColor = event.color;
    const style = {
      backgroundColor,
      borderRadius: "5px",
      color: "white",
    };
    return {
      style,
    };
  };

  const handleDelete = async (event) => {
    const eventID = event.id;
    const endpoint = `/notification/delete_event/${eventID}/`;
    const response = await instance.delete(endpoint);
    if (response.status === 200) {
      getEvent();
      getTodayData();
      setOpenDialog(false);
    }
  };

  const getTodayData = () => {
    const today = new Date();

    const filterEvents = formattedEvents.filter((event) => {
      const eventStart = new Date(event.start);
      const eventEnd = new Date(event.end);

      const startsToday =
        eventStart.getFullYear() === today.getFullYear() &&
        eventStart.getMonth() === today.getMonth() &&
        eventStart.getDate() === today.getDate();

      const endsToday =
        eventEnd.getFullYear() === today.getFullYear() &&
        eventEnd.getMonth() === today.getMonth() &&
        eventEnd.getDate() === today.getDate();

      const spansToday = eventStart <= today && eventEnd >= today;

      return startsToday || endsToday || spansToday;
    });

    setTodayevent(filterEvents);
  };

  useEffect(() => {
    getTodayData();
  }, [events]);



  return (
    <Layout>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <MuiAlert
          onClose={handleCloseSnackbar}
          severity="warning"
          elevation={6}
          variant="filled"
        >
          Drag and drop is not allowed for red or green events.
        </MuiAlert>
      </Snackbar>

      <Dialog
        className="deleet-dialog"
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        anchorEl={anchorEl}
        anchorPosition={{ top: 50, left: 50 }}
        fullWidth={true}
      >
        <DialogTitle>
          <div className="close-delete-btn">
            {/* Conditionally render the delete button */}
            {selectedEvent &&
              selectedEvent.color !== "red" &&
              selectedEvent.color !== "green" && (
                <IconButton
                  aria-label="delete"
                  onClick={() => handleDelete(selectedEvent)}
                  style={{ marginRight: 8, color: "red" }}
                >
                  <DeleteIcon />
                </IconButton>
              )}

            <IconButton
              aria-label="close"
              onClick={() => setOpenDialog(false)}
              style={{ marginRight: 8 }}
            >
              <CloseIcon />
            </IconButton>
          </div>
        </DialogTitle>

        <DialogContent>
          {selectedEvent && (
            <div className="event-details">
              <div className="event-title">
                <EventIcon style={{ marginRight: 8 }} />
                <strong>{selectedEvent.title}</strong>
              </div>
              <div className="event-datetime">
                <p>{moment(selectedEvent.start).format("dddd, D MMMM")}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <div className="calender-container-main">
        <div className="input-area">
          <input
            type="text"
            placeholder={t("event")}
            name="title"
            value={newEvent.title}
            onChange={handleInputChange}
            required
          ></input>

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

          {/* color selecter */}
          <div className="color-selecter" style={{ marginTop: "20px" }}>
            {[1, 2, 3, 4, 5].map((number, index) => (
              <button
                key={index}
                className={`color-button ${
                  seletedColorButton === index ? "selected" : ""
                }`}
                onClick={() => handleButtonClick(index)}
                style={{ backgroundColor: buttonColors[index] }} // Apply background color from array
              >
                {seletedColorButton === index && (
                  <span className="selected-indicator" />
                )}
              </button>
            ))}
          </div>

          {isVallidFrom() && <button onClick={handleAddEvent}>Add</button>}

          <div className="todya-event-area">
            <h3>{t("today event")}</h3>
            <small>{t("dont miss")}</small>
            <div className="event-list">
              {todayevent.map((event) => (
                <p key={event.id}>
                  {event.title} - {moment(event.start).format("hh:mm A")}
                </p>
              ))}
            </div>
          </div>
        </div>

        <div className="calendar-container">
          <DnDCalendar
            selected={selected}
            onSelectEvent={(event, target) => handleEventClick(event, target)}
            localizer={localizer}
            onEventDrop={onEventDrop}
            onEventResize={onEventResize}
            resizable
            selectable
            events={formattedEvents}
            startAccessor="start"
            endAccessor="end"
            eventPropGetter={eventStyleGetter}
            formats={formats}
            components={{
              toolbar: CustomToolbar,
            }}
            views={["month", "week", "day", "agenda"]}
          />
        </div>
      </div>
    </Layout>
  );
};



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

  return (
    <div className="custom-toolbar">
      <div className="toolbar-navigation">
        <button onClick={() => onNavigate("PREV")}>Previous</button>
        <button onClick={() => onNavigate("TODAY")}>Today</button>
        <button onClick={() => onNavigate("NEXT")}>Next</button>
        <div className="toolbar-label">{label}</div>
      </div>

      <div className="toolbar-views">
        <div className="time-weather">
          <div className="time">
            <p>{moment().format("hh:mm A")}</p>
            <small>{location} </small>
            <small>{weatherData.current?.temp_c}°C</small> <br></br>
            <small>{weatherData.current?.condition?.text}</small>
          </div>
          <div className="weather">
            <span>
              <TiWeatherPartlySunny className="TiWeatherPartlySunny" />
            </span>
          </div>
        </div>
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

export default CalendarComponent;
