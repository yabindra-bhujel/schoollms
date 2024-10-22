import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import './style/table.css';
import { updateSubmission } from './AssigemntService';

export default function DataTable({ submissions = [] }) {
  const { t } = useTranslation();
  const [editingRows, setEditingRows] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  const handleEditCellChange = (id, value) => {
    const parsedValue = value !== '' ? parseFloat(value) : ''; // Parse the input value to a float
    setEditingRows(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        grade: parsedValue, // Use 'grade' instead of 'score'
        isEditing: value !== '',
      },
    }));
  };

  const handleSave = (id) => {
    const editedData = editingRows[id];
    if (!editedData) return;

    // Find the submission data and update the 'grade'
    const submission = submissions.find((s) => s.id === id);
    if (!submission) return;

    const updatedSubmission = {
      ...submission,
      grade: editedData.grade, // Use 'grade' instead of 'score'
    };

    try {
      updateSubmission([updatedSubmission]);
      setSuccessMessage(t('gradesUpdatedSuccessfully'));
      setTimeout(() => setSuccessMessage(''), 3000);
      
      // Clear the editing state
      setEditingRows(prev => ({
        ...prev,
        [id]: {
          ...prev[id],
          isEditing: false,
        },
      }));
    } catch (err) {
      alert(t('errorUpdatingGrades'));
    }
  };

  return (
    <div className="table-container">
      {successMessage && <div className="success-message">{successMessage}</div>}

      <table className="data-table">
        <thead>
          <tr>
            <th>{t('studentId')}</th>
            <th>{t('fullName')}</th>
            <th>{t('submissionDate')}</th>
            <th>{t('grade')}</th> {/* Change 'score' to 'grade' */}
            <th>{t('submittedFileHeader')}</th>
            <th>{t('actions')}</th>
          </tr>
        </thead>
        <tbody>
          {submissions.map((submission) => {
            const isEditing = editingRows[submission.id]?.isEditing || false;
            const grade = editingRows[submission.id]?.grade ?? submission.grade; // Use 'grade' here

            return (
              <tr key={submission.id}>
                <td>{submission.student_id}</td>
                <td>{submission.student_name}</td>
                <td>{submission.submission_datetime}</td>
                <td>
                  <input
                    type="number"
                    value={grade} // Bind to 'grade'
                    onChange={(e) => handleEditCellChange(submission.id, e.target.value)}
                    className="score-input"
                  />
                </td>
                <td>
                  {submission.assignment_submission_file_url?.map((fileObj, index) => (
                    <div key={index}>
                      <a href={fileObj.file} target="_blank" rel="noopener noreferrer">
                        {fileObj.file.split('/').pop()}
                      </a>
                    </div>
                  ))}
                </td>
                <td>
                  {isEditing && (
                    <button onClick={() => handleSave(submission.id)} className="save-button">
                      {t('save')}
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
