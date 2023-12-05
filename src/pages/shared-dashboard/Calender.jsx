import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import React from "react";

const Calender = () => {
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
                start: "today prev,next", // will normally be on the left. if RTL, will be on the right
                center: "title",
                end: "dayGridMonth,timeGridWeek,timeGridDay", // will normally be on the right. if RTL, will be on the left
              }}
              events={[
                { title: "event 1", date: "2023-12-01" },
                { title: "event 2", date: "2023-12-02" },
              ]}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calender;
