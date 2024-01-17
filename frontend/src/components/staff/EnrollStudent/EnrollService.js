import instance from "../../../api/axios";

const getEnrollSubjetList = async (username) => {
    try {
        const endpoint = `/course/get_subject_enroll/${username}/`;
        const response = await instance.get(endpoint);
        return response;
    } catch (error) {
        throw error;
    }
}


const addEnrollSubject = async (username, data) => {
    try {
        const endpoint = `/course/create_enroll_subject/${username}/`;
        const response = await instance.post(endpoint, data);
        return response;
    } catch (error) {
        throw error;
    }
}

export { getEnrollSubjetList , addEnrollSubject};
