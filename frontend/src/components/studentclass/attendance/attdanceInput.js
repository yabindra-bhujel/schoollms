import React, { useState, useEffect } from "react";
import Alert from '@mui/material/Alert';
import "./style/attendance.css";
import getUserInfo from "../../../api/user/userdata";
import instance from "../../../api/axios";
import { useTranslation } from "react-i18next";

const AttendanceInput = () => {
    const { t } = useTranslation();
    const [code, setCode] = useState("");
    const studentID = getUserInfo().username;
    const [message, setMessage] = useState("");
    const [alertType, setAlertType] = useState("info");

    const markAttendance = async () => {

        if (!code) {
            setMessage(t("messages.invalidCode"));
            setAlertType("error");
            return;
        }

        const data = {
            "attendance_code": code,
            "student_id": studentID
        };

        const endpoint = '/course/mark_attendance/';
        try {
            const response = await instance.post(endpoint, data);
            if (response.status === 200) {
                setMessage(t("messages.alreadyMarked"));
                setAlertType("warning");
                
            } else if (response.status === 201) {
                setMessage(t("messages.markedSuccessfully"));
                setAlertType("success");
                
            }
        } catch (err) {
            if (err.response) {
                if (err.response.status === 404) {
                    setMessage(t("messages.codeNotFound"));
                } else if (err.response.status === 400) {
                    setMessage(t("messages.badRequest"));
                } else {
                    setMessage(t("messages.unexpectedError"));
                }
                setAlertType("error");
            } else if (err.request) {
                setMessage(t("messages.noResponse"));
                setAlertType("error");
            } else {
                setMessage(t("messages.errorSendingRequest"));
                setAlertType("error");
            }
        }

    };

    useEffect(() => {
        let timer;
        if (message) {
            timer = setTimeout(() => {
                setMessage("");
            }, 3000);
        }
        return () => clearTimeout(timer);
    }, [message]);

    return (
        <div className="attendacne-code">
            {message && (
                <Alert severity={alertType} style={{ marginBottom: '20px' }}>
                    {message}
                </Alert>
            )}

            <div className="attendacne-title">
                <h1>{t("messages.enterCode")}</h1>
            </div>

            <div className="attendance-form">
                <input
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    type="text"
                    placeholder={t("messages.enterCode")}
                />
                <button onClick={markAttendance}>{t("messages.send")}</button>
            </div>
        </div>
    );
};

export default AttendanceInput;
