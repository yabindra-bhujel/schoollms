import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import './style/table.css';
import { updateSubmission } from './AssigemntService';

export default function DataTable({ submissions = [] }) {
  const { t } = useTranslation();
  const [editingRows, setEditingRows] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  const handleEditCellChange = (id, value) => {
    const parsedValue = value !== '' ? parseFloat(value) : '';
    setEditingRows(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        grade: parsedValue,
        isEditing: value !== '',
      },
    }));
  };

  const handleSave = (id) => {
    const editedData = editingRows[id];
    if (!editedData) return;

    const submission = submissions.find((s) => s.id === id);
    if (!submission) return;

    const updatedSubmission = {
      ...submission,
      grade: editedData.grade,
    };

    try {
      updateSubmission([updatedSubmission]);
      setSuccessMessage("点数が更新されました。");
      setTimeout(() => setSuccessMessage(''), 3000);
      
      setEditingRows(prev => ({
        ...prev,
        [id]: {
          ...prev[id],
          isEditing: false,
        },
      }));
    } catch (err) {
      alert("点数の更新中にエラーが発生しました...." );
    }
  };

  return (
    <div className="table-container">
      {successMessage && <div className="success-message">{successMessage}</div>}

      {/* TODO: make only show table if submission is have . */}
      <table className="data-table">
        <thead>
          <tr>
            <th>{t('studentId')}</th>
            <th>{t('fullName')}</th>
            <th>{t('submissionDate')}</th>
            <th>{t('grade')}</th> 
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
                    value={grade}
                    onChange={(e) => handleEditCellChange(submission.id, e.target.value)}
                    className="score-input"
                  />
                </td>
                <td>
                  {submission.files?.map((fileObj, index) => (
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
