import exportFromJSON from "export-from-json";
import React, { useEffect, useState } from "react";
import { DateRangePicker } from "react-date-range";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import toast from "react-hot-toast";
import { Link, useParams } from "react-router-dom";
import {
  Area,
  Bar,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import GoBack from "../../../components/go-back/GoBack";
import {
  useDeleteWorkTaskMutation,
  useGetWorkTasksQuery,
  useUpdateWorkTaskMutation,
} from "../../../features/work-status/workStatusApi";

const WorkStatus = () => {
  //APIs
  const { data: workStatusData } = useGetWorkTasksQuery();

  const allStatusData = workStatusData?.data;
  //Update API
  const [
    handleUpdateWorkStatus,
    { isLoading: worksStatusLoading, isSuccess: workStatusSuccess },
  ] = useUpdateWorkTaskMutation();
  //Delete API
  const [deleteWorkStatus, { isSuccess, isLoading }] =
    useDeleteWorkTaskMutation();

  //States
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [profile, setProfile] = useState({});
  const [filteredStatusData, setFilteredStatusData] = useState([]);
  const [filteredStatusDataByEmail, setFilteredStatusDataByEmail] = useState(
    []
  );

  const { id } = useParams();

  //Set url
  const baseUrl = import.meta.env.VITE_BASE_URL;
  const url = `${baseUrl}profile/${id}`;

  const workHoursNumbers = filteredStatusData?.map((work) => {
    const totalHours = parseFloat(work.hour);
    return totalHours;
  });

  const totalWorkHours = workHoursNumbers?.reduce(
    (acc, current) => acc + current,
    0
  );

  //Data load
  useEffect(() => {
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setProfile(data?.data);
      });
  }, [id]);

  useEffect(() => {
    const filterWorkStatusByEmail = allStatusData?.filter(
      (workStatus) => workStatus.employeeEmail === profile.email
    );
    const filterWorkStatus = filterWorkStatusByEmail?.slice().reverse();
    setFilteredStatusDataByEmail(filterWorkStatus);
    setFilteredStatusData(filterWorkStatus);
  }, [allStatusData, profile]);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;
  const [searchedPage, setSearchedPage] = useState("");

  // Calculate total pages
  const totalPages = Math.ceil(filteredStatusData?.length / itemsPerPage);

  // Determine the range of items to display for the current page
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredStatusData?.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  // Change page
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    setSearchedPage("");
  };

  // Handle page search
  const handleSearch = (e) => {
    e.preventDefault();
    const pageNumber = parseInt(searchedPage, 10);
    if (!isNaN(pageNumber) && pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  // Previous page
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      setSearchedPage("");
    }
  };

  // Next page
  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      setSearchedPage("");
    }
  };

  // Date select
  const handleSelect = (date) => {
    let filtered = filteredStatusDataByEmail.filter((workStatus) => {
      let statusDate = new Date(workStatus["date"]);
      return (
        statusDate >= date.selection.startDate &&
        statusDate <= date.selection.endDate
      );
    });
    setStartDate(date.selection.startDate);
    setEndDate(date.selection.endDate);
    setFilteredStatusData(filtered);
  };

  //Select date and filter data
  const handleSelectSpecificDate = (date) => {
    setSelectedDate(date);
    const formattedDate = date.toISOString().split("T")[0];
    const filtered = filteredStatusDataByEmail.filter(
      (item) => item.date === formattedDate
    );
    setFilteredStatusData(filtered);
  };

  //Show all data handler
  const showAllData = () => {
    setFilteredStatusData(filteredStatusDataByEmail);
    setStartDate(null);
    setEndDate(null);
    setCurrentPage(1);
  };
  //Select date range
  const selectionRange = {
    startDate: startDate,
    endDate: endDate,
    key: "selection",
  };

  //Export Work Status
  const exportWorkStatus = () => {
    const fileName = "Work Status";
    const exportType = exportFromJSON.types.xls;

    const combinedData = [
      ...filteredStatusData,
      { TotalHours: totalWorkHours },
    ];
    exportFromJSON({
      data: combinedData,
      fields: {
        employeeName: "NAME",
        task: "TASK",
        date: "DATE",
        hour: "HOURS",
        workStatus: "STATUS",
        description: "DESCRIPTION",
        TotalHours: "TOTAL WORK HOURS",
      },
      fileName,
      exportType,
    });
  };

  //handle Delete
  const handleDelete = (id) => {
    const deleteConfirm = window.confirm("Want to delete?");
    if (deleteConfirm) {
      deleteWorkStatus(id);
    }
  };

  //handle Update
  const handleStatusChange = (id, workStatus) => {
    const updatedStatus =
      workStatus === "complete" ? "in progress" : "complete";
    const updateWorkTask = {
      workStatus: updatedStatus,
    };
    handleUpdateWorkStatus({ id: id, data: updateWorkTask });
  };

  //Delete Effects
  useEffect(() => {
    if (isSuccess) {
      toast.success("Deleted Successfully", { id: "delete-work-task" });
    }
    if (isLoading) {
      toast.loading("Loading", { id: "delete-work-task" });
    }
  }, [isSuccess, isLoading]);

  //Update Effects
  useEffect(() => {
    if (workStatusSuccess) {
      toast.success("Update Successfully", { id: "update-work-task" });
    }
    if (worksStatusLoading) {
      toast.loading("Loading", { id: "update-work-task" });
    }
  }, [workStatusSuccess, worksStatusLoading]);

  return (
    <div className="content-wrapper">
      <div className="row">
        <div className="col-md-12">
          <div className="heading">
            <h2>
              <span>Work Status</span> <i class="fa-solid fa-chart-column"></i>
            </h2>
          </div>

          <div className="row mb-3">
            <div className="col-lg-12 col-md-12 col-sm-12">
              <div className="row align-items-center">
                <div className="col-lg-5 col-md-12 col-sm-12">
                  <div className="date-picker-wrapper">
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
                <div className="col-lg-7 col-md-12 col-sm-12">
                  <div className="chart-wrapper">
                    <div style={{ width: "100%", height: "300px" }}>
                      <ResponsiveContainer>
                        <ComposedChart
                          data={filteredStatusData}
                          margin={{
                            top: 20,
                            right: 20,
                            bottom: 20,
                            left: 0,
                          }}
                        >
                          <CartesianGrid stroke="#F5F5F5" />
                          <XAxis dataKey="date" />
                          <YAxis />
                          <Tooltip />
                          <Area
                            type="monotone"
                            dataKey="task"
                            fill="#8884D8"
                            stroke="#8884D8"
                          />
                          <Bar dataKey="hour" barSize={10} fill="#208436" />
                          <Line
                            type="string"
                            dataKey="workStatus"
                            stroke="#FF7300"
                          />
                        </ComposedChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
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
                    <table class="table-modify table table-striped">
                      <thead>
                        <tr>
                          <th>Employee</th>
                          <th className="task">Task</th>
                          <th>Date</th>
                          <th>Hours Of Work</th>
                          <th>Status</th>
                          <th className="description">Description</th>
                          <th className="action-area">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentItems?.map((work) => (
                          <tr key={work?._id}>
                            <td>
                              <img
                                className="employee-img"
                                src={work?.employeeImg}
                                alt="employee"
                              />
                            </td>
                            <td>{work?.task}</td>
                            <td>
                              {work?.date?.split("-").reverse().join("-")}
                            </td>
                            <td>{work?.hour}</td>
                            <td>{work?.workStatus}</td>
                            <td>{work?.description}</td>
                            <td>
                              <Link
                                to={`/dashboard/update-work-status/${work._id}`}
                              >
                                <button className="edit-btn">
                                  <i className="fas fa-edit"></i>
                                </button>
                              </Link>

                              <button
                                onClick={() => handleDelete(work?._id)}
                                className="delete-btn"
                              >
                                <i className="fas fa-trash-alt"></i>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {/* Pagination controls */}
                    <div className="pagination-main-wrapper">
                      {/* Search field for specific page */}
                      <form className="pagination-form" onSubmit={handleSearch}>
                        <input
                          type="text"
                          value={searchedPage}
                          onChange={(e) => setSearchedPage(e.target.value)}
                          placeholder={`Go to page (1-${totalPages})`}
                        />
                        <button type="submit">Go</button>
                      </form>

                      {/* Pagination buttons 1-5 */}
                      <div>
                        <button
                          className="pagination-btn"
                          onClick={prevPage}
                          disabled={currentPage === 1}
                        >
                          Prev
                        </button>
                        {Array.from({ length: Math.min(5, totalPages) }).map(
                          (_, index) => (
                            <button
                              key={index}
                              onClick={() => paginate(index + 1)}
                              className={`pagination-btn ${
                                currentPage === index + 1 ? "active" : ""
                              }`}
                            >
                              {index + 1}
                            </button>
                          )
                        )}
                        <button
                          className="pagination-btn"
                          onClick={nextPage}
                          disabled={currentPage === totalPages}
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="row mt-3">
                    <div className="col-md-6 col-sm-12">
                      <div className="export-data">
                        <h6>Export data to a xls file ?</h6>
                        <button
                          className="export-btn"
                          onClick={exportWorkStatus}
                        >
                          {" "}
                          Export Work Staus
                        </button>
                      </div>
                    </div>
                    <div className="col-md-6 col-sm-12">
                      <div className="working-hours">
                        {totalWorkHours > 0 && (
                          <h6>
                            Total Work Hours :{" "}
                            <span>{totalWorkHours.toFixed(1)}</span> Hour
                          </h6>
                        )}
                      </div>
                    </div>
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

export default WorkStatus;
