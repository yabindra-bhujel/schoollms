import React from "react";
import { formatTimeDifference } from "../Helper";

const MessageList = ({ messages,  messageRef,  sender_userId}) => {
    return (
        <div>
            <div className="chat_body">
            {messages.map((message) => (
              <div
                key={message.timestamp}
                className={
                  message.sender === sender_userId
                    ? "message_sender"
                    : "message_receive"
                }
              >
                {message.image && <img src={message.image} alt="Sent" />}
                <p>{message.message}</p>
                <small>{formatTimeDifference(message.timestamp)}</small>
              </div>
            ))}
            <div ref={messageRef} />
          </div>
        </div>

    );
}


export default MessageList;