import React, { useContext } from "react";
import defaultImg from "../../../assets/default.png";
import { useGetAllAttendenceQuery } from "../../../features/attendence/attendenceApi";
import { AuthContext } from "../../../providers/AuthProviders";

const Attendence = () => {
  const { data } = useGetAllAttendenceQuery();
  const allAttendence = data?.data;

  //User
  const { user } = useContext(AuthContext);
  //Filter leaves based on email
  const filterAttendence = allAttendence?.filter(
    (attendence) => attendence.employeeEmail === user.email
  );

  return (
    <div className="content-wrapper">
      <div className="row">
        <div className="col-md-12">
          <div className="heading">
            <h2>
              <span>Attendence</span> <i class="fa-solid fa-clipboard-user"></i>
            </h2>
          </div>
          <div className="attendence-report-wrapper">
            <div className="table-responsive">
              <table class="table-modify table table-striped">
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Name</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Status</th>
             
                  </tr>
                </thead>
                <tbody>
                  {filterAttendence?.map((attendence) => (
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

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Attendence;
