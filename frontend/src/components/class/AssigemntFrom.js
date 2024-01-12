import React, { useState } from "react";
import ReactQuill from "react-quill";
import "./style/AssigmentCreate.css";


const AssigmentForm = ({ onQuestionsChange }) => {
  const [questions, setQuestions] = useState([

  ]);

  

  const toolbarOptions = {
    toolbar: [
      [{ header: [1, 2, 3] }],
      ["bold", "italic", "underline", "removeFormat"],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ align: [] }],
      ["link"],
      
    ],
  };

  const handleChange = (value, questionId) => {
    setQuestions((prevQuestions) =>
      prevQuestions.map((question) =>
        question.id === questionId ? { ...question, text: value } : question
      )
    );
    onQuestionsChange(questions);
  };

  const handleAddQuestion = () => {
    const newQuestion = {
      id: questions.length + 1,
      text: "",
    };
    setQuestions((prevQuestions) => [...prevQuestions, newQuestion]);
  };

  const handleRemoveQuestion = (questionId) => {
    setQuestions((prevQuestions) =>
      prevQuestions.filter((question) => question.id !== questionId)
    );
  };

  return (
    <div>
      {questions.map((question) => (
        <div key={question.id}>
          <ReactQuill
            value={question.text}
            onChange={(value) => handleChange(value, question.id)}
            modules={{
              toolbar: toolbarOptions.toolbar,
            }}
          />

          <div className="remove-question">
          <button type="button" onClick={() => handleRemoveQuestion(question.id)}>
            Remove Question
          </button>
          </div>
        </div>
      ))}
      <div className="add_more_filds">
      <button type="button"  onClick={handleAddQuestion}>
        Add Question
      </button>
      </div>
    </div>
  );
};

export default AssigmentForm;
