import instance from "../../../api/axios";


const getTeacherList =async(username) =>{
    try{
        const response = await instance.get(`/teacher/list/${username}/`);
        return response.data;
    }catch(error){
        throw new Error(error);
    }
}




const deleteTeacher = async(teacherID) =>{
    const endpoint = `teacher/delete/${teacherID}/`;
    try{
        const response = await instance.delete(endpoint);
        return response.data;
        } catch (err) {
            throw err

        }
}

export { getTeacherList , deleteTeacher}