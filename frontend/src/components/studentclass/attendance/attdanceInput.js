import React, { useState, useEffect } from "react";
import Alert from '@mui/material/Alert';
import "./style/attendance.css";
import getUserInfo from "../../../api/user/userdata";
import instance from "../../../api/axios";
import { useTranslation } from "react-i18next";
import OtpInput from 'react-otp-input';

const AttendanceInput = () => {
    const { t } = useTranslation();
    const [code, setCode] = useState(Array(6).fill(""));
    const studentID = getUserInfo().username;
    const [message, setMessage] = useState("");
    const [alertType, setAlertType] = useState("info");

    const markAttendance = async () => {

        if (!code.every(digit => digit !== "")) {
            setMessage(t("messages.invalidCode"));
            setAlertType("error");
            return;
        }

        const data = {
            "attendance_code": code.join(""),
            "student_id": studentID
        };

        const endpoint = '/course/mark_attendance/';
        try {
            const response = await instance.post(endpoint, data);
            if (response.status === 200) {
                setMessage(t("messages.alreadyMarked"));
                setAlertType("warning");
                setCode(Array(6).fill(""));

            } else if (response.status === 201) {
                setMessage(t("messages.markedSuccessfully"));
                setAlertType("success");
                setCode(Array(6).fill(""));

            }
        } catch (err) {
            if (err.response) {
                if (err.response.status === 404) {
                    setMessage(t("messages.codeNotFound"));
                    setCode(Array(6).fill(""));

                } else if (err.response.status === 400) {
                    setMessage(t("messages.badRequest"));
                    setCode(Array(6).fill(""));

                } else {
                    setMessage(t("messages.unexpectedError"));
                    setCode(Array(6).fill(""));

                }
                setAlertType("error");
                setCode(Array(6).fill(""));

            } else if (err.request) {
                setMessage(t("messages.noResponse"));
                setAlertType("error");
                setCode(Array(6).fill(""));

            } else {
                setMessage(t("messages.errorSendingRequest"));
                setAlertType("error");
                setCode(Array(6).fill(""));

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
        <div
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
                marginTop: "20px"
            }}
            className="attendance-code">
            {message && (
                <Alert severity={alertType} style={{ marginBottom: '20px' }}>
                    {message}
                </Alert>
            )}

            <div className="attendance-title" style={
                {
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "column",
                    marginBottom: "20px"
                }
            }>
                <h1>{t("messages.enterCode")}</h1>
            </div>
            <div className="attendance-form">
                <OtpInput
                    value={code.join("")}
                    onChange={(otp) => setCode(otp.split(""))}
                    numInputs={6}
                    renderSeparator={<span> - </span>}
                    renderInput={(props) => <input {...props} />}/>
                <button style={{
                        marginTop: "20px",
                        padding: "10px 20px",
                        backgroundColor: "#007bff",
                        color: "white",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer",
                        minWidth: "100px"}
                } onClick={markAttendance}>{t("messages.send")}</button>
            </div>
        </div>
    );
};

export default AttendanceInput;
