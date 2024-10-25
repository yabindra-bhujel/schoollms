import React, { useState, useEffect } from "react";
import "./style/AssigmentUpdateForm.css";
import ReactQuill from "react-quill";
import instance from "../../api/axios";
import Alert from "@mui/material/Alert";

const AssignmentUpdateForm = ({
  assignment,
  assignmentID,
  getAssignmentData,
}) => {
  const [isEdit, setIsEdit] = useState(false);
  const [message, setMessage] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    start_date: "",
    deadline: "",
    questions: [],
  });

  const toolbarOptions = {
    toolbar: [
      [{ header: [2, 3, 4, false] }],
      ["bold", "italic", "underline", "strike", "removeFormat"],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ align: [] }],
      [{ font: [] }],
      [{ size: ["small", false, "large", "huge"] }],
      ["link", "image", "video"],
      ["clean"],
    ],
  };

  const updateAssigemntData = async (formData) => {
    try {
      const endpoint = `/assignments/update-assignment/${assignmentID}/`;
      const response = await instance.put(endpoint, formData);
      if (response.status === 200) {
        getAssignmentData();
        setMessage("課題更新されました。");
        setTimeout(() => {
          setMessage(null);
        }, 3000);
      } else {
        setMessage("課題の更新中にエラーが発生しました。");
        setTimeout(() => {
          setMessage(null);
        }, 3000);
      }
    } catch {
      setMessage("課題の更新中にエラーが発生しました。");
      setTimeout(() => {
        setMessage(null);
      }, 3000);
    }
  };

  useEffect(() => {
    if (assignment) {
      setFormData({
        title: assignment.title,
        description: assignment.description,
        start_date: assignment.start_date,
        deadline: assignment.deadline,
        questions: assignment.questions,
      });
    }
  }, [assignment]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDescriptionChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      description: value,
    }));
  };

  const formateDatetime = (datetime) => {
    const date = new Date(datetime);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const formatted = `${year}-${month < 10 ? `0${month}` : month}-${
      day < 10 ? `0${day}` : day
    } ${hours < 10 ? `0${hours}` : hours}:${
      minutes < 10 ? `0${minutes}` : minutes
    }`;
    return formatted;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateAssigemntData(formData);
    setIsEdit(false);
  };

  const handleEdit = () => {
    if (!assignment.is_active) {
      setMessage("課題の期限が過ぎているため変更できません。");
      setTimeout(() => {
        setMessage(null);
      }, 3000);
      return;
    }
    setIsEdit((prevIsEdit) => !prevIsEdit);
  };

  return (
    <>
      {message && (
        <Alert variant="filled" severity="info">
          {message}
        </Alert>
      )}
      <div className="assignment-update">
        <button className="assignment-edit-btn" onClick={handleEdit}>
          {isEdit ? "キャンセル" : "編集"}
        </button>
        <form className="assignment-edit-form" onSubmit={handleSubmit}>
          <div>
            <label className="form-lable">課題タイトル</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              disabled={!isEdit}
            />
          </div>
          <div>
            <label className="form-lable">課題開始日時</label>
            <input
              type="datetime-local"
              name="start_date"
              value={formateDatetime(formData.start_date)}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="form-lable">締切</label>
            <input
              type="datetime-local"
              name="deadline"
              value={formateDatetime(formData.deadline)}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="form-lable">課題詳細</label>
            <ReactQuill
              theme="snow"
              value={formData.description}
              onChange={handleDescriptionChange}
              readOnly={!isEdit}
              modules={{
                toolbar: toolbarOptions.toolbar,
              }}
              style={{
                minHeight: "100px",
                maxHeight: "300px",
                border: "none",
              }}
            />
          </div>
          {assignment.assigment_type === "Text" && (
            <>
              <label className="form-lable">質問一覧</label>
              {formData.questions.map((question, index) => (
                <div key={question.id}>
                  <ReactQuill
                    theme="snow"
                    value={question.question}
                    readOnly
                    modules={{
                      toolbar: toolbarOptions.toolbar,
                    }}
                    style={{
                      minHeight: "100px",
                      maxHeight: "300px",
                      border: "none",
                    }}
                  />
                </div>
              ))}
            </>
          )}

          {isEdit && (
            <button className="assignment_update" type="submit">
              課題返信
            </button>
          )}
        </form>
      </div>
    </>
  );
};

export default AssignmentUpdateForm;
