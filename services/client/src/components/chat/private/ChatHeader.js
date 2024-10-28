import React from "react";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import IconButton from "@mui/material/IconButton";
import UserNoImage from "../../images/usernoimage.jpeg";
import { IoMdArrowRoundBack } from "react-icons/io";


const ChatHeader = (
    {selectedChat, isOnline, isMobileView, handleBackToList}
) => {
    return(
      <div className="do_chat_header">
      <div className="do__chat__left">
      {isMobileView && (
                <IoMdArrowRoundBack className="backBtn" onClick={handleBackToList}/>
            )}
        <div className="profile__pic">
          {selectedChat.image ? (
            <img src={selectedChat.image} alt="Profile" />
          ) : (
            <img src={UserNoImage} alt="Profile" />
          )}
        </div>
        <div className="chat_details">
          <h4>{selectedChat.username}</h4>
          <strong>
            {selectedChat.first_name} {selectedChat.last_name}
          </strong>{" "}
          <br />
          <small>
            {isOnline ? "Active now" : ""}
          </small>
        </div>
      </div>

      <div className="do__chat__right">
        <IconButton>
          <MoreHorizIcon />
        </IconButton>
      </div>
    </div>
    )

}

export default ChatHeader;