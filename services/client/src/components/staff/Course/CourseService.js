import instance from "../../../api/axios";

const baseURL = 'admin/subject/'

const getTeacherList =async() =>{
    try{
        const response = await instance.get(`admin/teachers/`);
        return response.data;
    }catch(error){
        throw new Error(error);
    }
}




const adminCourseAdd = async (courseData) => {
    try {
        const endpoint = baseURL;
        const response = await instance.post(endpoint, courseData);
        return response;
    } catch (error) {
        throw new Error(error);
    }
}

const AdminCourseList = async () => {
    try {
        const endpoint = baseURL;
        const response = await instance.get(endpoint);
        return response.data;
    } catch (error) {
        console.log(error);
    }
}



const DeleteCourse = async (course_id) => {
    try {
        const endpoint = `${baseURL}${course_id}/`;
        const response = await instance.delete(endpoint);
        return response.data;
    } catch (error) {
        console.log(error);
    }



}


const getDepartmentList = async () => {
    try {
      const endpoint = "admin/departments/";
      const response = await instance.get(endpoint);
      return response.data;
    } catch (error) {
        throw error;
    }
  };


export { AdminCourseList , DeleteCourse, getTeacherList, getDepartmentList, adminCourseAdd}
