import React from 'react';
import ChatHeader from '../../../components/chat-header/ChatHeader';
import Messagebar from '../../../components/message-bar/Messagebar';
import MessageContainer from '../../../components/message-container/MessageContainer';
import './chat-container.scss';

const ChatContainer = ({ recipientId }) => {
  return (
    <div className='chat-container-wrapper'>
      <ChatHeader recipientId={recipientId}/>
      <MessageContainer recipientId={recipientId}/>
      <Messagebar recipientId={recipientId}/>
    </div>
  )
}

export default ChatContainer