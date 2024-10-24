import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import './style/table.css';
import { updateSubmission } from './AssigemntService';

export default function TextDataTable({ submissions = [] }) {
  const { t } = useTranslation();
  const [editingRows, setEditingRows] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  const handleEditCellChange = (id, value) => {
    setEditingRows(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        grade: value,
        isEditing: value !== '',
      },
    }));
  };

  const handleSave = (id) => {
    const editedSubmissions = Object.entries(editingRows).map(([id, editData]) => {
      const submission = submissions.find((s) => s.id.toString() === id);
      return {
        ...submission,
        ...editData,
      };
    });

    if (editedSubmissions.length === 0) return;

    try {
      updateSubmission(editedSubmissions);
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
      alert(t('errorUpdatingGrades'));
    }
  };

  const rows = submissions.map((submission) => ({
    id: submission.id.toString(),
    student_id: submission.student_id,
    student_name: submission.student_name,
    submission_datetime: submission.submission_datetime,
    is_submitted: submission.is_submitted ? t('submitted') : t('notSubmitted'),
    grade: editingRows[submission.id]?.grade ?? submission.grade,
    isEditing: editingRows[submission.id]?.isEditing && editingRows[submission.id].score !== '',
    file: submission.assignment_answer
      ? [
          {
            name: submission.assignment_answer.split('/').pop(),
            url: submission.assignment_answer,
          },
        ]
      : [],
  }));

  return (
    <div className="table-container">
      {successMessage && (
        <div className="success-message">
          {successMessage}
        </div>
      )}
      <table className="data-table">
        <thead>
          <tr>
            <th>{t('studentId')}</th>
            <th>{t('fullName')}</th>
            <th>{t('submissionDate')}</th>
            <th>{t('score')}</th>
            <th>{t('submittedFileHeader')}</th>
            <th>Action</th> 
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              <td>{row.student_id}</td>
              <td>{row.student_name}</td>
              <td>{row.submission_datetime}</td>
              <td>
                <input
                  type="number"
                  value={row.grade}
                  onChange={(e) => handleEditCellChange(row.id, e.target.value)}
                  className="score-input"
                />
              </td>
              <td>
                {row.file.map((fileObj, index) => (
                  <div key={index}>
                    <a href={fileObj.url} target="_blank" rel="noopener noreferrer">
                      {fileObj.name}
                    </a>
                  </div>
                ))}
              </td>
              <td>
                {row.isEditing && (
                  <button onClick={() => handleSave(row.id)} className="save-button">
                    保存
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
