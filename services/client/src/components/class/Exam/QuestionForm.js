import React, {useState} from "react";
import "./style/createExam.css";
import { CiCircleRemove } from "react-icons/ci";
import { IoMdRemoveCircle } from "react-icons/io";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useTranslation } from "react-i18next";



const QuestionForm = (props) => {
  const { t } = useTranslation();
  
    const toolbarOptions = {
        toolbar: [
          [{ header: [1, 2, 3] }],
          ["bold", "italic", "underline", "removeFormat"],
          [{ list: "ordered" }, { list: "bullet" }],
          [{ align: [] }],
          ["link"],
          ["image"],
    
            
        ],
      };




  return (
    <div className="question-input">
      <form>
        <label>{props.label}</label>
        <div className="input-remove">

        <ReactQuill
        className="question-text-editer"
        placeholder={t("createExam.inputQuestion")}
                  theme="snow"
                  value={props.value}
                  onChange={(value) => props.onChange(value)}
                  modules={{
                    toolbar: toolbarOptions.toolbar,
                  }}
                />


     
         <button
          className="remove-question-button"
          onClick={() => props.onRemove()}  
        >
          <CiCircleRemove className="question-remove-button" />
        </button>
        </div>

        <select
          className="answer-type-select"
          value={props.answerType}
          onChange={(e) => props.onAnswerTypeChange(e.target.value)}
        >
            <option value="">{t("createExam.questiontype")}</option>
          <option value="short-answer">{t("createExam.shortAnswer")}</option>
          <option value="long-answer">{t("createExam.longAnswer")}</option>

        </select>
       
      </form>
    </div>
  );
};

export default QuestionForm;
