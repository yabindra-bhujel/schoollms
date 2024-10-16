import React from "react";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import IconButton from "@mui/material/IconButton";
import UserNoImage from "../../images/usernoimage.jpeg";

const ChatHeader = (
    {selectedChat, isOnline}
) => {
    return(
      <div className="do_chat_header">
      <div className="do__chat__left">
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