
import { useGetProfileByIdQuery } from "../../features/profile/profileApi";
import "./chat-header.scss"; // Make sure this path is correct

const ChatHeader = ({recipientId}) => {
  //Get user by email Api
  const { data: recipientData } = useGetProfileByIdQuery(recipientId);

  const recipient = recipientData?.data;


  return (
    <div className="chat-header">
      <div className="user text-white">
       <img src={recipient?.img} alt="recipient" />
        <h6>{recipient?.name}</h6>
      </div>
      <div className="audio-video-wrapper">
        <button><i class="fa-solid fa-phone"></i></button>
        <button><i class="fa-solid fa-video"></i></button>
      </div>
    </div>
  );
};

export default ChatHeader;