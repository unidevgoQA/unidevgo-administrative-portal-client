import React from "react";
import Lottie from "react-lottie";
import animationData from "../../../assets/lottie-json.json";
import "./empty-chat-container.scss";

const animationDefaultOptions = {
  loop: true,
  autoplay: true,
  animationData: animationData,
};

const EmptyChatContainer = () => {
  return (
    <>
      <div className="empty-chat-container-wrapper">
        <Lottie
          isClickToPauseDisabled={true}
          height={200}
          width={200}
          options={animationDefaultOptions}
        />
        <div className="welcome-wrapper">
          <h3>
            Hi<span>!</span> Welcome to <span>unidevGO</span> Chat
          </h3>
        </div>
      </div>
    </>
  );
};

export default EmptyChatContainer;
