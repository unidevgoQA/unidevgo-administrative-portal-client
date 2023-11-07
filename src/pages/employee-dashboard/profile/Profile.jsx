import React, { useContext } from "react";
import userImg from "../../../assets/employee.jpg";
import { AuthContext } from '../../../providers/AuthProviders';

import "./profile.scss";
const Profile = () => {
  const {user } = useContext(AuthContext)
   const emp = useContext(AuthContext);
   console.log(emp)

  const userDummy = {
    id: 9,
    img: userImg,
    name: "Sarah Smith",
    designation: "Software QA Engineer",
    mobile: "+880-1634534522",
    email: "sara.smith@gmail.com",
    address: "Dhanmondi , Dhaka",
    joiningDate: "01-06-22",
  };

  const workStatus = [
    {
      id: 1,
      image: userImg,
      task: "develop ui",
      date: "22-11-23",
      hours: "2",
      status: "in progress",
      description:
        " Lorem ipsum dolor sit amet consectetur adipisicing elit. Pariatur, perferendis amet. Aperiam, esse obcaecati! Placeat adipisci similique modi cum neque.",
    },
    {
      id: 1,
      image: userImg,
      task: "develop ui",
      date: "22-11-23",
      hours: "2",
      status: "in progress",
      description:
        " Lorem ipsum dolor sit amet consectetur adipisicing elit. Pariatur, perferendis amet. Aperiam, esse obcaecati! Placeat adipisci similique modi cum neque.",
    },
    {
      id: 1,
      image: userImg,
      task: "develop ui",
      date: "22-11-23",
      hours: "2",
      status: "in progress",
      description:
        " Lorem ipsum dolor sit amet consectetur adipisicing elit. Pariatur, perferendis amet. Aperiam, esse obcaecati! Placeat adipisci similique modi cum neque.",
    },
    {
      id: 1,
      image: userImg,
      task: "develop ui",
      date: "22-11-23",
      hours: "2",
      status: "in progress",
      description:
        " Lorem ipsum dolor sit amet consectetur adipisicing elit. Pariatur, perferendis amet. Aperiam, esse obcaecati! Placeat adipisci similique modi cum neque.",
    },
    {
      id: 1,
      image: userImg,
      task: "develop ui",
      date: "22-11-23",
      hours: "2",
      status: "in progress",
      description:
        " Lorem ipsum dolor sit amet consectetur adipisicing elit. Pariatur, perferendis amet. Aperiam, esse obcaecati! Placeat adipisci similique modi cum neque.",
    },
    {
      id: 1,
      image: userImg,
      task: "develop ui",
      date: "22-11-23",
      hours: "2",
      status: "in progress",
      description:
        " Lorem ipsum dolor sit amet consectetur adipisicing elit. Pariatur, perferendis amet. Aperiam, esse obcaecati! Placeat adipisci similique modi cum neque.",
    },
    {
      id: 1,
      image: userImg,
      task: "develop ui",
      date: "22-11-23",
      hours: "2",
      status: "in progress",
      description:
        " Lorem ipsum dolor sit amet consectetur adipisicing elit. Pariatur, perferendis amet. Aperiam, esse obcaecati! Placeat adipisci similique modi cum neque.",
    },
    {
      id: 1,
      image: userImg,
      task: "develop ui",
      date: "22-11-23",
      hours: "2",
      status: "in progress",
      description:
        " Lorem ipsum dolor sit amet consectetur adipisicing elit. Pariatur, perferendis amet. Aperiam, esse obcaecati! Placeat adipisci similique modi cum neque.",
    },
  ];
  return (
    <div className="content-wrapper">
      <div className="row">
        <div className="col-md-12">
          <div className="heading">
            <h2>
              <span>Profile</span> <i class="fa-solid fa-user-tie"></i>
            </h2>
          </div>
          <div className="profile-current-task-wrapper">
            <div className="row">
              <div className="col-md-6">
                <div className="profile-content-wrapper">
                  <div className="row">
                    <div className="col-md-5">
                      <div className="user-img">
                        <img src={userImg} alt="employee" />
                      </div>
                    </div>
                    <div className="col-md-7">
                      <div className="user-info">
                        <div className="row">
                          <div className="col-md-12">
                            <h2>{userDummy.name}</h2>
                          </div>
                          <div className="col-md-12">
                            <h3>{userDummy.designation}</h3>
                          </div>
                          <div className="col-md-12">
                            <h3>
                              <i class="fa-solid fa-mobile-screen-button"></i>{" "}
                              <span>{userDummy.mobile}</span>
                            </h3>
                          </div>
                          <div className="col-md-12">
                            <h3>
                              <i class="fa-solid fa-envelope-open-text"></i>{" "}
                              <span>{user.email}</span>
                            </h3>
                          </div>
                          <div className="col-md-12">
                            <h3>
                              <i class="fa-solid fa-calendar-days"></i>{" "}
                              <span>{userDummy.joiningDate}</span>
                            </h3>
                          </div>
                          <div className="col-md-12">
                            <h3>
                              <i class="fa-solid fa-location-dot"></i>{" "}
                              <span>{userDummy.address}</span>
                            </h3>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="employee-vailability">
                  <div className="row gy-3">
                    <div className="col-md-6">
                      <div className="attendence employee-card">
                      <i class="fa-solid fa-border-all"></i>
                        <h6>Total Leave</h6>
                        <span>30</span>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="leave-apply employee-card">
                      <i class="fa-solid fa-person-walking-arrow-right"></i>
                        <h6>Leave Apply</h6>
                        <span>20</span>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="late-coming employee-card">
                      <i class="fa-solid fa-check"></i>
                        <h6>Get Leave</h6>
                        <span>20</span>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="absent employee-card">
                      <i class="fa-regular fa-circle-xmark"></i>
                        <h6>Remaining Leave</h6>
                        <span>10</span>
                      </div>
                    </div>
                   
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="my-task-status">
        <div className="row">
          <div className="col-md-12">
            <div className="heading">
              <h2>
                <span>My Work Status</span>{" "}
                <i class="fa-solid fa-battery-half"></i>{" "}
              </h2>
            </div>
            <table class="table-modify table table-striped">
              <thead>
                <tr>
                  <th>Image</th>
                  <th className="task">Task</th>
                  <th>Date</th>
                  <th>Hours Of Work</th>
                  <th>Status</th>
                  <th className="description">Desciption</th>
                  <th className="action-area">Action</th>
                </tr>
              </thead>
              <tbody>
                {workStatus.map((work) => (
                  <tr>
                    <td>
                      <img
                        className="employee-img"
                        src={work?.image}
                        alt="employee"
                      />
                    </td>
                    <td>{work?.task}</td>
                    <td>{work?.date}</td>
                    <td>{work?.hours}</td>
                    <td>{work?.status}</td>
                    <td>{work?.description}</td>
                    <td>
                    <button className="update-btn text-white">
                      {work.status == "in progress"
                        ? "Mark as Complete"
                        : "Mark as in Progress"}
                    </button>

                      <button
                        // onClick={() => handleDelete(employee.id)}
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
        </div>
      </div>
    </div>
  );
};

export default Profile;
