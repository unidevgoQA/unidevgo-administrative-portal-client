import React, { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";
import { useAddProfileMutation } from "../../features/profile/profileApi";
import { AuthContext } from "../../providers/AuthProviders";

const Register = () => {
  //State
  const [showPassword, setShowPassword] = useState(false);
  //Context
  const { createUser } = useContext(AuthContext);
  //Api
  const [addProfile] = useAddProfileMutation();
  //
  const {
    handleSubmit,
    register,
    reset,
    control,
    formState: { errors },
  } = useForm();
  //Error state
  const [showError, setShowError] = useState("");
  // const [disableErrorArea, setDisableErrorArea] = useState(false);
  //Imgbb key
  const imgBBkey = import.meta.env.VITE_IMGBB_API_KEY;

  const navigate = useNavigate();

  //Register Handler
  const onSubmit = (data) => {
    const image = data.image[0];
    const formData = new FormData();
    formData.append("image", image);

    if (data.name.trim().length === 0 || data.desgination.trim().length === 0) {
      toast.error("Provide valid input", { id: "register-user" });
    } else {
      if (data.email.endsWith("@unidevgo.com")) {
        createUser(data.email, data.password)
          .then((result) => {
            if (result.user) {
              console.log("email firebase", result.user.email);
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
                    toast.success("Register Successfully", {
                      id: "add-profile",
                    });
                    reset();
                    navigate("/");
                  }
                });
            }
          })
          .catch((err) => setShowError(err.message));
      } else {
        toast.error(
          "Invalid email domain. Registration failed. Must be use unidevgo email"
        );
      }
    }
  };

  //
  useEffect(() => {
    if (showError) {
      toast.error(showError);
    }
  }, [showError]);

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
                    name="email"
                    required
                    type="email"
                    placeholder="Your Email"
                    {...register("email")}
                  />
                  <i class="fa-solid fa-envelope"></i>
                </div>
                <div className="input-wrapper">
                  <input
                    name="password"
                    required
                    type={showPassword ? "text" : "password"}
                    placeholder="Your Password"
                    {...register("password")}
                  />
                  <i
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ cursor: "pointer" }}
                    class="fa-solid fa-eye"
                  ></i>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <label>Name</label>
                    <input
                      required
                      {...register("name", { required: true, maxLength: 25 })}
                    />
                    {errors.name &&
                      errors.name.type === "maxLength" &&
                      toast.error("Max length 25 exceeded", {
                        id: "register-name-field",
                      })}
                  </div>
                  <div className="col-md-6">
                    <label>Desgination</label>
                    <input
                      required
                      {...register("desgination", {
                        required: true,
                        maxLength: 50,
                      })}
                    />
                    {errors.desgination &&
                      errors.desgination.type === "maxLength" &&
                      toast.error("Max length 50 exceeded", {
                        id: "register-designation-field",
                      })}
                  </div>
                  <div className="col-md-6">
                    <label>Joining Date</label>
                    <input required type="date" {...register("joiningDate")} />
                  </div>

                  <div className="col-lg-6 col-md-12">
                    <label for="mobile">Mobile</label>
                    <input
                      name="phoneNumber"
                      required
                      type="tel"
                      id="mobile"
                      pattern="[0-9]{11}"
                      placeholder="01XXXXXXXXX"
                      {...register("mobile")}
                    />
                    {errors.phoneNumber && <p>{errors.phoneNumber.message}</p>}
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

                <button className="login-register-btn" type="submit">
                  Register <i class="fa-solid fa-arrow-right"></i>
                </button>
              </form>
              <hr />
              <div className="other-action">
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
