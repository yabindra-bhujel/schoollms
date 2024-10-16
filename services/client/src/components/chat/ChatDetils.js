import React from "react";
import "./style/chatdetailse.css";
import NotSeleteChat from "./NotSeleteChat";
import GroupChat from "./group/GroupChat";
import PrivateChat from "./private/PrivateChat";

const ChatDetails = ({ selectedChat, onlineUsers }) => {
  const isGroupChat = selectedChat?.type === "group";
  console.log(onlineUsers);

  return (
    <div className="chat-details">
      {isGroupChat ? (
        <GroupChat selectedChat={selectedChat} />
      ) : (

        <PrivateChat selectedChat={selectedChat} onlineUsers={onlineUsers} />
      )}
    </div>
  )
}

export default ChatDetails;


  