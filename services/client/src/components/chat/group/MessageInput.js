import React from "react";
import { BsSend, BsEmojiSmile } from "react-icons/bs";
import { IoIosAdd } from "react-icons/io";

const WriteMessage = (
    { groupnewmessage, setGroupnewmessage, sendGroupMessage }
) => {
    return (
        
        <div className="write_message" >
            <button className="file_add_btn" disabled>
                <IoIosAdd className="file_add" />
            </button>
            <textarea
                value={groupnewmessage}
                onChange={(e) => setGroupnewmessage(e.target.value)}
                className="textarea__message"
                placeholder="Write a message"
                onKeyPress={(event) => {
                    event.key === "Enter" && sendGroupMessage();
                }}
            ></textarea>

            <div className="write__message__button">
                <button className="emoji-btn" disabled>
                    <BsEmojiSmile className="emoji" />
                </button>
                <button className="send" onClick={sendGroupMessage}>
                    <BsSend className="send_btn" />
                </button>
            </div>
        </div>
    )

}

export default WriteMessage;