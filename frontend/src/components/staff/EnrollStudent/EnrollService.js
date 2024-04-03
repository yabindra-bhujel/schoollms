import instance from "../../../api/axios";

const baseURL = 'admin/subject_registration/'
const getEnrollSubjetList = async () => {
    try {
        const endpoint = baseURL;
        const response = await instance.get(endpoint);
        return response;
    } catch (error) {
        throw error;
    }
}


const addEnrollSubject = async (data) => {
    try {
        const endpoint = baseURL;
        const response = await instance.post(endpoint, data);
        return response;
    } catch (error) {
        throw error;
    }
}

export { getEnrollSubjetList , addEnrollSubject};
