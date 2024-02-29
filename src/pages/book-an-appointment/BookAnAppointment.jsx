import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import Select from "react-select";
import logo from "../../assets/logo.png";
import { useAppointmentConfirmationEmailMutation } from "../../features/appointment/appointment";
import { useGetProfilesQuery } from "../../features/profile/profileApi";
import "./book-an-appoinment.scss";

const BookAnAppointment = () => {
  const [selectedMember, setSelectedMember] = useState(null);

  const [appointmentConfirmationEmail, { isLoading, isSuccess }] =
    useAppointmentConfirmationEmailMutation();

  const [baseUrl, setBaseUrl] = useState("");

  useEffect(() => {
    const getBaseUrl = () => {
      const { protocol, host } = window.location;
      setBaseUrl(`${protocol}//${host}`);
    };

    getBaseUrl();
  }, []);

  const meetingUrl = `${baseUrl}/meeting`;

  const currentYear = new Date().getFullYear();
  //Api
  const { data } = useGetProfilesQuery();
  //set data
  const employees = data?.data;
  //Filter appointment permission members
  const appointmentPermissionMembers = employees?.filter(
    (employee) => employee?.appointmentPermission == "true"
  );

  const [phoneNumber, setPhoneNumber] = useState("");

  const handlePhoneNumberChange = (event) => {
    const inputValue = event.target.value;

    // Check if the input matches the allowed pattern
    if (/^[0-9+]{0,15}$/.test(inputValue)) {
      setPhoneNumber(inputValue);
    } else {
      // Display an alert for invalid input
      toast.error(
        "Invalid input. Please enter only numbers and the plus symbol (+), up to 15 characters.",{id:'book-appointment'}
      );
    }
  };

  const {
    handleSubmit,
    register,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

  const handleSubmitAppointment = ({
    name,
    email,
    member,
    date,
    time,
    message,
  }) => {
    const appointment = {
      //Appoitment data
      name,
      mobile : phoneNumber,
      email,
      recipients: [member],
      selectMemberName: selectedMember?.value?.name,
      selectMemberDesignation: selectedMember?.value?.desgination,
      meetingUrl,
      date,
      time,
      message,
    };

    if (name.trim().length === 0 || name.trim().length === 0) {
      toast.error("Provide valid input", { id: "book-appointment" });
    } else if (message.trim().length === 0 || message.trim().length === 0) {
      toast.error("Provide valid input", { id: "book-appointment" });
    } else {
      const confirmSubmit = window.confirm(
        "Would you like to schedule this appointment?"
      );
      if (confirmSubmit) {
        appointmentConfirmationEmail(appointment);
        reset();
        toast.success("Appointment Successfully Booked", { id: "appointment" });
        setValue(null);
        setSelectedMember(null);
        setPhoneNumber("");
      }
    }
  };

  const options = appointmentPermissionMembers?.map((employee) => ({
    value: {
      email: employee?.email,
      name: employee?.name,
      desgination: employee?.desgination,
    },
    label: (
      <div className="select-wrapper">
        {employee?.img && (
          <img
            className="select-img"
            src={employee?.img}
            alt={`Avatar of ${employee?.name}`}
          />
        )}
        <div className="name-designation-wrapper">
          <span>{employee?.name}</span>
          <span>{employee?.desgination}</span>
        </div>
      </div>
    ),
  }));

  const handleMemberChange = (selectedOption) => {
    setValue("member", selectedOption?.value.email);
    setSelectedMember(selectedOption);
  };

  // Appointment effects
  // useEffect(() => {
  //   if (isSuccess) {
  //     toast.success("Appointment Successfully Booked", { id: "appointment" });
  //   }
  //   if (isLoading) {
  //     toast.loading("Loading", { id: "appointment" });
  //   }
  // }, [isSuccess, isLoading]);

  return (
    <div className="book-an-appointment">
      <div className="container">
        <div className="row">
          <div className="col-lg-10 offset-lg-1 col-md-12 col-sm-12">
            <div className="book-an-appointment-form-wrapper">
              <div className="logo-heading-wrapper">
                <img className="logo-img" src={logo} alt="logo" />
                <h2>Book An Appointment</h2>
              </div>
              <form onSubmit={handleSubmit(handleSubmitAppointment)}>
                <div className="row">
                  <div className="col-lg-6 col-md-12">
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
                    <label htmlFor="mobile">Mobile</label>
                    <input
                      name="phoneNumber"
                      required
                      type="tel"
                      id="mobile"
                      pattern="[0-9+]*"
                      title="Please enter only numbers and the plus symbol (+)"
                      value={phoneNumber}
                      onChange={handlePhoneNumberChange}
                    />
                    {/* You can still display other error messages if needed */}
                  </div>
                  <div className="col-md-6">
                    <label>Email</label>
                    <input
                      name="email"
                      required
                      type="email"
                      {...register("email")}
                    />
                  </div>

                  <div className="col-md-6">
                    <label for="member">Available Members</label>
                    <Select
                      required
                      {...register("member")}
                      onChange={handleMemberChange}
                      value={selectedMember}
                      options={options}
                    />
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
                        maxLength:1000,
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
