import instance from "../../../api/axios";

const baseURL = 'admin/students/'

const deleteStudent = async (studentID) =>{
    const endpoint = `${baseURL}${studentID}/`

    try{
        const response = await instance.delete(endpoint)
        return response.data

    }
    catch(err){
        throw err
    }
}

const StudentList = async () =>{
    const endpoint = `${baseURL}`
    try{
        const response = await instance.get(endpoint)
        return response;
    }
    catch(err){
        throw err
    }

}

const getDepartementList = async() =>{
  const endpoint = 'admin/departments/'

    try{
        const response = await instance.get(endpoint)
        return response.data

    }
    catch(err){
        throw err
    }

}


const addStudent = async(data) =>{
    const endpoint = `${baseURL}`

    try{
        const response = await instance.post(endpoint, data)
        return response
    }
    catch(err){
        throw err
    }
}


const addStudentFile = async(data) =>{
    const endpoint = `${baseURL}add-student-from-file/`

    try{
        const response = await instance.post(endpoint, data)
        return response.data

    }
    catch(err){
        throw err
    }
}

export  { StudentList, getDepartementList, addStudent, deleteStudent, addStudentFile };
