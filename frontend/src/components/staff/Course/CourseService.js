import instance from "../../../api/axios";


const getTeacherList =async() =>{
    try{
        const response = await instance.get(`/teacher/list/`);
        return response.data;
    }catch(error){
        throw new Error(error);
    }
}




const adminCourseAdd = async (courseData) => {
    try {
        const endpoint = `/course/create_course/`;
        const response = await instance.post(endpoint, courseData);
        return response;
    } catch (error) {
        throw new Error(error);
    }
}

const AdminCourseList = async () => {
    try {
        const endpoint = `/course/admin/`;
        const response = await instance.get(endpoint);
        return response.data;
    } catch (error) {
        console.log(error);
    }
}



const DeleteCourse = async (username, course_id) => {
    try {
        const endpoint = `/course/delete_course/${course_id}/${username}/`;
        const response = await instance.delete(endpoint);
        return response.data;
    } catch (error) {
        console.log(error);
    }



}


const getDepartmentList = async () => {
    try {
      const endpoint = "/course/department_list/";
      const response = await instance.get(endpoint);
      return response.data;
    } catch (error) {
        throw error;
    }
  };


export { AdminCourseList , DeleteCourse, getTeacherList, getDepartmentList, adminCourseAdd}
