import React from "react";
import { BsSend, BsEmojiSmile } from "react-icons/bs";
import { IoIosAdd } from "react-icons/io";
import { BiImageAdd } from "react-icons/bi";

const WriteMessage = (
    {
        newmessage,
        setNewmessage,
        handleClick,
        Send,
        handleFileButtonClick,
        imageRef,
        handleFileChange
    }
) => {
    return (
        
        <div className="write_message" onClick={handleClick}>
        <button className="file_add_btn" disabled>
          <IoIosAdd className="file_add" />
        </button>
        <textarea
          value={newmessage}
          onChange={(e) => setNewmessage(e.target.value)}
          className="textarea__message"
          placeholder="Write a message"
          onKeyPress={(event) => {
            event.key === "Enter" && Send();
          }}
        ></textarea>

        <div className="write__message__button">
          <button className="emoji-btn" disabled>
            <BsEmojiSmile className="emoji" />
          </button>
          <button disabled className="emoji-btn">
            <BiImageAdd className="emoji" />
          </button>
          <input
            type="file"
            ref={imageRef}
            style={{ display: "none" }}
            onChange={handleFileChange}
          />

          <button className="send" onClick={Send}>
            <BsSend className="send_btn" />
          </button>
        </div>
      </div>
    )

}

export default WriteMessage;