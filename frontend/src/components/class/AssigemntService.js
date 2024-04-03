import instance from "../../api/axios";


const updateSubmission = async (data)  =>{
    const endpoint = `/submissions/update/`;
    try {
        const response = await instance.put(endpoint, data);
        return response.data;
    }
    catch(error){
        throw error
    }
    


}

export { updateSubmission }