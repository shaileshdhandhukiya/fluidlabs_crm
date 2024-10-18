import React from "react";
import Calendar from "@ericz1803/react-google-calendar";

const API_KEY = "AIzaSyDv5YlXRnsOmtQcb-6llVfDOxIcTUajDrQ";
let calendars = [
  { calendarId: "hitesh@fluidlabs.co.uk" },
  {
    calendarId: "en-gb.indian#holiday@group.v.calendar.google.com",
    color: "#B241D1", // Specify color for the second calendar's events
  },
];

const CalendarView = () => {
  return (
    <div className="calendar-container">
      <div className="calendar-wrapper">
        <Calendar apiKey={API_KEY} calendars={calendars} />
      </div>
    </div>
  );
};

export default CalendarView;
