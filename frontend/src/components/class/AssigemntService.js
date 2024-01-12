import instance from "../../api/axios";


const updateSubmission = async (data)  =>{
    const endpoint = `/course/update_submission/`;
    try {
        const response = await instance.put(endpoint, data);
        return response.data;
    }
    catch(error){
        throw error
    }
    


}

export { updateSubmission }