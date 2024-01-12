import React from "react";
import "./style/AssignmentPreview.css";

const AssignmentPreview = ({ formData }) => {

    const formatDate = (date) => {
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Month is 0-indexed
        const day = date.getDate().toString().padStart(2, '0');
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${year}-${month}-${day} ${hours}:${minutes}`;
      };


  return (
    <div >
        <div className="assigment-prev">
            <div className="header">
                <h1>Assignment Preview</h1>
            </div>
            <div className="assigment-body">
            <h3>{formData.assignment_title}</h3>
      <div className="body" dangerouslySetInnerHTML={{__html: formData.assignment_description}}></div>

      <h4>Assignment Type: <small>{formData.assignment_type}</small> </h4>
      <h4>Deadline:  <small>{formatDate(formData.assignment_deadline)}</small></h4>
      <h4>Max Grade: <small>{formData.max_grade}
        </small></h4>
      <h4>Start Date:  <small>{formatDate(formData.assignment_start_date)}
        </small></h4>

            </div>
      
      
    </div>
    </div>
  );
};

export default AssignmentPreview;
