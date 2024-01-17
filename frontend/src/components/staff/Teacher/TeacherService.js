import instance from "../../../api/axios";



const uploadTeahcerFile = async (file) => {
    try{
        const endpoint = '/teacher/add/file/';
        const response = await instance.post(endpoint, file);
        return response;

    }catch(error){
        throw new Error(error);
    }
}



const addTeacher = async (teacherData) => {
    const endpoint = '/teacher/add/';
    try {
      const response = await instance.post(endpoint, teacherData);
      return response;
    } catch (err) {
      throw err;
    }
  };    


const getTeacherList =async() =>{
    try{
        const response = await instance.get(`/teacher/list/`);
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

export { getTeacherList , deleteTeacher, addTeacher, uploadTeahcerFile}