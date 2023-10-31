import React from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/logo.png";
import "./login.css";

const Login = () => {
  return (
    <div className="login-register">
      <div className="container">
        <div className="row g-0 login-regsiter-content-wrapper">
          <div className="col-md-6">
            <div className="login-regsiter-left-content">
              <img src={logo} alt="logo" />
              <h2>
                Administrative <br /> Portal
              </h2>
            </div>
          </div>
          <div className="col-md-6">
            <div className="login-regsiter-right-content">
              <h4>Login Into Your Account</h4>
              <form>
                <div className="input-wrapper">
                  <input type="text" placeholder="Your Email" />
                  <i class="fa-solid fa-envelope"></i>
                </div>
                <div className="input-wrapper">
                  <input type="password" placeholder="Your Password" />
                  <i class="fa-solid fa-lock"></i>
                </div>

                <button className="login-register-btn" type="submit">
                  <span>Login</span> <i class="fa-solid fa-arrow-right"></i>
                </button>
              </form>
              <hr />
              <div className="other-action">
                <h4>Or Login With</h4>

                <button className="login-register-btn">
                  {" "}
                  Google
                  <i class="fa-brands fa-google"></i>  
                </button>
                <hr />
                <div className="login-register-navigation">
                  <h4>Dont have account ?</h4>
                  <Link to={"/register"}>
                    Register <i class="fa-solid fa-arrow-right"></i>{" "}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
