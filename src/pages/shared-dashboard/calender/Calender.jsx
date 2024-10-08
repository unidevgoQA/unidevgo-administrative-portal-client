import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import html2canvas from "html2canvas";
import React, { useContext, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import GoBack from "../../../components/go-back/GoBack";
import {
  useDeleteCalenderEventMutation,
  useEventEmailMutation,
  useGetAllEventsQuery,
} from "../../../features/calender-events/calenderEvents";
import {
  useGetProfileByEmailQuery,
  useGetProfilesQuery,
} from "../../../features/profile/profileApi";
import { AuthContext } from "../../../providers/AuthProviders";
import "./calender.scss";

const Calender = () => {
  //User
  const { user } = useContext(AuthContext);
  //Get user by email Api
  const { data: userData } = useGetProfileByEmailQuery(user.email);
  //Send event mail
  const [sendEventEmail] = useEventEmailMutation();
  //Get all events
  //Delete event api
  const [deleteEvent, { isLoading, isSuccess }] =
    useDeleteCalenderEventMutation();
  const { data } = useGetAllEventsQuery();
  //Register User
  const registerUser = userData?.data;
  //All users
  const { data: profilesData } = useGetProfilesQuery();
  //set data
  const allProfiles = profilesData?.data;
  //Filter Employees
  const employees = allProfiles?.filter(
    (profile) => profile?.role === "employee"
  );
  // const employeesEmail = employees?.map(employee => employee?.email);

  const employeesEmail = [
    "samiulahmedanik@gmail.com",
    "samiulanikahmed@gmail.com",
    "samiul.ahmed@unidevgo.com",
  ];

  //set all events
  const allEvents = data?.data;
  //Handle delete event
  const handleDeleteEvent = (info) => {
    const eventId = info.event._def.publicId;
    if (
      registerUser?.role === "admin" ||
      registerUser?.role === "super admin"
    ) {
      const deleteConfirm = window.confirm("Want to delete this event?");
      if (deleteConfirm) {
        deleteEvent(eventId);
      }
    } else {
      toast.error("You dont have access to modify the event");
    }
  };

  //Export Calender
  const calendarRef = useRef(null);

  const handleExport = () => {
    const calendarNode = calendarRef.current;

    if (calendarNode) {
      html2canvas(calendarNode).then((canvas) => {
        const link = document.createElement("a");
        link.href = canvas.toDataURL("image/png");
        link.download = "calendar.png";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      });
    }
  };

  //Check Event
  useEffect(() => {
    const currentDate = new Date();
    const formattedCurrentDate = currentDate.toISOString().split("T")[0];

    const matchedEvent = allEvents?.find(
      (event) => event.start === formattedCurrentDate
    );

    if (matchedEvent) {
      greetFunction(matchedEvent.title);
    }
  }, []);

  //Greet Function
  const greetFunction = (eventTitle) => {
    const event = {
      eventTitle,
      employeesEmail,
    };
    sendEventEmail(event);
  };

  //Delete efftects
  useEffect(() => {
    if (isSuccess) {
      toast.success("Delete Successfully", { id: "delete-event" });
    }
    if (isLoading) {
      toast.loading("Loading", { id: "delete-event" });
    }
  }, [isSuccess, isLoading]);

  return (
    <div className="content-wrapper">
      <div className="row">
        <div className="col-md-12">
          <div className="heading d-flex justify-content-between">
            <h2>
              <span>Calender</span> <i class="fa-regular fa-calendar-days"></i>
            </h2>
            {registerUser?.role === "admin" ||
            registerUser?.role === "super admin" ? (
              <div className="add-event-wrapper">
                <Link className="add-btn" to={"/dashboard/add-new-event"}>
                  <i class="fa-regular fa-square-plus"></i> Add New Event
                </Link>
              </div>
            ) : (
              <></>
            )}
          </div>
          <div
            className="table-responsive calender-wrapper mb-3 rounded p-3 border"
            ref={calendarRef}
          >
            <FullCalendar
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              initialView="dayGridMonth"
              weekends={true}
              height={"65vh"}
              headerToolbar={{
                start: "today",
                center: "title",
                // end: "dayGridMonth,timeGridWeek,timeGridDay",
                end: "prev,next",
              }}
              events={allEvents?.map((event) => ({
                id: event?._id,
                title: event?.title,
                start: new Date(event?.start),
                end: new Date(event?.end),
              }))}
              eventClick={handleDeleteEvent}
            />
          </div>

          <div>
            <button className="export-btn" onClick={handleExport}>
              Export Calendar
            </button>
          </div>
        </div>
      </div>
      <GoBack />
    </div>
  );
};

export default Calender;
