import React from "react";
import "./style/exam.css";

const ShortQuestion = ({ question }) => {
  return (
    <div>
      {question?.map((q,index) => (
        <div key={q.id} className="short-question">
          <div className="question">
          <div>{`Q.${index + 1}`}</div>
      <div dangerouslySetInnerHTML={{ __html: q.questions[0]?.question }}></div>
          </div>
          <div className="answer">
            <textarea className="answer-area"></textarea>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ShortQuestion;
