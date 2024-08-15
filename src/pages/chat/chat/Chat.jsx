import React, { useState } from 'react';
import ChatContainer from '../chat-container/ChatContainer';
import ContactsContainer from '../contacts-container/ContactsContainer';
import EmptyChatContainer from '../empty-chat-container/EmptyChatContainer';
import './chat.scss';

const Chat = () => {

   // State to hold the selected user ID
   const [recipientId, setRecipientId] = useState(null);

  console.log(recipientId)
  return (
    <div className='chat-wrapper'>
      <ContactsContainer setRecipientId={setRecipientId} />
      {recipientId ? (
        <ChatContainer recipientId={recipientId} />
      ) : (
        <EmptyChatContainer />
      )}
    </div>
  )
}

export default Chat