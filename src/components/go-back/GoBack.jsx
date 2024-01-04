import React from "react";
import { useNavigate } from "react-router-dom";

const GoBack = () => {
  let navigate = useNavigate();

  const goBack = () => {
    navigate(-1);
  };

  return (
    <div className="row">
      <div className="col-lg-12">
        <div className="back-btn-area">
          <button className="common-btn" onClick={goBack}>Back</button>
        </div>
      </div>
    </div>
  );
};

export default GoBack;
