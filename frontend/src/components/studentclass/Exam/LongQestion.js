import React from "react";
import "./style/exam.css";


const LongQuestion = ({ question }) => {
    return (
        <div>
        {question?.map((q,index) => (
            <div key={q.id} className="long-question">
            <div className="longs-question">
            <div>{`Q.${index + 1}`}</div>
        <div dangerouslySetInnerHTML={{ __html: q.questions[0]?.question }}></div>
            </div>
            <div className="long-answer">
                <textarea className="long-answer-area"></textarea>
            </div>
            </div>
        ))}
        </div>
    );
    }
    export default LongQuestion;