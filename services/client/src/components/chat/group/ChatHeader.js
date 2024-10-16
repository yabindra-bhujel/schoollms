import React, { useRef , useEffect} from "react";
import { useTranslation } from "react-i18next";
import NoImage from "../../images/group.png";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import IconButton from "@mui/material/IconButton";

const ChatHeader = (
    {handleGroupImageChange, groupIconImage, selectedChat, handleClicks}
) => {
    const groupImage = useRef(null);
    return(
        <div className="do_chat_header">
        <div className="do__chat__left">
          <div className="profile__pic">
            <button
              onClick={() => groupImage.current && groupImage.current.click()}
            >
              <label htmlFor="profile-image">
                <input
                  ref={groupImage}
                  onChange={handleGroupImageChange}
                  type="file"
                  id="profile-image"
                  style={{ display: "none" }}
                  accept="image/*"
                />
              </label>
              {selectedChat.image ? (
                <img
                  alt="プロフィール画像"
                  src={groupIconImage || selectedChat.image}
                />
              ) : (
                <img
                  alt="プロフィール画像"
                  src={groupIconImage || NoImage}
                />
              )}

            </button>
          </div>

          <div className="chat_details">
            <h4>{selectedChat.name}</h4>
            <strong>Admin: {selectedChat.admin}</strong> <br />

          </div>
        </div>

        <div className="do__chat__right">
          <IconButton onClick={handleClicks}>
            <MoreHorizIcon />
          </IconButton>

        </div>
      </div>
    )

}

export default ChatHeader;