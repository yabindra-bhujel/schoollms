import React, { useCallback } from "react";
import ReactQuill from "react-quill";
import { debounce } from "lodash";

const toolbarOptions = {
  toolbar: [
    [{ header: [2, 3, 4, false] }],
    ["bold", "italic", "underline", "removeFormat"],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ align: [] }],
  ],
};

const AnswerFrom = ({ value, onChange, isDeadlinePassed }) => {
  const debouncedOnChange = useCallback(
    debounce((content) => {
      onChange(content);
    }, 300),
    []
  );

  return (
    <div>
      <ReactQuill
        modules={{
          toolbar: toolbarOptions.toolbar,
        }}
        value={value}
        onChange={debouncedOnChange}
        readOnly={!isDeadlinePassed}
      />
    </div>
  );
};

export default AnswerFrom;
