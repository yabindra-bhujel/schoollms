import React, { useState, useEffect } from 'react';
import AdminLayout from "../navigation/NavigationLayout";
import { FormHelperText, TextField, Button, Container, Grid } from '@mui/material';
import {Input, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { getDepartementList, addStudent } from './StudentService';

const AddStudent = () => {
    const [imagePreviewUrl, setImagePreviewUrl] = useState('');
    const [departmentNames, setDepartmentNames] = useState([]);

    const [studentData, setStudentData] = useState({
        studentID: '',
        first_name: '',
        last_name: '',
        middle_name: '',
        phone: '',
        date_of_birth: '',
        gender: '',
        department: '1',
      });







    
      useEffect(() => {
        const fetchData = async () => {
          try {
            const response = await getDepartementList();
            // Extract department names from the response
            const names = response.map((department) => department.Department_name);
            setDepartmentNames(names);
          } catch (error) {
            console.error('Error fetching department list:', error);
          }
        };
        fetchData();
      }, []);




      const [errors, setErrors] = useState({});

      const validateForm = () => {
        let isValid = true;
        const newErrors = {};
    
        // Validation rules
        if (!studentData.first_name.trim()) {
          newErrors.first_name = 'First Name is required';
          isValid = false;
        }
    
        if (!studentData.last_name.trim()) {
          newErrors.last_name = 'Last Name is required';
          isValid = false;
        }
    
    
        if (!studentData.phone.trim()) {
          newErrors.phone = 'Phone Number is required';
          isValid = false;
        }
    
        if (!studentData.date_of_birth.trim()) {
          newErrors.date_of_birth = 'Date of Birth is required';
          isValid = false;
        }
    
        if (!studentData.gender.trim()) {
          newErrors.gender = 'Gender is required';
          isValid = false;
        }

        if (!studentData.department.trim()) {
            newErrors.department = 'Department is required';
            isValid = false;
            }
    
        setErrors(newErrors);
        return isValid;
      };


      const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type.match('image.*')) {
          const reader = new FileReader();
          reader.onloadend = () => {
            setImagePreviewUrl(reader.result);
          };
          reader.readAsDataURL(file);
        }
      };

      const handleSubmit = async (e)  => {
        e.preventDefault();
        if (validateForm()) {
         const response = await addStudent(studentData);
            console.log(response);
            if (response.status === 200) {
              alert('Student added successfully');
            } else {
              alert('An error occurred. Please try again.');
            }
        }
      };



      const handleChange = (e) => {
        setStudentData({ ...studentData, [e.target.name]: e.target.value });
      };



  return (
    <AdminLayout>
      <Container>
        <h1>Add Student</h1>
        <form onSubmit={handleSubmit}>

            <h1
            style={{
                marginTop: '20px',
                marginBottom: '20px',
            }}
            >General Information</h1>
          <Grid container spacing={2}>

          <Grid item xs={6}>
              <TextField
                 label="Student ID"
                 variant="outlined"
                 fullWidth
                 name="studentID"
                 value={studentData.studentID}
                 onChange={handleChange}
              />
            </Grid>


            <Grid item xs={6}>
              <TextField
                 label="First Name"
                 variant="outlined"
                 fullWidth
                 name="first_name"
                 value={studentData.first_name}
                 onChange={handleChange}
                 error={!!errors.first_name}
                 helperText={errors.first_name}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Last Name"
                variant="outlined"
                fullWidth
                name="last_name"
                value={studentData.last_name}
                onChange={handleChange}
                error={!!errors.last_name}
                helperText={errors.last_name}
              />
            </Grid>


            <Grid item xs={6}>
              <TextField
                label="Middle Name"
                variant="outlined"
                fullWidth
                name="middlename"
                value={studentData.middle_name}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                label="Phone Number"
                variant="outlined"
                fullWidth
                name="phone"
                value={studentData.phone}
                onChange={handleChange}
                error={!!errors.phone}
                helperText={errors.phone}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Date of Birth"
                variant="outlined"
                fullWidth
                name="date_of_birth"
                type="date"
                InputLabelProps={{
                  shrink: true,
                }}
                value={studentData.date_of_birth}
                onChange={handleChange}
                error={!!errors.date_of_birth}
                helperText={errors.date_of_birth}
              />
            </Grid>

            <Grid item xs={6}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Gender</InputLabel>
                <Select
                  label="Gender"
                  name="gender"
                  value={studentData.gender}
                  onChange={handleChange}
                  error = {!!errors.gender}
                  helperText = {errors.gender}

                >
                  <MenuItem value="Male">Male</MenuItem>
                  <MenuItem value="Female">Female</MenuItem>
                  {/* Add other gender options if necessary */}
                </Select>
              </FormControl>
            </Grid>


            {/* image input filds */}
            <Grid item xs={6}>
                <Input
                  type="file"
                  name="image"
                  onChange={handleImageChange}
                  inputProps={{
                    accept: 'image/*', // Specify accepted file types
                  }}
                />
            </Grid>

             {/* Show selected image */}
        {imagePreviewUrl && (
          <Grid item xs={6}>
            <img src={imagePreviewUrl} alt="Preview" style={{ maxWidth: '200px', maxHeight: '200px' }} />
          </Grid>
        )}




        <Grid item xs= {12}>
        <h1
            style={{
                marginTop: '20px',
                marginBottom: '20px',
            }}
            >Department Information</h1>

        </Grid>


        <Grid item xs={6}>
  <FormControl fullWidth variant="outlined" error={!!errors.department}>
    <InputLabel>Department</InputLabel>
    <Select
      label="Department"
      name="department"
      value={studentData.department}
      onChange={handleChange}
    >
      {departmentNames.map((name, index) => (
        <MenuItem key={index} value={name}>{name}</MenuItem>
      ))}
    </Select>
    <FormHelperText>{errors.department}</FormHelperText>
  </FormControl>
</Grid>








            


            <Grid item xs={12}>
              <Button type="submit" variant="contained" color="primary">
                Add Student
              </Button>
            </Grid>
          </Grid>
        </form>
      </Container>
    </AdminLayout>
  );
};

export default AddStudent;
