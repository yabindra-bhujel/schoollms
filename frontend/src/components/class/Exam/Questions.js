import React, { useState } from "react";
import QuestionForm from "./QuestionForm";
import { useTranslation } from "react-i18next";


const Questions = ({questions, setQuestions }) => {
    const { t } = useTranslation();


    const handleChange = (value, questionId) => {
      setQuestions((prevQuestions) =>
        prevQuestions.map((question) =>
          question.id === questionId ? { ...question, text: value } : question
        )
      );
    };
  
    const handleAddQuestion = (e) => {
      e.preventDefault();
      const newQuestion = {
        id: questions.length + 1,
        text: "",
        answerType: "",
      };
      setQuestions((prevQuestions) => [...prevQuestions, newQuestion]);
    };
  
    const handleRemoveQuestion = (questionId) => {
      setQuestions((prevQuestions) =>
        prevQuestions.filter((question) => question.id !== questionId)
      );
    };
  
    const handleAnswerTypeChange = (answerType, questionId) => {
        setQuestions((prevQuestions) =>
          prevQuestions.map((question) =>
            question.id === questionId ? { ...question, answerType } : question
          )
        );
      };
      
  
    return (
      <div>
        {questions.map((question) => (
          <div key={question.id} className="question-input">
            <QuestionForm
              label={`${t("createExam.question")} ${question.id}.`}
              value={question.text}
              onChange={(value) => handleChange(value, question.id)}
              answerType={question.answerType}
              onRemove={() => handleRemoveQuestion(question.id)}
              onAnswerTypeChange={(value) =>
                handleAnswerTypeChange(value, question.id)
              }
            
            />
          </div>
        ))}
  
        <div className="add-question-button">
          <button onClick={handleAddQuestion}>
            <span> {t("createExam.addmore")}</span>
          </button>
        </div>
      </div>
    );
  };
  
  export default Questions;
  