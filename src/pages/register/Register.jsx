import React, { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";
import { useAddProfileMutation } from "../../features/profile/profileApi";
import { AuthContext } from "../../providers/AuthProviders";

const Register = () => {
  const { createUser } = useContext(AuthContext);
  //Api
  const [addProfile] = useAddProfileMutation();
  //
  const { handleSubmit, register, reset } = useForm();
  //Error state
  const [showError, setShowError] = useState("");
  const [disableErrorArea, setDisableErrorArea] = useState(false);
  //Imgbb key
  const imgBBkey = import.meta.env.VITE_IMGBB_API_KEY;

  const navigate = useNavigate();

  //Register Handler
  const onSubmit = (data) => {
    const image = data.image[0];
    const formData = new FormData();
    formData.append("image", image);
    createUser(data.email, data.password)
      .then((result) => {
        if (result.user) {
          console.log("email firebase" , result.user.email)
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
                  joiningDate: data.joiningDate,
                  mobile: data.mobile,
                  address: data.address,
                  email: data.email,
                  role: "employee",
                };
                addProfile(profile);
                toast.success("Register Successfully",{id:"add-profile"});
                reset();
                navigate("/");
                
              }
            });
        }
      })
      .catch((err) => setShowError(err.message));
  };

  return (
    <div className="login-register">
      <div className="container">
        <div className="row g-0 login-regsiter-content-wrapper">
          <div className="col-lg-6 col-md-12">
            <div className="login-regsiter-right-content">
              <h4>Register Your Account</h4>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="input-wrapper">
                  <input
                    required
                    type="text"
                    placeholder="Your Email"
                    {...register("email")}
                  />
                  <i class="fa-solid fa-envelope"></i>
                </div>
                <div className="input-wrapper">
                  <input
                    required
                    type="password"
                    placeholder="Your Password"
                    {...register("password")}
                  />
                  <i class="fa-solid fa-lock"></i>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <label>Name</label>
                    <input required {...register("name")} />
                  </div>
                  <div className="col-md-6">
                    <label>Desgination</label>
                    <input required {...register("desgination")} />
                  </div>
                  <div className="col-md-6">
                    <label>Joining Date</label>
                    <input required type="date" {...register("joiningDate")} />
                  </div>

                  <div className="col-lg-6 col-md-12">
                    <label for="hour">Mobile</label>
                    <input required type="text" {...register("mobile")} />
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
                    <select
                      required
                      className="gender-selection"
                      {...register("gender")}
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                  </div>
                  <div className="col-md-12">
                    <label>Address</label>
                    <input required {...register("address")} />
                  </div>
                </div>

                {showError && (
                  <div className={disableErrorArea === true ? "hide-error-message":"error-message"}>
                    <>
                      <span>{showError}</span>
                      <i onClick={()=>setDisableErrorArea(true)} class="fa-solid fa-xmark"></i>
                    </>
                  </div>
                )}

                <button className="login-register-btn" type="submit">
                  Register <i class="fa-solid fa-arrow-right"></i>
                </button>
              </form>
              <hr />
              <div className="other-action">
                {/* <h4>Or Register With</h4>

                <button
                  onClick={handleGoogleLogin}
                  className="login-register-btn"
                >
                  {" "}
                  Google
                  <i class="fa-brands fa-google"></i>
                </button>
                <hr /> */}
                <div className="login-register-navigation">
                  <h4>Already have account ?</h4>
                  <Link to={"/"}>
                    Login <i class="fa-solid fa-arrow-right"></i>{" "}
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="login-regsiter-left-content">
              <img src={logo} alt="logo" />
              <h2>
                Administrative <br /> Portal
              </h2>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
