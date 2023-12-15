import React, { useContext, useEffect, useState } from "react";
import { DateRangePicker } from "react-date-range";
import defaultImg from "../../../assets/default.png";
import { useDeleteAttendenceMutation, useGetAllAttendenceQuery } from "../../../features/attendence/attendenceApi";
import { AuthContext } from "../../../providers/AuthProviders";

const Attendence = () => {
  const { data } = useGetAllAttendenceQuery();
  const allAttendence = data?.data;
  //Delete API
  const [deleteAttendence, { isSuccess, isLoading }] =
    useDeleteAttendenceMutation();
  //User
  const { user } = useContext(AuthContext);
  
  //Filter leaves based on email
  const filterAttendence = allAttendence?.filter(
    (attendence) => attendence.employeeEmail === user.email
  );

  //States
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [profile, setProfile] = useState({});
  const [filteredAttendenceData, setFilteredAttendenceData] = useState([]);
  const [filteredAttendenceDataByEmail, setFilteredAttendenceDataByEmail] =
    useState([]);

  useEffect(() => {
    const filterAttendence = allAttendence?.filter(
      (attendence) => attendence.employeeEmail === user.email
    );
    setFilteredAttendenceDataByEmail(filterAttendence);
    setFilteredAttendenceData(filterAttendence);
  }, [allAttendence, profile]);

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

  //handle Delete
  const handleDelete = (id) => {
    const deleteConfirm = window.confirm("Want to delete?");
    if (deleteConfirm) {
      deleteAttendence(id);
    }
  };

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
              <span>Attendence Report</span>{" "}
              <i class="fa-solid fa-clipboard-user"></i>
            </h2>
          </div>

          <div className="row mb-5">
            <div className="col-lg-12 col-md-12 col-sm-12">
              <div className="row">
                <div className="col-lg-4 col-md-12 col-sm-12">
                  <div className="date-picker-wrapper">
                    <div className="table-responsive">
                      <div className="date-range">
                        {/* <button
                    className="show-all-task-btn"
                    onClick={() => showAllData()}
                  >
                    All
                  </button> */}
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
                  </div>
                </div>
                <div className="col-lg-8 col-md-12 col-sm-12">
                  <div style={{ width: "100%", height: "100%" }}>
               
                  </div>
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
                                src={
                                  attendence?.employeeImg
                                    ? attendence?.employeeImg
                                    : defaultImg
                                }
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
    </div>
  );
};

export default Attendence;
