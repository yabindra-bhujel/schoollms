import instance from "../../../api/axios";




const getExambyID = async(examID) => {
    try {
        const endpoint = `/exam/details/${examID}/`;
        const response = await instance.get(endpoint);
        if (response.data) {
            const examdata = response.data;
            return examdata;
        } else {
            throw new Error('No data found for the specified exam ID');
        }
    } catch (error) {
        throw error;
    }
}



const updateExma = async(examID, data) => {
    try {
        const endpoint = `/exam/update/${examID}/`;
        const response = await instance.put(endpoint, data);
        if (response.data) {
            const examdata = response.data;
            return examdata;
        } else {
            throw new Error('No data found for the specified exam ID');
        }
    } catch (error) {
        throw error;
    }
    
}

export { getExambyID, updateExma };