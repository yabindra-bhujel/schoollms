import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import instance from "../../api/axios";
import getUserInfo from "../../api/user/userdata";
import { useTranslation } from "react-i18next";


const Comment = () => {
  const { id } = useParams();
  const user_id = getUserInfo();
  const user = user_id.user_id;
  const { t }  = useTranslation();

  const [comments, setComments] = useState([]);

  const initialComment = {
    comment: "",
    user: user,
    video_id: id,
  };

  const [newComment, setNewComment] = useState(initialComment);

  const submitComment = async () => {
    const endpoint = "/video_learning/addcomment/";
    const res = await instance.post(endpoint, newComment);
    setNewComment(initialComment);
    getVideoURL();
  };

  const getVideoURL = async () => {
    const endpoint = `/video_learning/${id}/`;
    const res = await instance.get(endpoint);
    const comment_data = res.data.comments;
    setComments(comment_data);
  };

  useEffect(() => {
    getVideoURL();
  }, []);

  const isVallidFrom = () => {
    return newComment.comment !== ""; // Check if the comment field is not empty
  };

  const handleComment = (e) => {
    setNewComment({ ...newComment, comment: e.target.value });
  };

  return (
    <>
      <div className="comment">
        <div className="comment-box">
          {comments.map((comment, index) => (
            <div key={index} className="comment-list">
              <div className="comment-box-img">
                <img src={comment.user_profile.image} alt="User" />
              </div>
              <div className="comment-box-text">
                <h3>
                  {comment.user.first_name} {comment.user.last_name}
                </h3>
                <p>{comment.comment}</p>
                <br />
              </div>
            </div>
          ))}
        </div>

        <div className="comment-input">
          <input
            type="text"
            placeholder={t("leave_your_comment")}
            value={newComment.comment}
            onChange={handleComment}
          />
          
          {isVallidFrom() && <button className="css-button-fully-rounded--sand" onClick={submitComment}>{t("comment_post_btn")}</button>}
        </div>
      </div>
    </>
  );
};

export default Comment;
