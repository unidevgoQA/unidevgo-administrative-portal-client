import React from "react";
import "./empty-chat-container.scss";

const EmptyChatContainer = () => {
  return (
    <>
      <div className="empty-chat-container-wrapper">

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
