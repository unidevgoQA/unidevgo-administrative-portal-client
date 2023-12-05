import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import React from "react";
import { Link } from "react-router-dom";

const Calender = () => {
  const handleEventClick = (info) => {
    console.log("clicked", info);
  };
  return (
    <div className="content-wrapper">
      <div className="row">
        <div className="col-md-12">
          <div className="heading">
            <h2>
              <span>Calender</span> <i class="fa-regular fa-calendar-days"></i>
            </h2>
          </div>
          <div className="calender-wrapper">
            <FullCalendar
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              initialView="dayGridMonth"
              weekends={true}
              height={"85vh"}
              headerToolbar={{
                start: "today prev,next",
                center: "title",
                end: "dayGridMonth,timeGridWeek,timeGridDay",
              }}
              events={[
                {
                    "start": "2023-12-06",
                    "end": "2023-12-08",
                    "title": "asdas"
                }
              ]}
              eventClick={handleEventClick}
            />
          </div>
          <div className="add-event-wrapper">
              <Link to={'/dashboard/add-new-event'} className="submit-btn">Add New Event</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calender;
