import React, { useEffect, useState } from "react";
import { DateRangePicker } from "react-date-range";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
import GoBack from "../../../components/go-back/GoBack";
import {
  useAddAttendenceMutation,
  useDeleteAttendenceMutation,
  useGetAllAttendenceQuery,
} from "../../../features/attendence/attendenceApi";

const AttendenceReport = () => {
  //APIs
  const { data: attendenceData } = useGetAllAttendenceQuery();

  const allAttendenceData = attendenceData?.data;

  //Delete API
  const [deleteAttendence, { isSuccess, isLoading }] =
    useDeleteAttendenceMutation();

  // Attendence

  const [
    addAttendence,
    { isLoading: attendenceLoading, isSuccess: attendenceSuccess },
  ] = useAddAttendenceMutation();

  // Form
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm();

  //States
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [profile, setProfile] = useState({});
  const [filteredAttendenceData, setFilteredAttendenceData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [filteredAttendenceDataByEmail, setFilteredAttendenceDataByEmail] =
    useState([]);

  const { id } = useParams();

  //Set url
  const baseUrl = import.meta.env.VITE_BASE_URL;
  const url = `${baseUrl}profile/${id}`;

  //Data load
  useEffect(() => {
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setProfile(data?.data);
      });
  }, [id]);

  useEffect(() => {
    const filterAttendence = allAttendenceData?.filter(
      (attendence) => attendence.employeeEmail === profile.email
    );
    setFilteredAttendenceDataByEmail(filterAttendence);
    setFilteredAttendenceData(filterAttendence);
  }, [allAttendenceData, profile]);

  // Date select
  const handleSelect = (date) => {
    let filtered = filteredAttendenceDataByEmail.filter((workStatus) => {
      let statusDate = new Date(workStatus["date"]);
      return (
        statusDate >= date.selection.startDate &&
        statusDate <= date.selection.endDate
      );
    });
    setStartDate(date.selection.startDate);
    setEndDate(date.selection.endDate);
    setFilteredAttendenceData(filtered);
  };

  //Select date range
  const selectionRange = {
    startDate: startDate,
    endDate: endDate,
    key: "selection",
  };

  //Select date and filter data
  const handleSelectSpecificDate = (date) => {
    setSelectedDate(date);

    const formattedDate = date.toISOString().split("T")[0];

    const filtered = filteredAttendenceDataByEmail.filter(
      (item) => item.date === formattedDate
    );
    setFilteredAttendenceData(filtered);
  };

  //handle Delete
  const handleDelete = (id) => {
    const deleteConfirm = window.confirm("Want to delete?");
    if (deleteConfirm) {
      deleteAttendence(id);
    }
  };

  // Add work status handler
  const handleSubmitAttendence = ({ date, status }) => {
    const attendance = {
      // Attendance data
      date,
      status,
      time: new Date().toLocaleTimeString(),
      // User info
      employeeEmail: profile?.email,
      employeeImg: profile?.img,
      employeeName: profile?.name,
    };
    // Call the function to add attendence
    addAttendence(attendance);
  };
  // Attendence added effects
  useEffect(() => {
    if (attendenceSuccess) {
      toast.success("Record Submitted", { id: "add-attendence" });
    }
    if (attendenceLoading) {
      toast.loading("Loading", { id: "add-attendence" });
    }
  }, [attendenceLoading, attendenceSuccess]);

  //Delete Effects
  useEffect(() => {
    if (isSuccess) {
      toast.success("Deleted Successfully", { id: "delete-attendence" });
    }
    if (isLoading) {
      toast.loading("Loading", { id: "delete-attendence" });
    }
  }, [isSuccess, isLoading]);

  return (
    <div className="content-wrapper">
      <div className="row">
        <div className="col-md-12">
          <div className="heading">
            <h2>
              <span>Attendance Report</span>{" "}
              <i class="fa-solid fa-clipboard-user"></i>
            </h2>
          </div>

          <div className="row mb-5">
            <div className="col-lg-12 col-md-12 col-sm-12">
              <div className="row mb-3">
                <div className="col-lg-8 col-md-12 col-sm-12">
                  <div className="date-picker-wrapper mb-3">
                    <div className="table-responsive d-flex">
                      <div className="date-range">
                        <DateRangePicker
                          direction="horizontal"
                          rangeColors={["blue"]}
                          showDateDisplay={false}
                          showMonthAndYearPickers={false}
                          ranges={[selectionRange]}
                          onChange={handleSelect}
                        />
                      </div>
                    </div>
                    <div className="date-select">
                      <DatePicker
                        inline
                        open={true}
                        selected={selectedDate}
                        onChange={handleSelectSpecificDate}
                      />
                    </div>
                  </div>
                </div>
                <div className="col-lg-4 col-md-12 col-sm-12">
                  <>
                    <div className="apply-attendence-wrapper">
                      <h6>Attendence</h6>
                      <div className="attendence-form">
                        <div className="attendence-form">
                          <form onSubmit={handleSubmit(handleSubmitAttendence)}>
                            <div className="row">
                              <div className="col-md-12">
                                <label>Date</label>
                                <br />
                                <input
                                  required
                                  type="date"
                                  // defaultValue={new Date()
                                  //   .toJSON()
                                  //   .slice(0, 10)}
                                  // min={new Date().toISOString().slice(0, 10)}
                                  // max={new Date().toISOString().slice(0, 10)}
                                  {...register("date")}
                                />
                              </div>
                              <div className="col-md-12">
                                <label for="status">Status</label>
                                <br />
                                <select required {...register("status")}>
                                  <option value="present">Present</option>
                                  <option value="absent">Absent</option>
                                </select>
                              </div>
                              <div className="col-md-12">
                                <button className="attendence-submit-btn">
                                  Submit
                                </button>
                              </div>
                            </div>
                          </form>
                        </div>
                      </div>
                    </div>
                  </>
                </div>
              </div>
            </div>
            <div className="col-lg-12 col-md-12 col-sm-12">
              {filteredAttendenceData?.length > 0 ? (
                <>
                  <div className="table-responsive">
                    <table class="table-modify table table-striped">
                      <thead>
                        <tr>
                          <th>Image</th>
                          <th>Name</th>
                          <th>Date</th>
                          <th>Time</th>
                          <th>Status</th>
                          <th className="action-area">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredAttendenceData?.map((attendence) => (
                          <tr key={attendence?._id}>
                            <td>
                              <img
                                className="employee-img"
                                src={attendence?.employeeImg}
                                alt="employee"
                              />
                            </td>
                            <td>{attendence?.employeeName}</td>
                            <td>{attendence?.date}</td>
                            <td>{attendence?.time}</td>
                            <td>
                              <span
                                className={
                                  attendence?.status === "present"
                                    ? "border border-success p-1 rounded"
                                    : "border border-danger p-1 rounded"
                                }
                              >
                                {attendence?.status}
                              </span>
                            </td>

                            <td>
                              <button
                                onClick={() => handleDelete(attendence._id)}
                                className="delete-btn"
                              >
                                <i className="fas fa-trash-alt"></i>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              ) : (
                <>
                  <h6>No Data Found</h6>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      <GoBack />
    </div>
  );
};

export default AttendenceReport;
