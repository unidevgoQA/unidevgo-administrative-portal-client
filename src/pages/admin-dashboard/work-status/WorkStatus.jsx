import React, { useEffect } from "react";
import toast from "react-hot-toast";
import {
  useDeleteWorkTaskMutation,
  useGetWorkTasksQuery,
  useUpdateWorkTaskMutation,
} from "../../../features/work-status/workStatusApi";

const WorkStatus = () => {
  //APIs
  const { data: workStatusData } = useGetWorkTasksQuery();
  const [
    handleUpdateWorkStatus,
    { isLoading: worksStatusLoading, isSuccess: workStatusSuccess },
  ] = useUpdateWorkTaskMutation();
  const [deleteWorkStatus, { isSuccess, isLoading }] =
    useDeleteWorkTaskMutation();

  //handle Update
  const handleStatusChange = (id, workStatus) => {
    const updatedStatus =
      workStatus === "complete" ? "in progress" : "complete";
    const updateWorkTask = {
      workStatus: updatedStatus,
    };
    handleUpdateWorkStatus({ id: id, data: updateWorkTask });
  };

  //handle Delete
  const handleDelete = (id) => {
    console.log(id);
    const deleteConfirm = window.confirm("Want to delete?");
    if (deleteConfirm) {
      deleteWorkStatus(id);
    }
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
                    <button
                      onClick={() =>
                        handleStatusChange(work?._id, work?.workStatus)
                      }
                      className="update-btn text-white"
                    >
                      {work?.workStatus == "in progress"
                        ? "Mark as Complete"
                        : "Mark as in Progress"}
                    </button>

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
        </div>
      </div>
    </div>
  );
};

export default WorkStatus;
