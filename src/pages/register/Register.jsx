import axios from "axios";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";

const Register = () => {
  //State
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  //React Hook Form
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm();
  //Error state
  const [showError, setShowError] = useState("");

  //Imgbb key
  const imgBBkey = import.meta.env.VITE_IMGBB_API_KEY;

  const navigate = useNavigate();

  //Register Handler
  const onSubmit = async (data, e) => {
    e.preventDefault();
    setLoading(true);
  
    if (data.name.trim().length === 0 || data.designation.trim().length === 0) {
      toast.error("Provide valid input", { id: "register-profile" });
      setLoading(false);
      return;
    }
  
    if (!data.email.endsWith("@unidevgo.com")) {
      toast.error("Invalid email domain. Registration failed. Must use unidevgo email", { id: "register-profile" });
      setLoading(false);
      return;
    }
  
    try {
      const image = data.image[0];
      const formData = new FormData();
      formData.append("image", image);
  
      const url = `https://api.imgbb.com/1/upload?key=${imgBBkey}`;
      const imgRes = await fetch(url, {
        method: "POST",
        body: formData,
      });
  
      const imgData = await imgRes.json();
  
      if (imgData.success) {
        const profile = {
          name: data.name,
          designation: data.designation,
          gender: data.gender,
          img: imgData.data.url,
          joiningDate: data.joiningDate,
          mobile: data.mobile,
          address: data.address,
          email: data.email,
          password : data.password,
          role: "employee",
          profileEditPermission: "false",
          appointmentPermission: "false",
        };

        console.log(profile)
  
        const res = await axios.post(`${import.meta.env.VITE_BASE_URL}auth/register`, profile);
        console.log('Registration Successful', res.data);
  
        toast.success("Register Successfully", { id: "register-profile" });
        reset();
        navigate("/");
      } else {
        throw new Error("Image upload failed");
      }
    } catch (err) {
      console.error('Registration Failed', err.message || err.response.data);
      toast.error('Registration failed', { id: "register-profile" });
    }
  
    setLoading(false);
  };
  

  //
  useEffect(() => {
    if (showError) {
      toast.error(showError);
    }
  }, [showError]);

  useEffect(() => {
    if (loading) {
      toast.loading("Loading", { id: "register-profile" });
    }
  }, [loading]);

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
                      {...register("name", { required: true, maxLength: 30 })}
                    />
                    {errors.name &&
                      errors.name.type === "maxLength" &&
                      toast.error("Max length 30 exceeded", {
                        id: "register-name-field",
                      })}
                  </div>
                  <div className="col-md-6">
                    {/* <label>Desgination</label>
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
                      })} */}

                    <label for="desgination">Designation</label>
                    <select
                      required
                      className="gender-selection"
                      {...register("designation")}
                    >
                      <option value="Software QA Engineer">
                        Software QA Engineer
                      </option>
                      <option value="Software Engineer">
                        Software Engineer
                      </option>

                      <option value="Junior Software QA Engineer">
                        Junior Software QA Engineer
                      </option>

                      <option value="Junior Software Engineer">
                        Junior Software Engineer
                      </option>
                      <option value="Senior Software QA Engineer">
                        Senior Software QA Engineer
                      </option>
                      <option value="Senior Software Engineer">
                        Senior Software Engineer
                      </option>
                      <option value="Technical Lead">Technical Lead</option>
                    </select>
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
                    <input
                      required
                      {...register("address", {
                        required: true,
                        maxLength: 50,
                      })}
                    />
                    {errors.address &&
                      errors.address.type === "maxLength" &&
                      toast.error("Max length 50 exceeded", {
                        id: "register-address-field",
                      })}
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
