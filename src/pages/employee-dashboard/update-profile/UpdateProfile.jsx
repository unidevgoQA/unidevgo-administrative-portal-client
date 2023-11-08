import React, { useContext, useEffect } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useAddProfileMutation } from "../../../features/profile/profileApi";
import { AuthContext } from "../../../providers/AuthProviders";

const UpdateProfile = () => {
  //Imgbb key
  const imgBBkey = import.meta.env.VITE_IMGBB_API_KEY;
  //Api
  const [addProfile , {isLoading,isSuccess}] = useAddProfileMutation();
  //Context
  const {user} = useContext(AuthContext);
  //Form
  const { register, handleSubmit ,reset} = useForm();
  //Add profile handler
  const handleAddProfile = (data) => {
    const image = data.image[0];
    const formData = new FormData();
    formData.append("image", image);
    console.log("Formdata",data)
    const url = `https://api.imgbb.com/1/upload?key=${imgBBkey}`;
    fetch(url, {
      method: "POST",
      body: formData,
    })
      .then((res) => res.json())
      .then((imgData) => {
        if (imgData.success) {
          const profile = {
            name: data.name,
            desgination: data.desgination,
            gender: data.gender,
            img: imgData.data.url,
            joiningDate : data.joiningDate,
            mobile:data.mobile,
            address:data.address,
            email:user.email,
            role:'employee'
          };
          addProfile(profile);
          reset();

        }
      });
  };
  useEffect(() => {
    if (isSuccess) {
      toast.success("Added Successfully",{id:"add-profile"});
    }
    if (isLoading) {
      toast.loading("Loading",{id:"add-profile"});
    }
  }, [isSuccess,isLoading]);

  return (
    <div className="content-wrapper">
      <div className="row">
        <div className="col-md-12">
          <div className="heading">
            <h2>
              <span>Update Profile</span> <i class="fa-solid fa-file-pen"></i>
            </h2>
          </div>
          <div className="add-form">
            <form onSubmit={handleSubmit(handleAddProfile)}>
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
                  <input type="date" {...register("joiningDate")} />
                </div>

                <div className="col-md-6">
                  <label for="hour">Mobile</label>
                  <input type="text" {...register("mobile")} />
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
    </div>
  );
};

export default UpdateProfile;
