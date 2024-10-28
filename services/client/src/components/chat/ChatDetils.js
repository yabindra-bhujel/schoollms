import React from "react";
import "./style/chatdetailse.css";
import NotSeleteChat from "./NotSeleteChat";
import GroupChat from "./group/GroupChat";
import PrivateChat from "./private/PrivateChat";

const ChatDetails = ({ selectedChat, onlineUsers, handleBackToList, isMobileView }) => {
  const isGroupChat = selectedChat?.type === "group";
  console.log(onlineUsers);

  return (
    <div className="chat-details">
      {isGroupChat ? (
        <GroupChat selectedChat={selectedChat} handleBackToList={handleBackToList} isMobileView={isMobileView}  />
      ) : (

        <PrivateChat selectedChat={selectedChat} onlineUsers={onlineUsers} handleBackToList={handleBackToList} isMobileView={isMobileView}/>
      )}
    </div>
  )
}

export default ChatDetails;


  