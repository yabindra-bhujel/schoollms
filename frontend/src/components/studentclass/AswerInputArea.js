import React, { useState } from "react";
import ReactQuill from "react-quill";


const AnswerFrom = ({ value, onChange, isDeadlinePassed }) => {
    const toolbarOptions = {
      toolbar: [
        [{ header: [1, 2, 3] }],
        ["bold", "italic", "underline", "removeFormat"],
        [{ list: "ordered" }, { list: "bullet" }],
        [{ align: [] }],
      ],
    };
    return (
      <div>
        <div>
          <ReactQuill
            modules={{
              toolbar: toolbarOptions.toolbar,
            }}
            value={value}
            onChange={(content) => onChange(content)}
            readOnly={isDeadlinePassed}
          />
        </div>
      </div>
    );
  };
  
export default AnswerFrom;
