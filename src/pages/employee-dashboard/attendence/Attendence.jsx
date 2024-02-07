import React, { useContext, useEffect, useState } from "react";
import { DateRangePicker } from "react-date-range";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import GoBack from "../../../components/go-back/GoBack";
import {
  useAddAttendenceMutation,
  useDeleteAttendenceMutation,
  useGetAllAttendenceQuery,
} from "../../../features/attendence/attendenceApi";
import { useGetProfileByEmailQuery } from "../../../features/profile/profileApi";
import { AuthContext } from "../../../providers/AuthProviders";
import "./attendence.scss";

const Attendence = () => {
  const { data } = useGetAllAttendenceQuery();
  const allAttendence = data?.data;
  // Delete API
  const [deleteAttendence, { isSuccess, isLoading }] =
    useDeleteAttendenceMutation();
  // User
  const { user } = useContext(AuthContext);

  // Get user by email API
  const { data: userData } = useGetProfileByEmailQuery(user.email);
  const registerUser = userData?.data;

  // States
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [filteredAttendenceData, setFilteredAttendenceData] = useState([]);
  const [filteredAttendenceDataByEmail, setFilteredAttendenceDataByEmail] =
    useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  // Calculate total pages
  const totalPages = Math.ceil(filteredAttendenceData?.length / itemsPerPage);

  // Determine the range of items to display for the current page
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredAttendenceData?.slice(
    indexOfFirstItem,
    indexOfLastItem
  );


  // Change page
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

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

  // Add work status handler
  const handleSubmitAttendence = ({ date, status }) => {
    // Check if the function has been called today
    const lastDate = localStorage.getItem("lastAttendanceDate");
    const currentDate = new Date().toISOString().slice(0, 10);

    if (lastDate !== currentDate) {
      // Add work status handler
      const attendance = {
        // Attendance data
        date,
        status,
        time: new Date().toLocaleTimeString(),
        // User info
        employeeEmail: registerUser?.email,
        employeeImg: registerUser?.img,
        employeeName: registerUser?.name,
      };

      // Call the function to add attendance
      addAttendence(attendance);

      // Update the last date in localStorage
      localStorage.setItem("lastAttendanceDate", currentDate);
    } else {
      toast.error("Attendance already submitted for today.");
    }
  };

  useEffect(() => {
    const filterAttendenceByEmail = allAttendence?.filter(
      (attendence) => attendence.employeeEmail === user.email
    );
    const filterAttendence = filterAttendenceByEmail?.slice().reverse();
    setFilteredAttendenceDataByEmail(filterAttendence);
    setFilteredAttendenceData(filterAttendence);
  }, [allAttendence]);

  // Date select
  const handleSelect = (date) => {
    let filtered = filteredAttendenceDataByEmail?.filter((workStatus) => {
      let statusDate = new Date(workStatus["date"]);
      return (
        statusDate >= date.selection.startDate &&
        statusDate <= date.selection.endDate
      );
    });
    setStartDate(date.selection.startDate);
    setEndDate(date.selection.endDate);
    setFilteredAttendenceData(filtered);
    setCurrentPage(1); // Reset to first page when date filter changes
  };

  // Select date range
  const selectionRange = {
    startDate: startDate,
    endDate: endDate,
    key: "selection",
  };

  // Select date and filter data
  const handleSelectSpecificDate = (date) => {
    setSelectedDate(date);

    const formattedDate = date.toISOString().split("T")[0];

    const filtered = filteredAttendenceDataByEmail.filter(
      (item) => item.date === formattedDate
    );
    setFilteredAttendenceData(filtered);
    setCurrentPage(1); // Reset to first page when date filter changes
  };

  // Handle Delete
  const handleDelete = (id) => {
    const deleteConfirm = window.confirm("Want to delete?");
    if (deleteConfirm) {
      deleteAttendence(id);
    }
  };

  //Show all data handler
  const showAllData = () => {
    setFilteredAttendenceData(filteredAttendenceDataByEmail);
    setCurrentPage(1);
    setStartDate(null);
    setEndDate(null);
  };

  // Attendence added effects
  useEffect(() => {
    if (attendenceSuccess) {
      toast.success("Record Submitted", { id: "add-attendance" });
    }
    if (attendenceLoading) {
      toast.loading("Loading", { id: "add-attendance" });
    }
  }, [attendenceLoading, attendenceSuccess]);

  // Delete Effects
  useEffect(() => {
    if (isSuccess) {
      toast.success("Deleted Successfully", { id: "delete-attendance" });
    }
    if (isLoading) {
      toast.loading("Loading", { id: "delete-attendance" });
    }
  }, [isSuccess, isLoading]);

  console.log(currentItems)

  return (
    <div className="content-wrapper">
      <div className="row">
        <div className="col-md-12">
          <div className="heading">
            <h2>
              <span>Attendance</span>{" "}
              <i className="fa-solid fa-clipboard-user"></i>
            </h2>
          </div>

          <div className="row">
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
                  {registerUser?.role === "employee" && (
                    <div className="apply-attendance-wrapper-employee">
                      <h6>Attendance</h6>
                      <div className="attendance-form">
                        <form onSubmit={handleSubmit(handleSubmitAttendence)}>
                          <div className="row">
                            <div className="col-md-12">
                              <label>Date</label>
                              <br />
                              <input
                                required
                                type="date"
                                defaultValue={new Date().toJSON().slice(0, 10)}
                                min={new Date().toISOString().slice(0, 10)}
                                max={new Date().toISOString().slice(0, 10)}
                                {...register("date")}
                              />
                            </div>
                            <div className="col-md-12">
                              <label htmlFor="status">Status</label>
                              <br />
                              <select required {...register("status")}>
                                <option value="present">Present</option>
                                <option value="absent">Absent</option>
                              </select>
                            </div>
                            <div className="col-md-12">
                              <button className="attendance-submit-btn">
                                Submit
                              </button>
                            </div>
                          </div>
                        </form>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="col-lg-12 col-md-12 col-sm-12">
              <button className="show-all-data" onClick={showAllData}>
                Show all
              </button>
              {currentItems?.length > 0 ? (
                <>
                  <div className="table-responsive">
                    <table className="table-modify table table-striped">
                      <thead>
                        <tr>
                          <th>Image</th>
                          <th>Date</th>
                          <th>Time</th>
                          <th>Status</th>
                          <th className="action-area">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentItems?.map((attendance) => (
                          
                          <tr key={attendance?._id}>
                            <td>
                              <img
                                className="employee-img"
                                src={
                                  attendance?.employeeImg
                                    ? attendance?.employeeImg
                                    : defaultImg
                                }
                                alt="employee"
                              />
                            </td>
                            <td>{attendance?.date?.split('-').reverse().join('-')}</td>
                            <td>{attendance?.time?.replace(/:\d{2}\s/, ' ')}</td>
                            <td>
                              <span
                                className={`border p-1 rounded ${
                                  attendance?.status === "present"
                                    ? "border-success"
                                    : "border-danger"
                                }`}
                              >
                                {attendance?.status}
                              </span>
                            </td>
                            <td>
                              <button
                                onClick={() => handleDelete(attendance._id)}
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
                  {/* Pagination controls */}
                  <div className="pagination">
                    {/* Previous button */}
                    <button
                      className="pagination-btn"
                      onClick={() => paginate(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      Prev
                    </button>

                    {/* Page buttons */}
                    {Array.from({ length: totalPages }).map((_, index) => (
                      <button
                        key={index}
                        onClick={() => paginate(index + 1)}
                        className={`pagination-btn ${
                          currentPage === index + 1 ? "active" : ""
                        }`}
                      >
                        {index + 1}
                      </button>
                    ))}

                    {/* Next button */}
                    <button
                      className="pagination-btn"
                      onClick={() => paginate(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </button>
                  </div>
                </>
              ) : (
                <h6>No Data Found</h6>
              )}
            </div>
          </div>
        </div>
      </div>
      <GoBack />
    </div>
  );
};

export default Attendence;
