import React from "react";
import userImg from "../../../assets/employee.jpg";
import { useGetWorkTasksQuery } from "../../../features/work-status/workStatus";

const WorkStatus = () => {

   //Get all task
   const { data: workStatusData } = useGetWorkTasksQuery();


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
              <span>Work Status</span> <i class="fa-solid fa-battery-half"></i>{" "}
            </h2>
          </div>
          <table class="table-modify table table-striped">
            <thead>
              <tr>
                <th>Employee</th>
                <th className="task">Task</th>
                <th>Date</th>
                <th>Hours Of Work</th>
                <th>Status</th>
                <th className="description">Desciption</th>
                <th className="action-area">Action</th>
              </tr>
            </thead>
            <tbody>
              {workStatusData?.data.map((work) => (
                <tr>
                  <td>
                    <img
                      className="employee-img"
                      src={work?.employeeImg}
                      alt="employee"
                    />
                  </td>
                  <td>{work?.task}</td>
                  <td>{work?.date}</td>
                  <td>{work?.hour}</td>
                  <td>{work?.workStatus}</td>
                  <td>{work?.description}</td>
                  <td>
                    <button className="update-btn text-white">
                      {work.workStatus == "in progress"
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
  );
};

export default WorkStatus;
