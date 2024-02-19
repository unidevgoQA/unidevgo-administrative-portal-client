import React from "react";
import { useForm } from "react-hook-form";
import "./book-an-appoinment.scss";

const BookAnAppointment = () => {

  const currentYear = new Date().getFullYear();

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm();

  const handleSubmitAppointment = ({
    name,
    mobile,
    email,
    member,
    date,
    time,
    message,
  }) => {
    const appointment = {
      //Appoitment data
      name,
      mobile,
      email,
      member,
      date,
      time,
      message,
    };

    console.log(appointment);
  };
  return (
    <div className="book-an-appointment">
      <div className="container">
        <div className="row">
          <div className="col-lg-8 offset-lg-2 col-md-12 col-sm-12">
            <div className="book-an-appointment-form-wrapper">
              <form onSubmit={handleSubmit(handleSubmitAppointment)}>
                <div className="row">
                  <div className="col-md-6">
                    <label>Name</label>
                    <input
                      required
                      type="text"
                      {...register("name", {
                        required: true,
                        maxLength: 50,
                      })}
                    />
                    {errors.name && errors.name.type === "maxLength" && (
                      <div style={{ color: "red" }}>
                        Max length of 50 exceeded
                      </div>
                    )}
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
                    <label>Email</label>
                    <input
                      name="email"
                      required
                      type="email"
                      placeholder="Your Email"
                      {...register("email")}
                    />
                  </div>

                  <div className="col-md-6">
                    <label for="member">Available Members</label>
                    <select required {...register("member")}>
                      <option value="x">X</option>
                    </select>
                  </div>

                  <div className="col-md-6">
                    <label for="date">Date</label>
                    <input
                      required
                      type="date"
                      {...register("date")}
                      min={`${currentYear}-01-01`}
                      max={`${currentYear + 1}-12-31`}
                    />
                  </div>
                  <div className="col-md-6">
                    <label for="date">Time</label>
                    <input required type="time" {...register("time")} />
                  </div>

                  <div className="col-md-12">
                    <label for="message">Message</label>
                    <textarea
                      required
                      {...register("message", {
                        required: true,
                        maxLength: 1000,
                      })}
                    />
                    {errors.message && errors.message.type === "maxLength" && (
                      <div style={{ color: "red" }}>
                        Max length of 1000 exceeded
                      </div>
                    )}
                  </div>
                  <div className="col-md-6">
                    <button className="submit-btn">Submit </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookAnAppointment;
