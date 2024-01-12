import * as React from 'react';
import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { PickersDay } from '@mui/x-date-pickers/PickersDay';
import "./style/calender.css"

export default function CustomDateCalendar() {
  const [selectedDate, setSelectedDate] = React.useState();

  const handleDateChange = (newDate) => {
    setSelectedDate(newDate);
    const timestampString = newDate.format(); // Format the date as a timestamp string
    console.log("Timestamp:", timestampString);
  };

  console.log("Timestamp:", selectedDate);
  const renderWeekendDays = (date, selectedDates, pickersDayProps) => {
    const isWeekend = date.day() === 0 || date.day() === 6;

    return (
      <PickersDay 
        {...pickersDayProps}
        className={isWeekend ? "weekend" : ''}
      />
    );
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DateCalendar 
        value={selectedDate}
        onChange={handleDateChange}
        renderDay={renderWeekendDays}
      />
    </LocalizationProvider>
  );
}
