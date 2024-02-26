import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';
import React from 'react';
import { APP_ID, SERVER_SECRET } from '../../zigo/constant';

export default function Meeting() {
    const roomID = "unidevGO";
    let myMeeting = async (element) => {
  
   // generate Kit Token
   const appID = APP_ID;
   const serverSecret = SERVER_SECRET;
   const kitToken =  ZegoUIKitPrebuilt.generateKitTokenForTest(appID, serverSecret, roomID,  Date.now().toString(),  "Enter Your Name");
  
   // Create instance object from Kit Token.
   const zp = ZegoUIKitPrebuilt.create(kitToken);
   // start the call
   zp.joinRoom({
          container: element,
          sharedLinks: [
            {
              name: 'Personal link',
              url:
               window.location.protocol + '//' + 
               window.location.host + window.location.pathname +
                '?roomID=' +
                roomID,
            },
          ],
          scenario: {
           mode: ZegoUIKitPrebuilt.VideoConference,
          },
     });
    };
  
    return (
      <div
        ref={myMeeting}
        style={{ width: '100vw', height: '100vh' }}
      ></div>
    );
  }