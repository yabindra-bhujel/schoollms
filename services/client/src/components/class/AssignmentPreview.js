import React from "react";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import { colors } from "@mui/material";

const AssignmentPreview = ({ formData }) => {
  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  };

  return (
    <Paper style={{ padding: "16px", marginBottom: "16px" }}>
      {/* <Box border={1} borderRadius={5} padding={2} marginBottom={2}>
        <Typography variant="h5" style={{ fontWeight: "bold", color: "#3f51b5" }}>
          課題プレビュー
        </Typography>
      </Box> */}
      <Box border={1} borderRadius={5} padding={2} marginBottom={2}>
        <input
          type="text"
          value={formData.assignment_title}
          disabled
          style={{ width: "90%", marginBottom: "8px"}}
        />
        <div
          dangerouslySetInnerHTML={{ __html: formData.assignment_description }}
          style={{
            width: "91%",
            minHeight: "100px",
            border: "1px solid #ccc",
            padding: "8px",
            overflowY: "scroll" 
          }}
        />
      </Box>
      <Box border={1} borderRadius={5} padding={2}>
        <Typography variant="body1">
          <p>課題</p> 
          <input type="text" value={formData.assignment_type} disabled style={
            formData.assignment_type === "file" ? { color: colors.red[500] } : { color: colors.green[500] }
          } />
        </Typography>
        <Typography variant="body1">
          <p>締め切り</p> 
          <input type="text" value={formatDate(new Date(formData.assignment_deadline))} disabled />
        </Typography>
        <Typography variant="body1">
          <p>最高点</p> 
          <input type="text" value={formData.max_grade} disabled />
        </Typography>
        <Typography variant="body1">
          <p>開始日</p> 
          <input type="text" value={formatDate(new Date(formData.assignment_start_date))} disabled />
        </Typography>
      </Box>
    </Paper>
  );
};

export default AssignmentPreview;
