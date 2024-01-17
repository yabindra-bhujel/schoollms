import instance from "../../../api/axios";
import React, { useEffect, useState } from "react";


const deleteStudent = async (studentID) =>{
    const endpoint = `/student/delete_student/${studentID}/`

    try{
        const response = await instance.delete(endpoint)
        return response.data

    }
    catch(err){
        throw err
    }
}


const StudentList = async (username) =>{
    const endpoint = `/student/list/${username}/`
    try{
        const response = await instance.get(endpoint)
        return response;
    }
    catch(err){
        throw err
    }

}


const getDepartementList = async() =>{
    const endpoint = `/course/department_list/`

    try{
        const response = await instance.get(endpoint)
        return response.data

    }
    catch(err){
        throw err
    }

}


const addStudent = async(data) =>{
    const endpoint = `/student/add/`

    try{
        const response = await instance.post(endpoint, data)
        return response.data

    }
    catch(err){
        throw err
    }
}


const addStudentFile = async(data) =>{
    const endpoint = `/student/add_student_by_csv_file/`

    try{
        const response = await instance.post(endpoint, data)
        return response.data

    }
    catch(err){
        throw err
    }
}

export  { StudentList, getDepartementList, addStudent, deleteStudent, addStudentFile };
