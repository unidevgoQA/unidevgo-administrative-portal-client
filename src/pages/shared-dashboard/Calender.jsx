import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import React, { useContext, useEffect } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import {
  useDeleteCalenderEventMutation,
  useGetAllEventsQuery,
} from "../../features/calender-events/calenderEvents";
import { useGetProfileByEmailQuery } from "../../features/profile/profileApi";
import { AuthContext } from "../../providers/AuthProviders";

const Calender = () => {
  //User
  const { user } = useContext(AuthContext);
  //Get user by email Api
  const { data: userData } = useGetProfileByEmailQuery(user.email);
  //Register User
  const registerUser = userData?.data;

  //Get all events
  const { data } = useGetAllEventsQuery();
  //Delete event api
  const [deleteEvent, { isLoading, isSuccess }] =
    useDeleteCalenderEventMutation();
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
          <div className="heading">
            <h2>
              <span>Calender</span> <i class="fa-regular fa-calendar-days"></i>
            </h2>
          </div>
          <div className="table-responsive calender-wrapper mb-3">
            <FullCalendar
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              initialView="dayGridMonth"
              weekends={true}
              height={"80vh"}
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
          {registerUser?.role === "admin" ||
          registerUser?.role === "super admin" ? (
            <div className="add-event-wrapper">
              <Link className="add-new-event-btn" to={"/dashboard/add-new-event"}>Add New Event  <i class="fa-solid fa-chevron-right"></i></Link>
            </div>
          ) : (
            <></>
          )}
        </div>
      </div>
    </div>
  );
};

export default Calender;
