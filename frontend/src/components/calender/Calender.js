import React, { useState, useEffect } from "react";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import "./style/Calendar.css";
import Layout from "../layout/Layout";
import "react-datepicker/dist/react-datepicker.css";
import "./style/CustomToolbar.css";
import "./style/weekday.css";
import { useTranslation } from "react-i18next";
import getUserInfo from "../../api/user/userdata";
import { Calendar, momentLocalizer } from "react-big-calendar";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import { Dialog, DialogTitle, DialogContent } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import EventIcon from "@mui/icons-material/Event";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { addNewEvent, deleteEvent, getEvents, updateEvent, makeClassCancellation } from "./CalenderService";
import CustomToolbar from "./CustomToolbar";
import { TextField, Button } from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { Switch } from '@mui/material';



const DnDCalendar = withDragAndDrop(Calendar);
const localizer = momentLocalizer(moment);

const ColorSelector = ({ buttonColors, selectedColor, onColorChange }) => {
  return (
    <div className="color-selector">
      {buttonColors.map((color, index) => (
        <button
          key={index}
          className={`color-button ${selectedColor === index && "selected"}`}
          style={{ backgroundColor: color }}
          onClick={() => onColorChange(index)}
        ></button>
      ))}
    </div>
  );
};

const CalendarComponent = () => {
  const userData = getUserInfo();
  const user = userData.user_id;
  const currentDate = new Date();
  const currentDateFormatted = currentDate.toISOString().split('T')[0];
  const [newEvent, setNewEvent] = useState({
    title: "",
    start_date: currentDateFormatted,
    end_date: currentDateFormatted,
    start_time: "09:00",
    end_time: "23:59",
    user: user,
    color: "#FFD600",
  });

  const buttonColors = ["#FFD600", "#FF5733", "#33FF57", "#3357FF", "#FF33DC"];
  const [events, setEvents] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [openNewEventDialog, setOpenNewEventDialog] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [selected, setSelected] = useState();
  const { t } = useTranslation();
  const isTeacher = userData.isTeacher;
  const [isClassCancellation, setIsClassCancellation] = useState(false);


  useEffect(() => {
    if (selectedEvent !== null) {
      setIsClassCancellation(selectedEvent.is_class_cancellation);
    }
  }, [selectedEvent]);
  
  

  const [seletedColorButton, setSeletedColorButton] = useState(
    buttonColors.indexOf("#3357FF")
  );
  const handleColorChange = (index) => {
    setSeletedColorButton(index);
  };


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

  const fatchData = async () => {
    const response = await getEvents();
    if (response.status === 200) {
      setEvents(response.data);
    }
  }

  const eventUpdate = async (data) => {
    try {
      const response = await updateEvent(data);
      if (response.status === 200) {
        fatchData();
      }
    } catch (e) {
      console.log(e);
    }
  };

  const handleClassCancellation = async (event) => {
    const response = await makeClassCancellation(event);
    if (response.status === 200) {
      fatchData();
      setOpenDialog(false);
    }
  }

  const onEventResize = ({ event, start, end }) => {
    const updatedEvents = events.map((evt) => {
      if (evt.id === event.id) {
        return { ...evt, start, end };
      }
      return evt;
    });
    setEvents(updatedEvents);
  };
  useEffect(() => {
    fatchData();
  }, []);

  const formattedEvents = events.map((event) => ({
    id: event.id,
    title: event.title,
    start: new Date(`${event.start_date}`),
    end: new Date(`${event.end_date}`),
    start_time:  event.start_time,
    end_time: event.end_time,
    color: event.color,
    is_class_cancellation: event.is_class_cancellation,
    subject: event.subject,

  }));

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewEvent((prevEvent) => ({
      ...prevEvent,
      [name]: value,
    }));
  };

  const handleStartDateChange = (event) => {
    const { name, value } = event.target;
    setNewEvent((prevEvent) => ({
      ...prevEvent,
      [name]: value,
    }));
  };

  const handleEndDateChange = (event) => {
    const { name, value } = event.target;
    setNewEvent((prevEvent) => ({
      ...prevEvent,
      [name]: value,
    }));
  };

  const handleStartTimeChange = (event) => {
    const { name, value } = event.target;
    setNewEvent((prevEvent) => ({
      ...prevEvent,
      [name]: value,
    }));
  };

  const handleEndTimeChange = (event) => {
    const { name, value } = event.target;
    setNewEvent((prevEvent) => ({
      ...prevEvent,
      [name]: value,
    }));
  };

  const addEvent = async () => {
    try {
      const formattedEvent = {
        title: newEvent.title,
        start_date: newEvent.start_date,
        end_date: newEvent.end_date,
        start_time: moment(newEvent.start_time, "HH:mm").format("HH:mm"),
        end_time: moment(newEvent.end_time, "HH:mm").format("HH:mm"),
        color: buttonColors[seletedColorButton],
      };


      const response = await addNewEvent(formattedEvent);
      if (response.status === 201) {
        console.log("Event added successfully");
      } else {
        console.log(response)
      }
      setNewEvent({
        title: "",
        start_date: "",
        end_date: "",
        start_time: "09:00",
        end_time: "23:59",
      });
      setOpenNewEventDialog(false);
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddEvent = async () => {
    if (!isVallidFrom()) {
      return;
    }
    await addEvent();
    await fatchData();
  };

  const isVallidFrom = () => {
    return (
      newEvent.title !== "" &&
      newEvent.start_date !== "" &&
      newEvent.end_date !== "" &&
      newEvent.start_time !== "" &&
      newEvent.end_time !== ""
    );
  };

  const eventStyleGetter = (event) => {
    let backgroundColor = event.color;
    if (event.is_class_cancellation) {
      backgroundColor = "black";
    }
    const style = {
      backgroundColor,
      borderRadius: "5px",
      color: "white",
      padding: "5px",
    };
    return {
      style,
    };
  };
  

  const handleDelete = async (event) => {
    const eventID = event.id;
    const response = await deleteEvent(eventID);
    if (response.status === 200) {
      fatchData();
      setOpenDialog(false);
    }
  };

  const handleSelectSlot = (slotInfo) => {
    const formattedStartDate = moment(slotInfo.start).format("YYYY-MM-DD");
    setNewEvent(prevEvent => ({
      ...prevEvent,
      start_date: formattedStartDate,
      end_date: formattedStartDate,
    }));
    setOpenNewEventDialog(true);
  };

  const eventDateisPast = (event) => {
    const eventDate = new Date(event.start);
    const currentDate = new Date();
    return eventDate < currentDate;
  }


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
        >講義の日程は変更できません。</MuiAlert>
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
    {selectedEvent && (
      selectedEvent.color !== "red" &&
      selectedEvent.color !== "green" ? (
        <IconButton
          aria-label="delete"
          onClick={() => handleDelete(selectedEvent)}
          style={{ marginRight: 8, color: "red" }}
        >
          <DeleteIcon />
        </IconButton>
      ) : (
        isTeacher && selectedEvent.subject !== null && (
          <div>
            <Switch
              disabled={eventDateisPast(selectedEvent)}
              checked={isClassCancellation}
              onChange={() => handleClassCancellation(selectedEvent)}
            />

            <strong style={{ marginRight: 8, color:"red" }}>
            {isClassCancellation ? "休講" : "講義"} <br />
            </strong>
            {eventDateisPast(selectedEvent) ? (
              <small style={{ color: "red" }}>
                過去の講義は休講に変更できません。
              </small>
            ) : (
              <strong style={{ color: "red" }}>
                {selectedEvent.is_class_cancellation ? "" : "休講にすると、生徒に通知が行きます。"}
              </strong>
            )}
          </div>
        )
      )
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
              <div className="event-datetime">
                <p>
               { moment(selectedEvent.start_time, "HH:mm:ss").format("HH:mm")} - {moment(selectedEvent.end_time, "HH:mm:ss").format("HH:mm")}

                </p>
                </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog
        open={openNewEventDialog}
        onClose={() => setOpenNewEventDialog(false)}
        fullWidth={true}
        maxWidth="sm" 
      >
        <DialogTitle>
          <div className="close-delete-btn">
            <IconButton
              aria-label="close"
              onClick={() => setOpenNewEventDialog(false)}
              style={{ marginRight: 8 }}
            >
              <CloseIcon />
            </IconButton>
          </div>
        </DialogTitle>
        <DialogContent dividers style={{ minHeight: 250 }}> 
          <div className="input-area" style={{ padding: "16px" }}> 
            <ColorSelector
              buttonColors={buttonColors}
              selectedColor={seletedColorButton}
              onColorChange={handleColorChange}
            />
            <TextField
              type="text"
              label={t("event")}
              name="title"
              value={newEvent.title}
              onChange={handleInputChange}
              required
              fullWidth
              autoFocus
              style={{ marginBottom: "16px" }}
            />
            <TextField
              type="date"
              label="Start Date"
              name="start_date"
              value={newEvent.start_date}
              onChange={handleStartDateChange}
              InputLabelProps={{ shrink: true }}
              style={{ marginBottom: "16px" }}
              fullWidth
            />
            <TextField
              type="date"
              label="End Date"
              name="end_date"
              value={newEvent.end_date}
              onChange={handleEndDateChange}
              InputLabelProps={{ shrink: true }}
              style={{ marginBottom: "16px" }}
              fullWidth
            />

            <TextField
              type="time"
              label="Start Time"
              name="start_time"
              value={newEvent.start_time}
              onChange={handleStartTimeChange}
              style={{ marginBottom: "16px" }}
              fullWidth
            />

            <TextField
              type="time"
              label="End Time"
              name="end_time"
              value={newEvent.end_time}
              onChange={handleEndTimeChange}
              style={{ marginBottom: "16px" }}
              fullWidth
            />
          </div>
          <div className="add-event-btn" style={{ textAlign: "right", padding: "16px" }}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddCircleIcon />}
              onClick={handleAddEvent}
            >
              {t("add")}
            </Button>
          </div>
        </DialogContent>
      </Dialog>



      <div className="calender-container-main">
        <div className="calendar-container">
          <DnDCalendar
            selected={selected}
            onSelectEvent={(event, target) => handleEventClick(event, target)}
            localizer={localizer}
            onSelectSlot={handleSelectSlot}
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



export default CalendarComponent;
