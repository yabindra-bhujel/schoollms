import React, { useState } from "react";
import { TextField, Button, Box, Typography } from "@mui/material";
import { useLocation, useNavigate } from 'react-router-dom';
import instance from "../../../api/axios";
import jwtDecode from "jwt-decode";
import axios from 'axios';
import Cookies from "js-cookie";






const OtpInput = () => {
    const [otp, setOtp] = useState("");
    const location = useLocation();
    const username = location.state?.username; 
    const password = location.state?.password;
    const navigate = useNavigate();



    const handleOtpChange = (event) => {
        setOtp(event.target.value);
    };



    const handleConfirmOtp = async () => {
        if (otp === "") {
            alert("Please enter OTP");
            return;
        }
        


        try {
            const endpoint = `http://127.0.0.1:8000/verify_otp/${otp}/`;

            const csrftoken = Cookies.get("csrftoken");
      
    
    
            const response = await axios.post(endpoint, {
              withCredentials: true,
              headers: {
                "X-CSRFToken": csrftoken,

    
              },
            });
       
        } catch (e) {
            alert("Invalid OTP");
            setOtp("");
        }
        
    };

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '100vh',
            }}
        >
            <Typography variant="h4" gutterBottom>
                OTP Verification
            </Typography>
            <Typography variant="subtitle1" sx={{ marginBottom: 2 }}>
                An OTP will be sent to your email address for verification.
            </Typography>
           
                <>
                    <TextField
                        label="Enter OTP"
                        variant="outlined"
                        value={otp}
                        onChange={handleOtpChange}
                        inputProps={{ maxLength: 6 }}
                        sx={{ marginBottom: 2 }}
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleConfirmOtp}
                        sx={{ marginBottom: 2 }}
                    >
                        Confirm OTP
                    </Button>
                </>
            
        </Box>
    );
};

export default OtpInput;
