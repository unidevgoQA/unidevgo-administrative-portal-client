import React from "react";
import { useForm } from "react-hook-form";

const UpdateProfile = () => {
  const { handleSubmit, control, register } = useForm();

  const onSubmit = (data) => {
    const image = data.image[0];
    console.log(data, image); // You can process the form data here
  };
  return (
    <div className="table-wrapper-content">
      {/* <div className="container"> */}
      <div className="row">
        <div className="col-md-12">
          <div className="heading">
            <h2>
              <span>Update Profile</span> <i class="fa-solid fa-file-pen"></i>
            </h2>
          </div>
          <div className="add-form">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="row">
                <div className="col-md-6">
                  <label>Name</label>
                  <input {...register("name")} />
                </div>
                <div className="col-md-6">
                  <label>Desgination</label>
                  <input {...register("desgination")} />
                </div>
                <div className="col-md-6">
                  <label>Joining Date</label>
                  <input type="date" {...register("joining-date")} />
                </div>

                <div className="col-md-6">
                  <label for="hour">Mobile</label>
                  <input type="number" {...register("mobile")} />
                </div>
                <div className="col-md-6">
                  <label>Upload Image</label>
                  <input
                    {...register("image")}
                    className="file"
                    type="file"
                    required
                    accept="image/*"
                  />
                </div>

                <div className="col-md-6">
                  <label for="gender">Gender</label>
                  <select {...register("gender")}>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>
                <div className="col-md-12">
                  <label>Address</label>
                  <input {...register("address")} />
                </div>

                <div className="col-md-6">
                  <button className="submit-btn">Update Profile</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
      {/* </div> */}
    </div>
  );
};

export default UpdateProfile;
