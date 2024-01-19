import instance from "../../api/axios";


const getUserProfile = async (username) => {
    try {
        const endpoint = `get_user_profile_pic/${username}/`;
        const response = await instance.get(endpoint);
        return response;
    } catch (error) {
        throw error;
    }
    }


const uploadImage = async(image) =>{
    try {
        const endpoint = `update_user_profile_pic/`;
        const response = await instance.post(endpoint, image);
        return response;
    } catch (error) {
        throw error;
    }
}

const getUserProfileInfo = async() =>{
    try {
        const endpoint = `get_user_profile_details/`;
        const response = await instance.get(endpoint);
        return response;
    } catch (error) {
        throw error;
    }
}


const updateUserInfo = async(data) =>{
    try {
        const endpoint = `upadte_user_info/`;
        const response = await instance.post(endpoint, data);
        return response;
    } catch (error) {
        throw error;
    }
}


export { getUserProfile , uploadImage, getUserProfileInfo, updateUserInfo};