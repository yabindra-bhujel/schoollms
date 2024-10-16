import React from "react";
import { formatTimeDifference } from "../Helper";

const MessageList = ({ messages,  groupmessageRef, currentUser}) => {
    return (
        <div>
            <div className="chat_body">


            {messages.map((message) => (
                <div
                    key={message.id}
                    className={
                        message.sender_userId === currentUser
                            ? "message_sender"
                            : "message_receive"
                    }
                >
                    <p>{message.message}</p>
                    <small>{formatTimeDifference(message.timestamp)}</small>
                </div>
            )
            )}

            <div ref={groupmessageRef} />
        </div>
        </div>

    );
}


export default MessageList;