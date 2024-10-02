import React, { useState, useEffect } from 'react';
import AdminLayout from "../navigation/NavigationLayout";
import { FormHelperText, TextField, Button, Container, Grid } from '@mui/material';
import {Input, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { addTeacher } from './TeacherService';
import { useNavigate } from 'react-router-dom';

const AddTeacher = () => {
    const [imagePreviewUrl, setImagePreviewUrl] = useState('');

    const [teacherData, setTeacherData] = useState({
        teacher_id: '',
        first_name: '',
        last_name: '',
        middle_name: '',
        phone: '',
        date_of_birth: '',
        gender: '',
        address : '',
        image: '',
      });




      const [errors, setErrors] = useState({});
        const navigator = useNavigate();

      const validateForm = () => {
        let isValid = true;
        const newErrors = {};
    
        // Validation rules
        if (!teacherData.first_name.trim()) {
          newErrors.first_name = 'First Name is required';
          isValid = false;
        }
    
        if (!teacherData.last_name.trim()) {
          newErrors.last_name = 'Last Name is required';
          isValid = false;
        }
    
    
        if (!teacherData.phone.trim()) {
          newErrors.phone = 'Phone Number is required';
          isValid = false;
        }
    
        if (!teacherData.date_of_birth.trim()) {
          newErrors.date_of_birth = 'Date of Birth is required';
          isValid = false;
        }
    
        if (!teacherData.gender.trim()) {
          newErrors.gender = 'Gender is required';
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
         const response = await addTeacher(teacherData);

            if (response.status === 201) {
                navigator('/admin/teacher');
               
            } else {
              alert('An error occurred. Please try again.');
            }
        }
      };



      const handleChange = (e) => {
        setTeacherData({ ...teacherData, [e.target.name]: e.target.value });
      };



  return (
    <AdminLayout>
      <Container>
        <h1>Add Teacher</h1>
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
                 label="Teacher ID"
                 variant="outlined"
                 fullWidth
                 name="teacher_id"
                 value={teacherData.teacher_id}
                 onChange={handleChange}
              />
            </Grid>


            <Grid item xs={6}>
              <TextField
                 label="First Name"
                 variant="outlined"
                 fullWidth
                 name="first_name"
                 value={teacherData.first_name}
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
                value={teacherData.last_name}
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
                value={teacherData.middle_name}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                label="Phone Number"
                variant="outlined"
                fullWidth
                name="phone"
                value={teacherData.phone}
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
                value={teacherData.date_of_birth}
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
                  value={teacherData.gender}
                  onChange={handleChange}
                  error = {!!errors.gender}
                  helperText = {errors.gender}

                >
                  <MenuItem value="Male">Male</MenuItem>
                  <MenuItem value="Female">Female</MenuItem>
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








            <Grid item xs={12}>
              <TextField
                label="Address"
                variant="outlined"
                fullWidth
                name="address"
                value={teacherData.address}
                onChange={handleChange}
              />

            </Grid>
            <Grid item xs={12}>
              <Button type="submit" variant="contained" color="primary">
                Add Teacher
              </Button>
            </Grid>
          </Grid>
        </form>
      </Container>
    </AdminLayout>
  );
};

export default AddTeacher;
